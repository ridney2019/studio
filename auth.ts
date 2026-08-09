import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ownerEmails = (process.env.OWNER_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers = [];
if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

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
      const email = user.email?.toLowerCase();
      if (!email) {
        return false;
      }

      if (ownerEmails.length === 0) {
        return false;
      }

      return ownerEmails.includes(email);
    },
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email.toLowerCase();
      }
      return token;
    },
    session({ session, token }) {
      if (session.user?.email && typeof token.email === "string") {
        session.user.email = token.email;
      }
      return session;
    },
  },
};
