"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import ArtistAdminClient from "./ArtistAdminClient";

type AuthTestResponse = {
  ok: boolean;
  notes?: string[];
};

export default function ArtistAdminPage() {
  const { data: session, status } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authConfigOk, setAuthConfigOk] = useState<boolean | null>(null);
  const [authConfigNotes, setAuthConfigNotes] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authErrorMessage =
    authError === "CredentialsSignin"
      ? "Invalid owner credentials. Check the approved email and admin password."
      : authError === "AccessDenied"
        ? "Access denied for this owner account. Use an approved owner email."
      : authError && authConfigOk === false
        ? `Owner admin login is not configured correctly yet: ${authConfigNotes.join(", ") || "missing required auth environment variables"}.`
      : authError && authConfigOk === true
        ? "Owner admin login failed even though the environment looks correct. Check the server console for the raw NextAuth error."
      : authError
        ? "Owner admin login failed. If this keeps happening, check /api/auth/test."
        : null;

  const handleCredentialsSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin/artists",
    });

    setIsSubmitting(false);

    if (!result) {
      setAuthError("UnknownError");
      return;
    }

    if (result.error) {
      setAuthError(result.error);
      return;
    }

    window.location.href = result.url || "/admin/artists";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAuthError(params.get("error"));

    const loadAuthConfigStatus = async () => {
      try {
        const response = await fetch("/api/auth/test", { cache: "no-store" });
        const data: AuthTestResponse = await response.json();
        setAuthConfigOk(Boolean(data.ok));
        setAuthConfigNotes(Array.isArray(data.notes) ? data.notes : []);
      } catch {
        setAuthConfigOk(null);
        setAuthConfigNotes([]);
      }
    };

    loadAuthConfigStatus();
  }, []);

  if (status === "loading") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <p style={{ margin: 0, opacity: 0.7 }}>Checking owner access...</p>
      </main>
    );
  }

  if (!session?.user?.email || !session.user.isAdmin) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "18px",
            padding: "2rem",
            display: "grid",
            gap: "1rem",
            background: "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,248,248,0.97) 100%)",
            boxShadow: "0 14px 34px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Owner Artist Admin</h1>
          <p style={{ margin: 0, opacity: 0.75 }}>
            Sign in with your owner email and admin password to manage artists.
          </p>
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.65 }}>
            First time here? Register your owner account, verify it from email, then sign in.
          </p>
          {session?.user?.email && !session.user.isAdmin ? (
            <p style={{ margin: 0, color: "#8a0017", background: "rgba(176, 0, 32, 0.08)", border: "1px solid rgba(176, 0, 32, 0.3)", borderRadius: "10px", padding: "0.7rem 0.8rem" }}>
              Signed in account is not authorized for owner admin access.
            </p>
          ) : null}
          {authErrorMessage ? (
            <p style={{ margin: 0, color: "#8a0017", background: "rgba(176, 0, 32, 0.08)", border: "1px solid rgba(176, 0, 32, 0.3)", borderRadius: "10px", padding: "0.7rem 0.8rem" }}>
              {authErrorMessage}
            </p>
          ) : null}
          {authConfigOk === true ? (
            <p style={{ margin: 0, color: "#0c5a2a", background: "rgba(15, 130, 68, 0.08)", border: "1px solid rgba(15, 130, 68, 0.28)", borderRadius: "10px", padding: "0.7rem 0.8rem" }}>
              Auth environment detected correctly.
            </p>
          ) : null}
          {authConfigOk === false && !authErrorMessage ? (
            <p style={{ margin: 0, color: "#8a0017", background: "rgba(176, 0, 32, 0.08)", border: "1px solid rgba(176, 0, 32, 0.3)", borderRadius: "10px", padding: "0.7rem 0.8rem" }}>
              Missing auth configuration: {authConfigNotes.join(", ") || "unknown issue"}.
            </p>
          ) : null}
          <form onSubmit={handleCredentialsSignIn} style={{ display: "grid", gap: "0.85rem" }}>
            <label style={{ display: "grid", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Owner Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={{
                  width: "100%",
                  border: "1px solid rgba(0,0,0,0.14)",
                  borderRadius: "12px",
                  padding: "0.8rem 0.9rem",
                  font: "inherit",
                  background: "#fff",
                }}
              />
            </label>
            <label style={{ display: "grid", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Admin Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={{
                  width: "100%",
                  border: "1px solid rgba(0,0,0,0.14)",
                  borderRadius: "12px",
                  padding: "0.8rem 0.9rem",
                  font: "inherit",
                  background: "#fff",
                }}
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: 0,
                borderRadius: "999px",
                padding: "0.75rem 1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #6f0000 0%, #b2001a 55%, #ff4d4d 100%)",
                color: "#fff",
                cursor: isSubmitting ? "wait" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 10px 24px rgba(109, 6, 17, 0.28)",
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/admin/register" style={{ opacity: 0.7, textDecoration: "none", color: "inherit" }}>
              Register owner account
            </Link>
            <Link href="/admin/forgot-password" style={{ opacity: 0.7, textDecoration: "none", color: "inherit" }}>
              Forgot password?
            </Link>
          </div>
          <Link href="/" style={{ opacity: 0.7, textDecoration: "none", color: "inherit" }}>
            Back to site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem 4rem", display: "grid", gap: "1.2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Artist Admin</h1>
          <p style={{ margin: "0.35rem 0 0", opacity: 0.75 }}>
            Signed in as {session.user.email}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link
            href="/admin/content"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "999px",
              padding: "0.55rem 0.9rem",
              background: "linear-gradient(135deg, #5c0000 0%, #a30015 55%, #ff4d4d 100%)",
              cursor: "pointer",
              textDecoration: "none",
              color: "#fff",
            }}
          >
            Content Admin
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/artists" })}
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "999px",
              padding: "0.55rem 0.9rem",
              background: "linear-gradient(135deg, #2f2f2f 0%, #111 100%)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <ArtistAdminClient />
    </main>
  );
}
