import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/owner-auth";
import { enforceRateLimit, getRequestIp } from "@/lib/rate-limit";

const verifySchema = z.object({ token: z.string().min(32) });

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rateLimit = enforceRateLimit(`owner-verify:${ip}`, 20, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, message: "Too many verification attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const parsed = verifySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Invalid verification token." }, { status: 400 });
    }

    const tokenHash = hashToken(parsed.data.token);
    const verification = await prisma.ownerVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!verification || verification.consumedAt || verification.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, message: "This verification link is invalid or has expired." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.ownerUser.update({
        where: { id: verification.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.ownerVerificationToken.update({
        where: { id: verification.id },
        data: { consumedAt: new Date() },
      }),
      prisma.ownerVerificationToken.deleteMany({
        where: { userId: verification.userId, id: { not: verification.id } },
      }),
    ]);

    return NextResponse.json({ ok: true, message: "Email verified. You can sign in now." });
  } catch (error) {
    console.error("[owner-admin][verify-email]", error);
    return NextResponse.json(
      { ok: false, message: "Email verification failed on the server. Check server logs." },
      { status: 500 }
    );
  }
}