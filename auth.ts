import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import {
  isAllowedAdminEmail,
  normalizeEmail,
  ownerAuthConfigChecks,
  verifyPassword,
} from "@/lib/owner-auth";

const providers = [
  CredentialsProvider({
    name: "Owner Admin",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = normalizeEmail(credentials?.email);
      const password = credentials?.password;

      if (!email || !password) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[next-auth][credentials-denied]", {
            reason: "missing_credentials",
            email: email ?? null,
          });
        }
        return null;
      }

      const owner = await prisma.ownerUser.findUnique({
        where: { email },
      });

      if (!owner) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[next-auth][credentials-denied]", {
            reason: "owner_not_found",
            email,
          });
        }
        return null;
      }

      if (!isAllowedAdminEmail(owner.email)) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[next-auth][credentials-denied]", {
            reason: "email_not_allowed",
            email,
          });
        }
        return null;
      }

      if (!owner.emailVerifiedAt) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[next-auth][credentials-denied]", {
            reason: "email_not_verified",
            email,
          });
        }
        return null;
      }

      const passwordMatches = await verifyPassword(password, owner.passwordHash);
      if (!passwordMatches) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[next-auth][credentials-denied]", {
            reason: "password_mismatch",
            email,
          });
        }
        return null;
      }

      return {
        id: owner.id,
        email: owner.email,
        name: owner.email,
      };
    },
  }),
];

export const authConfigChecks = ownerAuthConfigChecks;

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  logger:
    process.env.NODE_ENV === "development"
      ? {
          error(code, metadata) {
            console.error("[next-auth][error]", code, metadata);
          },
        }
      : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/artists",
    error: "/admin/artists",
  },
  callbacks: {
    signIn({ user }) {
      const allowed = isAllowedAdminEmail(user.email);
      if (!allowed && process.env.NODE_ENV === "development") {
        console.warn("[next-auth][signIn-denied]", { email: user.email ?? null });
      }
      return allowed;
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
