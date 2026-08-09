import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ownerEmails = (process.env.OWNER_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().replace(/^"|"$/g, "").toLowerCase())
  .filter(Boolean);
const ownerEmailSet = new Set(ownerEmails);

const isAllowedAdminEmail = (email?: string | null): boolean => {
  if (!email) {
    return false;
  }
  return ownerEmailSet.has(email.trim().toLowerCase());
};

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

const providers = [];
if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

export const authConfigChecks = {
  hasGoogleClientId: Boolean(googleClientId),
  hasGoogleClientSecret: Boolean(googleClientSecret),
  hasOwnerAllowlist: ownerEmailSet.size > 0,
  hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
  hasNextAuthUrl: Boolean(nextAuthUrl),
  ownerAllowlistCount: ownerEmailSet.size,
};

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/artists",
    error: "/admin/artists",
  },
  callbacks: {
    signIn({ user }) {
      return isAllowedAdminEmail(user.email);
    },
    jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (typeof email === "string") {
        token.email = email.toLowerCase();
      }
      token.isAdmin = isAllowedAdminEmail(token.email as string | undefined);
      return token;
    },
    session({ session, token }) {
      if (session.user?.email && typeof token.email === "string") {
        session.user.email = token.email;
      }
      session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    },
    redirect({ baseUrl }) {
      return `${baseUrl}/admin/artists`;
    },
  },
};
