"use client";

import { useTranslation } from "@/app/hooks/useTranslation";

export default function TermsPage() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) return null;

  return (
    <main className="page-shell loaded">
      <section className="fade-section">
        <p className="eyebrow">{t('legal')}</p>
        <h1>{t('termsAndConditionsTitle')}</h1>
        <p>{t('termsAndConditionsParagraph1')}</p>
        <p>{t('termsAndConditionsParagraph2')}</p>
        {/* Add more paragraphs and content as needed */}
      </section>
    </main>
  );
}