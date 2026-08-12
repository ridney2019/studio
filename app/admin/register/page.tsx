"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { readApiMessage } from "@/lib/api-response";

export default function OwnerRegisterPage() {
  const [email, setEmail] = useState("");
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

    const response = await fetch("/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await readApiMessage(response);
    setIsSubmitting(false);

    if (!response.ok || !data.ok) {
      setError(data.message || "Registration failed.");
      return;
    }

    setMessage(data.message || "Registration started. Check your email.");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "460px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "18px", padding: "2rem", display: "grid", gap: "1rem", background: "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,248,248,0.97) 100%)", boxShadow: "0 14px 34px rgba(0,0,0,0.1)" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Register Owner Admin</h1>
        <p style={{ margin: 0, opacity: 0.75 }}>
          Create your owner admin password. We will email a verification link before sign-in is enabled.
        </p>
        {error ? <p style={{ margin: 0, color: "#8a0017" }}>{error}</p> : null}
        {message ? <p style={{ margin: 0, color: "#0c5a2a" }}>{message}</p> : null}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem" }}>
          <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Owner email" required style={{ width: "100%", border: "1px solid rgba(0,0,0,0.22)", borderRadius: "12px", padding: "0.8rem 0.9rem", font: "inherit", background: "#f5f6f8", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }} />
          <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required style={{ width: "100%", border: "1px solid rgba(0,0,0,0.22)", borderRadius: "12px", padding: "0.8rem 0.9rem", font: "inherit", background: "#f5f6f8", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }} />
          <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" required style={{ width: "100%", border: "1px solid rgba(0,0,0,0.22)", borderRadius: "12px", padding: "0.8rem 0.9rem", font: "inherit", background: "#f5f6f8", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }} />
          <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.65 }}>
            Use at least 12 characters with uppercase, lowercase, and a number.
          </p>
          <button type="submit" disabled={isSubmitting} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: 0, borderRadius: "999px", padding: "0.75rem 1rem", fontWeight: 700, background: "linear-gradient(135deg, #6f0000 0%, #b2001a 55%, #ff4d4d 100%)", color: "#fff", cursor: isSubmitting ? "wait" : "pointer", opacity: isSubmitting ? 0.7 : 1, boxShadow: "0 10px 24px rgba(109, 6, 17, 0.28)" }}>
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </form>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/admin/artists" style={{ opacity: 0.7, textDecoration: "none", color: "inherit" }}>
            Back to sign in
          </Link>
          <Link href="/admin/forgot-password" style={{ opacity: 0.7, textDecoration: "none", color: "inherit" }}>
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}