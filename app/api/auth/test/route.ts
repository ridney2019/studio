import { NextResponse } from "next/server";
import { ownerAuthConfigChecks, ownerEmailDeliveryAvailable } from "@/lib/owner-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const checks = ownerAuthConfigChecks;
  const nextAuthUrl = process.env.NEXTAUTH_URL || null;
  const hasEmailDelivery = ownerEmailDeliveryAvailable();

  const ok =
    checks.hasOwnerAllowlist &&
    checks.hasDatabaseUrl &&
    checks.hasNextAuthSecret &&
    checks.hasNextAuthUrl &&
    hasEmailDelivery;

  const notes: string[] = [];
  if (!checks.hasOwnerAllowlist) notes.push("Missing OWNER_ADMIN_EMAILS");
  if (!checks.hasDatabaseUrl) notes.push("Missing DATABASE_URL");
  if (!checks.hasEmailFrom) notes.push("Missing EMAIL_FROM");
  if (!checks.hasSmtpConfig && process.env.NODE_ENV === "production") notes.push("Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD");
  if (!checks.hasNextAuthSecret) notes.push("Missing NEXTAUTH_SECRET");
  if (!checks.hasNextAuthUrl) notes.push("Missing NEXTAUTH_URL");

  return NextResponse.json(
    {
      ok,
      checks,
      hasEmailDelivery,
      providerConfigured: checks.hasOwnerAllowlist && checks.hasDatabaseUrl,
      nextAuthUrl,
      notes,
    },
    { status: ok ? 200 : 500 }
  );
}
