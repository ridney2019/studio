"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/providers";
import { SocialLinks } from "@/app/components/SocialLinks";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";
import FloatingSocials from "@/app/components/FloatingSocials";
import GlobalMenu from "@/app/components/GlobalMenu";

type ProcessStep = {
  title: string;
  description: string;
};

type ComparisonSlide = {
  label: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
};

type ComparisonBlock = {
  title: string;
  intro: string;
  slides: ComparisonSlide[];
};

type ServiceFunnelContent = {
  serviceLabel: string;
  hookTitle: string;
  hookDescription: string;
  hookPromise: string;
  awarenessTitle: string;
  awarenessItems: string[];
  painTitle: string;
  painItems: string[];
  fearTitle: string;
  fearLead: string;
  fearItems: string[];
  authorityTitle: string;
  authorityDescription: string;
  authorityProof: string[];
  solutionTitle: string;
  solutionLead: string;
  processSteps: ProcessStep[];
  comparisonBlocks: ComparisonBlock[];
  scarcityTitle: string;
  scarcityDescription: string;
  scarcityItems: string[];
  formCta: string;
  formHelper: string;
};

type Props = {
  content: ServiceFunnelContent;
};

const formInitialState = {
  name: "",
  email: "",
  phone: "",
  tattooLocation: "",
  timeline: "",
  story: "",
  photoLink: "",
};

export default function ServiceFunnelPage({ content }: Props) {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme } = useLanguage();

  const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/xkoarkao";

  const [formState, setFormState] = useState(formInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [comparisonIndices, setComparisonIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal='up']"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const palette = useMemo(
    () => ({
      background: theme === "dark" ? "#0a0a0a" : "#ffffff",
      text: theme === "dark" ? "#ffffff" : "#0a0a0a",
      panel: theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
      border: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
      muted: theme === "dark" ? "rgba(255, 255, 255, 0.72)" : "rgba(10, 10, 10, 0.72)",
      accent: theme === "dark" ? "#ffffff" : "#0a0a0a",
      accentSoft: theme === "dark" ? "rgba(255, 255, 255, 0.18)" : "rgba(10, 10, 10, 0.18)",
    }),
    [theme],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.email.trim() || !formState.story.trim()) {
      setFeedbackMessage(t("sfFeedbackValidation"));
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");

    try {
      const payload = new FormData();
      payload.append("service", content.serviceLabel);
      payload.append("name", formState.name);
      payload.append("email", formState.email);
      payload.append("phone", formState.phone);
      payload.append("tattooLocation", formState.tattooLocation);
      payload.append("timeline", formState.timeline);
      payload.append("story", formState.story);
      payload.append("photoLink", formState.photoLink);

      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setFormState(formInitialState);
      setFeedbackMessage(t("sfFeedbackSuccess"));
    } catch {
      setFeedbackMessage(t("sfFeedbackError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) return null;

  return (
    <>
      <main
        className="contact-shell loaded relative service-funnel-shell"
        style={{
          minHeight: "100vh",
          color: palette.text,
          background: palette.background,
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .service-funnel-shell {
                position: relative;
                isolation: isolate;
              }

              .service-funnel-shell::before,
              .service-funnel-shell::after {
                content: "";
                position: fixed;
                inset: 0;
                z-index: -2;
                pointer-events: none;
              }

              .service-funnel-shell::before {
                background:
                  radial-gradient(circle at 12% 8%, ${palette.accentSoft} 0%, transparent 45%),
                  radial-gradient(circle at 80% 18%, ${theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"} 0%, transparent 42%),
                  linear-gradient(120deg, ${theme === "dark" ? "rgba(255, 255, 255, 0.09)" : "rgba(0, 0, 0, 0.07)"}, transparent 40%),
                  repeating-linear-gradient(
                    90deg,
                    ${theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)"} 0,
                    ${theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)"} 2px,
                    transparent 2px,
                    transparent 26px
                  );
              }

              .service-funnel-shell::after {
                background: ${theme === "dark"
                  ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.52))"
                  : "linear-gradient(to bottom, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.32))"};
                z-index: -1;
              }

              .funnel-stage {
                position: relative;
                display: grid;
                gap: 1.4rem;
                padding: clamp(1.8rem, 4vw, 2.8rem);
                border: 1px solid ${palette.border};
                border-radius: 1.4rem;
                background: ${palette.panel};
                backdrop-filter: blur(10px);
                overflow: hidden;
              }

              .funnel-stage::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 120px;
                height: 1px;
                background: linear-gradient(to right, ${palette.accent}, transparent);
              }

              .funnel-index {
                margin: 0;
                font-size: 0.7rem;
                letter-spacing: 0.32em;
                text-transform: uppercase;
                color: ${palette.accent};
                font-weight: 700;
              }

              .funnel-title {
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                line-height: 1.1;
                font-size: clamp(1.5rem, 4vw, 3.05rem);
              }

              .funnel-lead {
                margin: 0;
                color: ${palette.muted};
                line-height: 1.85;
                font-size: 1.02rem;
              }

              .funnel-list {
                list-style: none;
                display: grid;
                gap: 0.9rem;
                margin: 0;
                padding: 0;
              }

              .funnel-list li {
                position: relative;
                margin: 0;
                padding-left: 1.1rem;
                color: ${palette.muted};
                line-height: 1.7;
              }

              .funnel-list li::before {
                content: "";
                position: absolute;
                top: 0.65rem;
                left: 0;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: ${palette.accent};
                box-shadow: 0 0 14px ${palette.accent};
              }

              .hook-grid {
                display: grid;
                grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
                gap: 1.3rem;
              }

              .hook-badge {
                margin: 0;
                border: 1px solid ${palette.border};
                border-radius: 1rem;
                padding: 1rem 1.1rem;
                background: ${theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"};
                color: ${palette.text};
                font-weight: 600;
                line-height: 1.7;
              }

              .process-grid {
                display: grid;
                gap: 0.9rem;
              }

              .process-step {
                border: 1px solid ${palette.border};
                border-radius: 0.95rem;
                padding: 1rem;
                background: ${theme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"};
              }

              .process-step h3 {
                margin: 0 0 0.45rem 0;
                font-size: 0.95rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
              }

              .process-step p {
                margin: 0;
                line-height: 1.7;
                color: ${palette.muted};
              }

              .booking-form {
                display: grid;
                gap: 0.9rem;
              }

              .booking-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 0.9rem;
              }

              .booking-field {
                display: grid;
                gap: 0.42rem;
              }

              .booking-field span {
                font-size: 0.75rem;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                font-weight: 700;
              }

              .booking-field input,
              .booking-field textarea {
                width: 100%;
                border: 1px solid ${palette.border};
                border-radius: 0.85rem;
                background: ${theme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"};
                color: ${palette.text};
                padding: 0.86rem;
                outline: none;
              }

              .booking-field input:focus,
              .booking-field textarea:focus {
                border-color: ${palette.accent};
                box-shadow: 0 0 0 2px ${palette.accentSoft};
              }

              .booking-button {
                background: ${palette.accent};
                color: ${theme === "dark" ? "#0a0a0a" : "#ffffff"};
                border: none;
                padding: 1rem 1.2rem;
                border-radius: 999px;
                letter-spacing: 0.13em;
                font-size: 0.78rem;
                text-transform: uppercase;
                font-weight: 800;
                transition: transform 0.2s ease, filter 0.2s ease;
              }

              .booking-button:hover {
                transform: translateY(-1px);
                filter: brightness(1.06);
              }

              .feedback-message {
                margin: 0;
                color: ${palette.accent};
                font-weight: 600;
                line-height: 1.7;
              }

              .comparison-grid {
                display: grid;
                gap: 1rem;
              }

              .comparison-card {
                border: 1px solid ${palette.border};
                border-radius: 1rem;
                background: ${theme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"};
                overflow: hidden;
              }

              .comparison-card-header {
                padding: 1rem 1rem 0.8rem 1rem;
                display: grid;
                gap: 0.45rem;
                border-bottom: 1px solid ${palette.border};
              }

              .comparison-card-header h3 {
                margin: 0;
                font-size: 0.92rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
              }

              .comparison-card-header p {
                margin: 0;
                color: ${palette.muted};
                line-height: 1.6;
              }

              .comparison-frame {
                position: relative;
                aspect-ratio: 16 / 9;
                overflow: hidden;
              }

              .comparison-media {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .comparison-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 60%);
              }

              .comparison-label {
                position: absolute;
                top: 0.8rem;
                left: 0.8rem;
                margin: 0;
                background: ${theme === "dark" ? "rgba(10, 10, 10, 0.7)" : "rgba(255, 255, 255, 0.74)"};
                border: 1px solid ${palette.border};
                padding: 0.38rem 0.6rem;
                border-radius: 999px;
                font-size: 0.65rem;
                letter-spacing: 0.11em;
                text-transform: uppercase;
                font-weight: 700;
              }

              .comparison-caption {
                position: absolute;
                left: 0.9rem;
                right: 0.9rem;
                bottom: 0.85rem;
                margin: 0;
                font-size: 0.86rem;
                line-height: 1.55;
              }

              .comparison-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.8rem 1rem 1rem 1rem;
                gap: 0.7rem;
              }

              .comparison-nav {
                border: 1px solid ${palette.border};
                background: ${theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"};
                color: ${palette.text};
                min-width: 92px;
                border-radius: 999px;
                padding: 0.45rem 0.7rem;
                font-size: 0.67rem;
                letter-spacing: 0.11em;
                text-transform: uppercase;
                font-weight: 700;
              }

              .comparison-progress {
                margin: 0;
                font-size: 0.68rem;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: ${palette.muted};
              }

              @keyframes stageReveal {
                from {
                  opacity: 0;
                  transform: translateY(26px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .funnel-stage {
                animation: stageReveal 0.7s ease both;
              }

              [data-reveal='up'] {
                opacity: 0;
                transform: translateY(28px);
                transition: opacity 0.7s ease, transform 0.7s ease;
              }

              [data-reveal='up'].is-visible {
                opacity: 1;
                transform: translateY(0);
              }

              .funnel-stage:nth-of-type(1) { animation-delay: 0.04s; }
              .funnel-stage:nth-of-type(2) { animation-delay: 0.08s; }
              .funnel-stage:nth-of-type(3) { animation-delay: 0.12s; }
              .funnel-stage:nth-of-type(4) { animation-delay: 0.16s; }
              .funnel-stage:nth-of-type(5) { animation-delay: 0.2s; }
              .funnel-stage:nth-of-type(6) { animation-delay: 0.24s; }
              .funnel-stage:nth-of-type(7) { animation-delay: 0.28s; }

              @media (max-width: 980px) {
                .hook-grid,
                .booking-grid {
                  grid-template-columns: 1fr;
                }

                .brand {
                  font-size: 0.88rem;
                  letter-spacing: 0.22em;
                }
              }
            `,
          }}
        />

        <header className="site-header fade-section">
          <button
            onClick={toggleTheme}
            className="accessibility-toggle"
            aria-label="Toggle Accessibility Theme"
          >
            {theme === "dark" ? t("sfThemeLight") : t("sfThemeDark")}
          </button>

          <a href="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
            NEXO STUDIO TATTOO
          </a>

          <GlobalMenu />
        </header>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">01 {t("sfStageHook")}</p>
          <div className="hook-grid">
            <div>
              <h1 className="funnel-title">{content.hookTitle}</h1>
              <p className="funnel-lead">{content.hookDescription}</p>
            </div>
            <p className="hook-badge">{content.hookPromise}</p>
          </div>
        </section>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">02 {t("sfStageAwareness")}</p>
          <h2 className="funnel-title">{content.awarenessTitle}</h2>
          <ul className="funnel-list">
            {content.awarenessItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">03 {t("sfStagePain")}</p>
          <h2 className="funnel-title">{content.painTitle}</h2>
          <ul className="funnel-list">
            {content.painItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">04 {t("sfStageFear")}</p>
          <h2 className="funnel-title">{content.fearTitle}</h2>
          <p className="funnel-lead">{content.fearLead}</p>
          <ul className="funnel-list">
            {content.fearItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">05 {t("sfStageAuthority")}</p>
          <h2 className="funnel-title">{content.authorityTitle}</h2>
          <p className="funnel-lead">{content.authorityDescription}</p>
          <ul className="funnel-list">
            {content.authorityProof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">06 {t("sfStageSolution")}</p>
          <h2 className="funnel-title">{content.solutionTitle}</h2>
          <p className="funnel-lead">{content.solutionLead}</p>
          <div className="process-grid">
            {content.processSteps.map((step, index) => (
              <article className="process-step" key={step.title}>
                <h3>
                  {t("sfStep")} {index + 1} | {step.title}
                </h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">{t("sfStageVisual")}</p>
          <h2 className="funnel-title">{t("sfVisualTitle")}</h2>
          <p className="funnel-lead">{t("sfVisualLead")}</p>

          <div className="comparison-grid">
            {content.comparisonBlocks.map((block, blockIndex) => {
              const currentIndex = comparisonIndices[blockIndex] ?? 0;
              const currentSlide = block.slides[currentIndex];
              const maxSlides = block.slides.length;

              return (
                <article className="comparison-card" key={block.title} data-reveal="up">
                  <div className="comparison-card-header">
                    <h3>{block.title}</h3>
                    <p>{block.intro}</p>
                  </div>

                  <div className="comparison-frame">
                    <Image
                      src={currentSlide.imageSrc}
                      alt={currentSlide.imageAlt}
                      fill
                      sizes="(max-width: 980px) 100vw, 70vw"
                      className="comparison-media"
                    />
                    <div className="comparison-overlay" />
                    <p className="comparison-label">{currentSlide.label}</p>
                    <p className="comparison-caption">{currentSlide.caption}</p>
                  </div>

                  <div className="comparison-controls">
                    <button
                      type="button"
                      className="comparison-nav"
                      onClick={() =>
                        setComparisonIndices((prev) => ({
                          ...prev,
                          [blockIndex]: currentIndex === 0 ? maxSlides - 1 : currentIndex - 1,
                        }))
                      }
                    >
                      {t("sfVisualPrevious")}
                    </button>

                    <p className="comparison-progress">
                      {t("sfVisualSlide")} {currentIndex + 1} {t("sfVisualOf")} {maxSlides}
                    </p>

                    <button
                      type="button"
                      className="comparison-nav"
                      onClick={() =>
                        setComparisonIndices((prev) => ({
                          ...prev,
                          [blockIndex]: currentIndex === maxSlides - 1 ? 0 : currentIndex + 1,
                        }))
                      }
                    >
                      {t("sfVisualNext")}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="funnel-stage fade-section" data-reveal="up">
          <p className="funnel-index">07 {t("sfStageScarcity")}</p>
          <h2 className="funnel-title">{content.scarcityTitle}</h2>
          <p className="funnel-lead">{content.scarcityDescription}</p>
          <ul className="funnel-list">
            {content.scarcityItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="contact-card" style={{ marginTop: "0.6rem", gap: "1rem" }}>
            <p className="eyebrow" style={{ margin: 0 }}>{content.formCta}</p>
            <p className="funnel-lead" style={{ marginTop: 0 }}>{content.formHelper}</p>

            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-grid">
                <label className="booking-field">
                  <span>{t("sfFormFullName")}</span>
                  <input
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </label>

                <label className="booking-field">
                  <span>{t("sfFormEmail")}</span>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                    required
                  />
                </label>

                <label className="booking-field">
                  <span>{t("sfFormPhone")}</span>
                  <input
                    value={formState.phone}
                    onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </label>

                <label className="booking-field">
                  <span>{t("sfFormBodyArea")}</span>
                  <input
                    value={formState.tattooLocation}
                    onChange={(event) => setFormState((prev) => ({ ...prev, tattooLocation: event.target.value }))}
                    placeholder={t("sfFormBodyAreaPlaceholder")}
                  />
                </label>
              </div>

              <label className="booking-field">
                <span>{t("sfFormTimeline")}</span>
                <input
                  value={formState.timeline}
                  onChange={(event) => setFormState((prev) => ({ ...prev, timeline: event.target.value }))}
                  placeholder={t("sfFormTimelinePlaceholder")}
                />
              </label>

              <label className="booking-field">
                <span>{t("sfFormPhotoLink")}</span>
                <input
                  value={formState.photoLink}
                  onChange={(event) => setFormState((prev) => ({ ...prev, photoLink: event.target.value }))}
                  placeholder={t("sfFormPhotoLinkPlaceholder")}
                />
              </label>

              <label className="booking-field">
                <span>{t("sfFormStory")}</span>
                <textarea
                  rows={5}
                  value={formState.story}
                  onChange={(event) => setFormState((prev) => ({ ...prev, story: event.target.value }))}
                  placeholder={t("sfFormStoryPlaceholder")}
                  required
                />
              </label>

              <button className="booking-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("sfFormSubmitting") : t("sfFormSubmit")}
              </button>

              {feedbackMessage ? <p className="feedback-message">{feedbackMessage}</p> : null}
            </form>
          </div>
        </section>

        <SocialLinks />
      </main>

      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}
