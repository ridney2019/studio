import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "crypto";

const PASSWORD_MIN_LENGTH = 12;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

const ownerEmails = (process.env.OWNER_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().replace(/^"|"$/g, "").toLowerCase())
  .filter(Boolean);

const ownerEmailSet = new Set(ownerEmails);

export const normalizeEmail = (email?: string | null): string =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

export const isAllowedAdminEmail = (email?: string | null): boolean => {
  const normalized = normalizeEmail(email);
  return normalized.length > 0 && ownerEmailSet.has(normalized);
};

export const validateOwnerPassword = (password: string): string | null => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include a lowercase letter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include a number.";
  }

  return null;
};

export const hashPassword = async (password: string): Promise<string> => hash(password, 12);

export const verifyPassword = async (password: string, passwordHash: string): Promise<boolean> =>
  compare(password, passwordHash);

export const createRawToken = (): string => randomBytes(32).toString("hex");

export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export const createExpiryDate = (ttlMs: number): Date => new Date(Date.now() + ttlMs);

export const buildAppUrl = (path: string): string => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return new URL(path, baseUrl).toString();
};

export const ownerAuthConfigChecks = {
  hasOwnerAllowlist: ownerEmailSet.size > 0,
  hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  hasEmailFrom: Boolean(process.env.EMAIL_FROM),
  hasSmtpConfig: Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
  ),
  hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
  hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
  hasNextAuthUrl: Boolean(process.env.NEXTAUTH_URL),
  ownerAllowlistCount: ownerEmailSet.size,
};

export const ownerEmailDeliveryAvailable = (): boolean =>
  Boolean(process.env.EMAIL_FROM) &&
  (ownerAuthConfigChecks.hasSmtpConfig || ownerAuthConfigChecks.hasResendApiKey || process.env.NODE_ENV !== "production");

export const passwordResetExpiresAt = (): Date => createExpiryDate(PASSWORD_RESET_TTL_MS);

export const verificationExpiresAt = (): Date => createExpiryDate(EMAIL_VERIFICATION_TTL_MS);