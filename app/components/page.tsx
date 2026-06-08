"use client";

import { useTranslation } from "@/app/hooks/useTranslation";

export default function TermsPage() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) return null;

  return (
    <main className="page-shell loaded">
      <section className="fade-section">
        <h1>LEGAL</h1>
        <h2>Terms & Conditions</h2>
        <p>Your paragraph 1 text here...</p>
        <p>Your paragraph 2 text here...</p>
      </section>
    </main>
  );
}