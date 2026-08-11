import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashToken, validateOwnerPassword } from "@/lib/owner-auth";
import { enforceRateLimit, getRequestIp } from "@/lib/rate-limit";

const resetSchema = z
  .object({
    token: z.string().min(32),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rateLimit = enforceRateLimit(`owner-reset:${ip}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, message: "Too many reset attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const parsed = resetSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: parsed.error.issues[0]?.message || "Invalid request." },
        { status: 400 }
      );
    }

    const passwordError = validateOwnerPassword(parsed.data.password);
    if (passwordError) {
      return NextResponse.json({ ok: false, message: passwordError }, { status: 400 });
    }

    const tokenHash = hashToken(parsed.data.token);
    const resetToken = await prisma.ownerPasswordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken || resetToken.consumedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, message: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.$transaction([
      prisma.ownerUser.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.ownerPasswordResetToken.update({
        where: { id: resetToken.id },
        data: { consumedAt: new Date() },
      }),
      prisma.ownerPasswordResetToken.deleteMany({
        where: { userId: resetToken.userId, id: { not: resetToken.id } },
      }),
    ]);

    return NextResponse.json({ ok: true, message: "Password updated. You can sign in now." });
  } catch (error) {
    console.error("[owner-admin][reset-password]", error);
    return NextResponse.json(
      { ok: false, message: "Password reset failed on the server. Check server logs." },
      { status: 500 }
    );
  }
}