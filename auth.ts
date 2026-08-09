import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ownerEmails = (process.env.OWNER_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt" },
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
