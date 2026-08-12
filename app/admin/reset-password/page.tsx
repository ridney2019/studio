"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { readApiMessage } from "@/lib/api-response";

function OwnerResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const data = await readApiMessage(response);
    setIsSubmitting(false);

    if (!response.ok || !data.ok) {
      setError(data.message || "Password reset failed.");
      return;
    }

    setMessage(data.message || "Password updated.");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "460px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "18px", padding: "2rem", display: "grid", gap: "1rem", background: "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,248,248,0.97) 100%)", boxShadow: "0 14px 34px rgba(0,0,0,0.1)" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Choose a New Password</h1>
        <p style={{ margin: 0, opacity: 0.75 }}>
          Set a new owner admin password for your verified email address.
        </p>
        {!token ? <p style={{ margin: 0, color: "#8a0017" }}>This reset link is missing its token.</p> : null}
        {error ? <p style={{ margin: 0, color: "#8a0017" }}>{error}</p> : null}
        {message ? <p style={{ margin: 0, color: "#0c5a2a" }}>{message}</p> : null}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem" }}>
          <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" required disabled={!token} style={{ width: "100%", border: "1px solid rgba(0,0,0,0.14)", borderRadius: "12px", padding: "0.8rem 0.9rem", font: "inherit", background: "#fff" }} />
          <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" required disabled={!token} style={{ width: "100%", border: "1px solid rgba(0,0,0,0.14)", borderRadius: "12px", padding: "0.8rem 0.9rem", font: "inherit", background: "#fff" }} />
          <button type="submit" disabled={isSubmitting || !token} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: 0, borderRadius: "999px", padding: "0.75rem 1rem", fontWeight: 700, background: "linear-gradient(135deg, #6f0000 0%, #b2001a 55%, #ff4d4d 100%)", color: "#fff", cursor: isSubmitting ? "wait" : "pointer", opacity: isSubmitting || !token ? 0.7 : 1, boxShadow: "0 10px 24px rgba(109, 6, 17, 0.28)" }}>
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
        <Link href="/admin/artists" style={{ opacity: 0.7, textDecoration: "none", color: "inherit" }}>
          Back to sign in
        </Link>
      </div>
    </main>
  );
}

export default function OwnerResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
          <p style={{ margin: 0, opacity: 0.7 }}>Loading reset form...</p>
        </main>
      }
    >
      <OwnerResetPasswordPageContent />
    </Suspense>
  );
}