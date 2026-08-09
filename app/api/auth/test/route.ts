import { NextResponse } from "next/server";
import { authConfigChecks } from "@/auth";

export async function GET() {
  const callbackPath = "/api/auth/callback/google";
  const nextAuthUrl = process.env.NEXTAUTH_URL || null;
  const expectedGoogleRedirectUri = nextAuthUrl ? `${nextAuthUrl}${callbackPath}` : null;

  const ok =
    authConfigChecks.hasGoogleClientId &&
    authConfigChecks.hasGoogleClientSecret &&
    authConfigChecks.hasOwnerAllowlist &&
    authConfigChecks.hasNextAuthSecret &&
    authConfigChecks.hasNextAuthUrl;

  const notes: string[] = [];
  if (!authConfigChecks.hasGoogleClientId) notes.push("Missing GOOGLE_CLIENT_ID");
  if (!authConfigChecks.hasGoogleClientSecret) notes.push("Missing GOOGLE_CLIENT_SECRET");
  if (!authConfigChecks.hasOwnerAllowlist) notes.push("Missing OWNER_ADMIN_EMAILS");
  if (!authConfigChecks.hasNextAuthSecret) notes.push("Missing NEXTAUTH_SECRET");
  if (!authConfigChecks.hasNextAuthUrl) notes.push("Missing NEXTAUTH_URL");

  return NextResponse.json(
    {
      ok,
      checks: authConfigChecks,
      providerConfigured: authConfigChecks.hasGoogleClientId && authConfigChecks.hasGoogleClientSecret,
      nextAuthUrl,
      expectedGoogleRedirectUri,
      callbackPath,
      notes,
    },
    { status: ok ? 200 : 500 }
  );
}
