import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const ownerEmails = (process.env.OWNER_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().replace(/^"|"$/g, "").toLowerCase())
    .filter(Boolean);

  const checks = {
    hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
    hasGoogleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    hasOwnerAllowlist: ownerEmails.length > 0,
    hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
    hasNextAuthUrl: Boolean(process.env.NEXTAUTH_URL),
    ownerAllowlistCount: ownerEmails.length,
  };

  const callbackPath = "/api/auth/callback/google";
  const nextAuthUrl = process.env.NEXTAUTH_URL || null;
  const expectedGoogleRedirectUri = nextAuthUrl ? `${nextAuthUrl}${callbackPath}` : null;

  const ok =
    checks.hasGoogleClientId &&
    checks.hasGoogleClientSecret &&
    checks.hasOwnerAllowlist &&
    checks.hasNextAuthSecret &&
    checks.hasNextAuthUrl;

  const notes: string[] = [];
  if (!checks.hasGoogleClientId) notes.push("Missing GOOGLE_CLIENT_ID");
  if (!checks.hasGoogleClientSecret) notes.push("Missing GOOGLE_CLIENT_SECRET");
  if (!checks.hasOwnerAllowlist) notes.push("Missing OWNER_ADMIN_EMAILS");
  if (!checks.hasNextAuthSecret) notes.push("Missing NEXTAUTH_SECRET");
  if (!checks.hasNextAuthUrl) notes.push("Missing NEXTAUTH_URL");

  return NextResponse.json(
    {
      ok,
      checks,
      providerConfigured: checks.hasGoogleClientId && checks.hasGoogleClientSecret,
      nextAuthUrl,
      expectedGoogleRedirectUri,
      callbackPath,
      notes,
    },
    { status: ok ? 200 : 500 }
  );
}
