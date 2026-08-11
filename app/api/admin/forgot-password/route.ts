import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  buildAppUrl,
  createRawToken,
  hashToken,
  isAllowedAdminEmail,
  normalizeEmail,
  passwordResetExpiresAt,
} from "@/lib/owner-auth";
import { sendOwnerPasswordResetEmail } from "@/lib/email";
import { enforceRateLimit, getRequestIp } from "@/lib/rate-limit";

const forgotSchema = z.object({ email: z.string().email() });

const genericResponse = {
  ok: true,
  message: "If the email can be used for owner admin access, a reset link has been sent.",
};

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rateLimit = enforceRateLimit(`owner-forgot:${ip}`, 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, message: "Too many reset attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const parsed = forgotSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(genericResponse);
    }

    const email = normalizeEmail(parsed.data.email);
    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json(genericResponse);
    }

    const owner = await prisma.ownerUser.findUnique({ where: { email } });
    if (!owner || !owner.emailVerifiedAt) {
      return NextResponse.json(genericResponse);
    }

    const rawToken = createRawToken();
    await prisma.ownerPasswordResetToken.create({
      data: {
        tokenHash: hashToken(rawToken),
        expiresAt: passwordResetExpiresAt(),
        userId: owner.id,
      },
    });

    await sendOwnerPasswordResetEmail(email, buildAppUrl(`/admin/reset-password?token=${rawToken}`));

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("[owner-admin][forgot-password]", error);
    return NextResponse.json(
      { ok: false, message: "Password reset could not be started. Check server logs." },
      { status: 500 }
    );
  }
}