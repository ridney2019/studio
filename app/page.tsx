"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "./hooks/useTranslation";
import { TranslationKey } from "../lib/translations";
import { useLanguage } from "./providers";
import { SocialLinks } from "./components/SocialLinks";
import { LocationMap } from "./components/LocationMap";

import ScrollToTopButton from "./components/ScrollToTopButton";
import FloatingSocials from "./components/FloatingSocials";

const languagesConfig = [
  { code: 'english', name: 'English', label: 'EN', flag: '🇬🇧' },
  { code: 'arabic', name: 'العربية', label: 'AR', flag: '🇦🇪' },
  { code: 'azerbaijani', name: 'Azerbaijani', label: 'AZ', flag: '🇦🇿' },
  { code: 'catalan', name: 'Català', label: 'CA', flag: '🇪🇸' },
  { code: 'chinese', name: '中文', label: 'ZH', flag: '🇨🇳' },
  { code: 'croatian', name: 'Hrvatski', label: 'HR', flag: '🇭🇷' },
  { code: 'czech', name: 'Čeština', label: 'CZ', flag: '🇨🇿' },
  { code: 'danish', name: 'Dansk', label: 'DA', flag: '🇩🇰' },
  { code: 'dutch', name: 'Nederlands', label: 'NL', flag: '🇳🇱' },
  { code: 'estonian', name: 'Estonian', label: 'ET', flag: '🇪🇪' },
  { code: 'farsi', name: 'Persian', label: 'FA', flag: '🇮🇷' },
  { code: 'french', name: 'Français', label: 'FR', flag: '🇫🇷' },
  { code: 'german', name: 'Deutsch', label: 'DE', flag: '🇩🇪' },
  { code: 'hebrew', name: 'עברית', label: 'HE', flag: '🇮🇱' },
  { code: 'hungarian', name: 'Magyar', label: 'HU', flag: '🇭🇺' },
  { code: 'italian', name: 'Italiano', label: 'IT', flag: '🇮🇹' },
  { code: 'macedonian', name: 'Macedonian', label: 'MK', flag: '🇲🇰' },
  { code: 'norwegian', name: 'Norwegian', label: 'NO', flag: '🇳🇴' },
  { code: 'portuguese-br', name: 'Português (BR)', label: 'BR', flag: '🇧🇷' },
  { code: 'portuguese-pt', name: 'Português (PT)', label: 'PT', flag: '🇵🇹' },
  { code: 'romanian', name: 'Română', label: 'RO', flag: '🇷🇴' },
  { code: 'russian', name: 'Русский', label: 'RU', flag: '🇷🇺' },
  { code: 'spanish', name: 'Español', label: 'ES', flag: '🇪🇸' },
  { code: 'swedish', name: 'Svenska', label: 'SV', flag: '🇸🇪' },
  { code: 'turkish', name: 'Türkçe', label: 'TR', flag: '🇹🇷' },
  { code: 'ukrainian', name: 'Українська', label: 'UA', flag: '🇺🇦' },
] as const;

const artists = [
  {
    name: "FELIPE SANTOS BANG",
    image: "/artists/bang-bang.svg",
    descKey: "artistFelipeDesc" as TranslationKey,
  },
  {
    name: "CARLA MORALES",
    image: "/artists/jay-shin.svg",
    descKey: "artistCarlaDesc" as TranslationKey,
  },
  {
    name: "ZACK",
    image: "/artists/zee.svg",
    descKey: "artistZackDesc" as TranslationKey,
  },
  {
    name: "VICTORIA",
    image: "/artists/pawel.svg",
    descKey: "artistVictoriaDesc" as TranslationKey,
  },
  {
    name: "OWEN",
    image: "/artists/solar.svg",
    descKey: "artistOwenDesc" as TranslationKey,
  },
  {
    name: "CONOR",
    image: "/artists/adrian.svg",
    descKey: "artistConorDesc" as TranslationKey,
  },
  {
    name: "SARAH MORGAN",
    image: "/artists/sara-kori.svg",
    descKey: "artistSarahDesc" as TranslationKey,
  },
  {
    name: "ELIAS SILVA",
    image: "/artists/victor.svg",
    descKey: "artistEliasDesc" as TranslationKey,
  },
];

const contacts = [
  {
    title: "LOCATION",
    lines: ["101-103 Francis St, The Liberties", "Dublin 8, D08 FHP9"],
  },
  {
    title: "HOURS OF OPERATION",
    lines: ["11AM TO 7PM | MONDAY - SUNDAY", "CLOSED TUESDAY"],
  },
  {
    title: "CONTACT US",
    lines: ["nexostudiosltd@gmail.com"],
  },
];

export default function Home() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useLanguage();

  if (!isHydrated) return null;
  
  const currentLangConfig = languagesConfig.find(l => l.code === language) || languagesConfig[0];

  return (
    <>
      <main id="home" className="page-shell loaded relative">
        {/* Adjusted Header: Custom positions matching your style */}
        <header className="site-header fade-section" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          padding: '80px 4% 24px 4%',
          minHeight: '160px'
        }}>
          
          {/* Left Controls Container (Pushed Down and Aligned) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`accessibility-toggle theme-${theme}`}
              aria-label="Toggle Accessibility Theme"
              style={{
                background: 'transparent',
                color: 'currentColor',
                border: '1px solid currentColor',
                padding: '0 16px',
                fontFamily: 'inherit',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                height: '40px',
                borderRadius: '20px'
              }}
            >
              <span className="theme-icon">{theme === 'dark' ? '☀' : '☾'}</span>
              <span className="theme-text">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>

            {/* Custom Dropdown Component to resolve missing Windows Flag icons */}
            <div className="custom-lang-selector" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                pointerEvents: 'none',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                {currentLangConfig.flag}
              </div>
              <select
                value={language || 'english'}
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{
                  background: 'transparent',
                  color: 'currentColor',
                  border: '1px solid currentColor',
                  padding: '0 36px 0 42px',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  height: '40px',
                  borderRadius: '20px'
                }}
              >
                {languagesConfig.map((lang) => (
                  <option key={lang.code} value={lang.code} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                    {lang.label} - {lang.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: '16px', pointerEvents: 'none', fontSize: '0.55rem' }}>▼</span>
            </div>
          </div>
          
          <div className="brand" style={{ paddingBottom: '12px', fontSize: '1.25rem', letterSpacing: '0.2em' }}>
            NEXO STUDIO TATTOO
          </div>
          
          <a className="appointment-link" href="/contact" style={{
            background: '#ffffff',
            color: '#000000',
            padding: '12px 28px',
            borderRadius: '24px',
            fontWeight: '700',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textDecoration: 'none',
            marginBottom: '4px'
          }}>
            {t("booking").toUpperCase()}
          </a>
        </header>

        {/* Hero Section */}
        <section className="hero-section fade-section">
          <div className="hero-copy">
            <p className="eyebrow">STUDIO</p>
            <h1>{t("tagline")}</h1>
            <p className="hero-description">{t("description")}</p>
            <div className="hero-actions">
              <a className="button" href="/contact">
                {t("booking").toUpperCase()}
              </a>
              <a className="button-outline" href="">
                SHOP STORE
              </a>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <aside className="hero-side">
            <div className="info-panel">
              {contacts.map((block) => (
                <div key={block.title} className="info-block">
                  <h2>{block.title}</h2>
                  {block.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* Artists Section */}
        <section id="about" className="artists-section fade-section">
          <div className="section-header">
            <p className="eyebrow">ARTISTS</p>
            <h2>{t("artists")}</h2>
          </div>
          <div className="artist-grid">
            {artists.map((artist, index) => (
              <article
                key={artist.name}
                className="artist-card"
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <div className="artist-image">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={800}
                    height={800}
                    className="artist-photo"
                  />
                </div>
                <div className="artist-copy">
                  <h3>{artist.name}</h3>
                  <p>{t(artist.descKey)}</p>
                  <a className="view-gallery" href="/contact">
                    {t("bookAppointment").toUpperCase()}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Aftercare & Marketplace Section */}
        <section className="product-section fade-section">
          <div className="product-copy">
            <p className="eyebrow">{t('marketplace')}</p>
            <h2>{t('aftercareTitle')}</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              {t('aftercareDescription')}
            </p>
            
            <ul 
              className="marketplace-list" 
              style={{ 
                listStyle: "none", 
                padding: 0, 
                margin: "0 0 2rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--accent-color, #ffffff)" }}>✦</span>
                {t('giftCards')}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--accent-color, #ffffff)" }}>✦</span>
                {t('flashTattoos')}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--accent-color, #ffffff)" }}>✦</span>
                {t('aftercareProduct')}
              </li>
            </ul>
          </div>
          <div className="product-action">
            <a className="button button-outline" href="">
              {t('shopNow')}
            </a>
          </div>
        </section>

        <LocationMap />
        <SocialLinks />
      </main>

      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}