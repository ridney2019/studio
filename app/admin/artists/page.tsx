"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import ArtistAdminClient from "./ArtistAdminClient";

export default function ArtistAdminPage() {
  const { data: session, status } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAuthError(params.get("error"));
  }, []);

  if (status === "loading") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <p style={{ margin: 0, opacity: 0.7 }}>Checking owner access...</p>
      </main>
    );
  }

  if (!session?.user?.email) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Owner Artist Admin</h1>
          <p style={{ margin: 0, opacity: 0.75 }}>
            Sign in with your Google owner account to manage artists.
          </p>
          {authError ? (
            <p style={{ margin: 0, color: "#8a0017", background: "rgba(176, 0, 32, 0.08)", border: "1px solid rgba(176, 0, 32, 0.3)", borderRadius: "10px", padding: "0.7rem 0.8rem" }}>
              Access denied for this Google account. Use the approved owner email.
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/admin/artists" })}
            style={{
              border: 0,
              borderRadius: "999px",
              padding: "0.75rem 1rem",
              fontWeight: 700,
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Continue with Google
          </button>
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
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/artists" })}
          style={{
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "999px",
            padding: "0.55rem 0.9rem",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </header>

      <ArtistAdminClient />
    </main>
  );
}
