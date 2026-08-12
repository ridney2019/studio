"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { readApiMessage } from "@/lib/api-response";

function OwnerVerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("This verification link is missing its token.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await readApiMessage(response);
      setIsLoading(false);

      if (!response.ok || !data.ok) {
        setError(data.message || "Email verification failed.");
        return;
      }

      setMessage(data.message || "Email verified.");
    };

    verify();
  }, [token]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "460px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "18px", padding: "2rem", display: "grid", gap: "1rem", background: "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,248,248,0.97) 100%)", boxShadow: "0 14px 34px rgba(0,0,0,0.1)" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Verify Owner Email</h1>
        <p style={{ margin: 0, opacity: 0.75 }}>
          {isLoading ? "Verifying your email now..." : "Your verification result is below."}
        </p>
        {error ? <p style={{ margin: 0, color: "#8a0017" }}>{error}</p> : null}
        {message ? <p style={{ margin: 0, color: "#0c5a2a" }}>{message}</p> : null}
        <Link href="/admin/artists" style={{ opacity: 0.7, textDecoration: "none", color: "inherit" }}>
          Continue to sign in
        </Link>
      </div>
    </main>
  );
}

export default function OwnerVerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
          <p style={{ margin: 0, opacity: 0.7 }}>Loading verification page...</p>
        </main>
      }
    >
      <OwnerVerifyEmailPageContent />
    </Suspense>
  );
}