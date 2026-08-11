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

// Runtime environment validation
function validateEnvironment() {
  const required = {
    DATABASE_URL: process.env.DATABASE_URL,
    EMAIL_FROM: process.env.EMAIL_FROM,
    OWNER_ADMIN_EMAILS: process.env.OWNER_ADMIN_EMAILS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const err = new Error(`Missing required environment variables: ${missing.join(", ")}`);
    console.error("[owner-admin][register][env-check]", err.message);
    throw err;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    // 1. Validate environment first
    validateEnvironment();
    console.log("[owner-admin][register] Environment validation passed");

    // 2. Rate limiting
    const ip = getRequestIp(request);
    const rateLimit = enforceRateLimit(`owner-register:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      console.warn("[owner-admin][register] Rate limit exceeded for IP:", ip);
      return NextResponse.json(
        { ok: false, message: "Too many registration attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    // 3. Parse request body
    let bodyData: unknown;
    try {
      bodyData = await request.json();
    } catch (parseError) {
      console.error("[owner-admin][register] JSON parse error:", parseError instanceof Error ? parseError.message : String(parseError));
      return NextResponse.json(
        { ok: false, message: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const parsed = registerSchema.safeParse(bodyData);
    if (!parsed.success) {
      console.warn("[owner-admin][register] Validation error:", parsed.error.issues[0]);
      return NextResponse.json(
        { ok: false, message: parsed.error.issues[0]?.message || "Invalid request." },
        { status: 400 }
      );
    }

    // 4. Normalize and validate email
    const email = normalizeEmail(parsed.data.email);
    console.log("[owner-admin][register] Registration attempt for email:", email);

    // 5. Check email allowlist
    if (!isAllowedAdminEmail(email)) {
      console.warn("[owner-admin][register] Email not in allowlist:", email);
      console.log("[owner-admin][register] Allowed emails:", process.env.OWNER_ADMIN_EMAILS);
      return NextResponse.json(
        { ok: false, message: "This email is not approved for owner admin access." },
        { status: 403 }
      );
    }

    // 6. Validate password
    const passwordError = validateOwnerPassword(parsed.data.password);
    if (passwordError) {
      console.warn("[owner-admin][register] Password validation failed:", passwordError);
      return NextResponse.json({ ok: false, message: passwordError }, { status: 400 });
    }

    // 7. Hash password
    let passwordHash: string;
    try {
      passwordHash = await hashPassword(parsed.data.password);
      console.log("[owner-admin][register] Password hashed successfully");
    } catch (hashError) {
      console.error("[owner-admin][register] Password hashing failed:", hashError instanceof Error ? hashError.message : String(hashError));
      throw new Error("Failed to hash password");
    }

    // 8. Database: Check for existing user
    let existingUser;
    try {
      console.log("[owner-admin][register] Querying database for existing user...");
      existingUser = await prisma.ownerUser.findUnique({ where: { email } });
      console.log("[owner-admin][register] Existing user query result:", existingUser ? "found" : "not found");
    } catch (dbError) {
      const dbErrorMsg = dbError instanceof Error ? dbError.message : String(dbError);
      console.error("[owner-admin][register] Database query failed:", dbErrorMsg);
      console.error("[owner-admin][register] Database error details:", dbError);
      throw new Error(`Database connection failed: ${dbErrorMsg}`);
    }

    if (existingUser?.emailVerifiedAt) {
      console.warn("[owner-admin][register] Email already has verified account:", email);
      return NextResponse.json(
        { ok: false, message: "An owner admin account already exists for this email." },
        { status: 409 }
      );
    }

    // 9. Database: Create or update owner user
    let owner;
    try {
      console.log("[owner-admin][register] Creating/updating owner user...");
      owner = existingUser
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
      console.log("[owner-admin][register] Owner user created/updated successfully:", owner.id);
    } catch (createError) {
      const createErrorMsg = createError instanceof Error ? createError.message : String(createError);
      console.error("[owner-admin][register] Failed to create/update user:", createErrorMsg);
      console.error("[owner-admin][register] Database error code:", (createError as any)?.code);
      throw new Error(`Failed to create owner account: ${createErrorMsg}`);
    }

    // 10. Database: Create verification token
    let token;
    let rawToken: string;
    try {
      console.log("[owner-admin][register] Creating verification token...");
      rawToken = createRawToken();
      token = await prisma.ownerVerificationToken.create({
        data: {
          tokenHash: hashToken(rawToken),
          expiresAt: verificationExpiresAt(),
          userId: owner.id,
        },
      });
      console.log("[owner-admin][register] Verification token created successfully");
    } catch (tokenError) {
      const tokenErrorMsg = tokenError instanceof Error ? tokenError.message : String(tokenError);
      console.error("[owner-admin][register] Failed to create verification token:", tokenErrorMsg);
      throw new Error(`Failed to create verification token: ${tokenErrorMsg}`);
    }

    // 11. Email: Send verification email
    try {
      console.log("[owner-admin][register] Sending verification email to:", email);
      const verificationUrl = buildAppUrl(`/admin/verify-email?token=${rawToken}`);
      console.log("[owner-admin][register] Verification URL:", verificationUrl);
      await sendOwnerVerificationEmail(email, verificationUrl);
      console.log("[owner-admin][register] Verification email sent successfully");
    } catch (emailError) {
      const emailErrorMsg = emailError instanceof Error ? emailError.message : String(emailError);
      console.error("[owner-admin][register] Email sending failed:", emailErrorMsg);
      console.error("[owner-admin][register] Email error details:", emailError);
      throw new Error(`Failed to send verification email: ${emailErrorMsg}`);
    }

    console.log("[owner-admin][register] Registration completed successfully for:", email);
    return NextResponse.json({
      ok: true,
      message:
        "Registration started. Check your email for the verification link before signing in.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "N/A";

    console.error("═══════════════════════════════════════════════════════════");
    console.error("[owner-admin][register] FATAL ERROR");
    console.error("═══════════════════════════════════════════════════════════");
    console.error("Message:", errorMessage);
    console.error("Stack:", errorStack);
    console.error("Full error:", error);
    console.error("═══════════════════════════════════════════════════════════");

    return NextResponse.json(
      { ok: false, message: "Registration failed on the server. Check env setup and server logs." },
      { status: 500 }
    );
  }
}