import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  buildAppUrl,
  createRawToken,
  hashPassword,
  hashToken,
  isAllowedAdminEmail,
  normalizeEmail,
  validateOwnerPassword,
  verificationExpiresAt,
} from "@/lib/owner-auth";
import { sendOwnerVerificationEmail } from "@/lib/email";
import { enforceRateLimit, getRequestIp } from "@/lib/rate-limit";

const registerSchema = z
  .object({
    email: z.string().email(),
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
    const rateLimit = enforceRateLimit(`owner-register:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, message: "Too many registration attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: parsed.error.issues[0]?.message || "Invalid request." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const passwordError = validateOwnerPassword(parsed.data.password);

    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "This email is not approved for owner admin access." },
        { status: 403 }
      );
    }

    if (passwordError) {
      return NextResponse.json({ ok: false, message: passwordError }, { status: 400 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const existingUser = await prisma.ownerUser.findUnique({ where: { email } });

    if (existingUser?.emailVerifiedAt) {
      return NextResponse.json(
        { ok: false, message: "An owner admin account already exists for this email." },
        { status: 409 }
      );
    }

    const owner = existingUser
      ? await prisma.ownerUser.update({
          where: { id: existingUser.id },
          data: {
            passwordHash,
            emailVerifiedAt: null,
            verificationTokens: { deleteMany: {} },
            resetTokens: { deleteMany: {} },
          },
        })
      : await prisma.ownerUser.create({
          data: {
            email,
            passwordHash,
          },
        });

    const rawToken = createRawToken();
    await prisma.ownerVerificationToken.create({
      data: {
        tokenHash: hashToken(rawToken),
        expiresAt: verificationExpiresAt(),
        userId: owner.id,
      },
    });

    await sendOwnerVerificationEmail(email, buildAppUrl(`/admin/verify-email?token=${rawToken}`));

    return NextResponse.json({
      ok: true,
      message:
        "Registration started. Check your email for the verification link before signing in.",
    });
  } catch (error) {
    console.error("[owner-admin][register]", error);
    return NextResponse.json(
      { ok: false, message: "Registration failed on the server. Check env setup and server logs." },
      { status: 500 }
    );
  }
}