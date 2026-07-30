"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/providers";
import { SocialLinks } from "@/app/components/SocialLinks";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";
import FloatingSocials from "@/app/components/FloatingSocials";
import TrainingIntakeForm from "@/app/components/TrainingIntakeForm";
import GlobalMenu from "@/app/components/GlobalMenu";

export default function WorkshopPage() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme } = useLanguage();

  if (!isHydrated) return null;

  return (
    <>
      <main className="contact-shell loaded relative workshop-page-shell">
        <header className="site-header fade-section">
          <button
            onClick={toggleTheme}
            className="accessibility-toggle"
            aria-label="Toggle Accessibility Theme"
          >
            {theme === "dark" ? "☀ LIGHT MODE" : "☾ DARK MODE"}
          </button>

          <a href="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
            NEXO STUDIO TATTOO
          </a>

          <GlobalMenu />
        </header>

        <section className="contact-hero fade-section" style={{ paddingBottom: "2rem" }}>
          <div>
            <p className="eyebrow">WORKSHOP & TRAINING</p>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "1px", lineHeight: "1.3" }}>
              Build your tattoo practice with a structured, honest mentorship pathway
            </h2>
            <p style={{ marginTop: "1rem", maxWidth: "700px" }}>
              This experience is designed for artists who want clarity around technique, business, and long-term growth. Share a little about your current level and your goals so we can recommend the right fit.
            </p>
          </div>
        </section>

        <section className="contact-grid fade-section" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <TrainingIntakeForm />

          <div className="contact-card contact-info-card">
            <h2>{t("studioDetails")}</h2>
            <div className="info-block">
              <h3>{t("location")}</h3>
              <p>101-103 Francis St, The Liberties</p>
              <p>Dublin 8, D08 FHP9</p>
            </div>
            <div className="info-block">
              <h3>{t("hours")}</h3>
              <p>{t("timeOpen")}</p>
              <p>{t("tuesdayToSunday")}</p>
              <p>{t("closedMonday")}</p>
            </div>
            <div className="info-block">
              <h3>Booking</h3>
              <p>Text: +353833300832</p>
              <p>nexostudiosltd@gmail.com</p>
            </div>
          </div>
        </section>

        <SocialLinks />
      </main>

      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}
