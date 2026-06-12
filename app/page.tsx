"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "./hooks/useTranslation";
import { TranslationKey } from "../lib/translations";
import { LanguageCode, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../lib/languages"; 
import { useLanguage } from "./providers";
import { SocialLinks } from "./components/SocialLinks"; 
import { LocationMap } from "./components/LocationMap";
import ScrollToTopButton from "./components/ScrollToTopButton";
import FloatingSocials from "./components/FloatingSocials";

const artists = [
  {
    name: "FELIPE SANTOS",
    image: "/artists/felipe-santos.jpg",
    descKey: "artistFelipeDesc" as TranslationKey,
  },
  {
    name: "CARLA MORALES",
    image: "/artists/carla-morales.jpg",
    descKey: "artistCarlaDesc" as TranslationKey,
  },
  {
    name: "ZACK",
    image: "/artists/zack.jpg",
    descKey: "artistZackDesc" as TranslationKey,
  },
  {
    name: "VICTORIA",
    image: "/artists/victoria.jpg",
    descKey: "artistVictoriaDesc" as TranslationKey,
  },
  {
    name: "OWEN",
    image: "/artists/owen.jpg",
    descKey: "artistOwenDesc" as TranslationKey,
  },
  {
    name: "CONOR",
    image: "/artists/conor.jpg",
    descKey: "artistConorDesc" as TranslationKey,
  },
  {
    name: "SARAH MORGAN",
    image: "/artists/sarah-morgan.jpg",
    descKey: "artistSarahDesc" as TranslationKey,
  },
  {
    name: "ELIAS SILVA",
    image: "/artists/elias-silva.jpg",
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);

  const nextArtist = () => {
    setCurrentArtistIndex((prev) => (prev + 1) % artists.length);
  };

  const prevArtist = () => {
    setCurrentArtistIndex((prev) => (prev - 1 + artists.length) % artists.length);
  };

  const currentLangConfig = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES['english'];

  return (
    <>
      <main id="home" className="page-shell loaded relative">
        <header className="site-header fade-section" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          padding: '80px 4% 24px 4%',
          minHeight: '160px'
        }}>
          
          {/* Left Controls Container */}
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

            {/* Language Selector Dropdown */}
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
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
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
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <option key={code} value={code} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                    {lang.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: '16px', pointerEvents: 'none', fontSize: '0.55rem' }}>▼</span>
            </div>
          </div>
          
          {/* Central Brand and Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div className="brand" style={{ fontSize: '1.25rem', letterSpacing: '0.2em' }}>
              <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>NEXO STUDIO TATTOO</a>
            </div>
            <nav style={{ position: 'relative' }} ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  background: 'transparent',
                  color: 'currentColor',
                  border: '1px solid currentColor',
                  padding: '0 24px',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '40px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                {t("menu") || "MENU"} 
                <span style={{ 
                  fontSize: '0.6rem', 
                  transition: 'transform 0.3s ease', 
                  transform: isMenuOpen ? 'rotate(180deg)' : 'none' 
                }}>▼</span>
              </button>

              {isMenuOpen && (
                <div className="nav-dropdown" style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: theme === 'light' ? '#ffffff' : '#0a0a0a',
                  border: '1px solid currentColor',
                  borderRadius: '12px',
                  padding: '8px 0',
                  minWidth: '180px',
                  zIndex: 100,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  overflow: 'hidden'
                }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <li>
                      <a href="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '12px 24px', textDecoration: 'none', color: 'inherit', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 'bold' }}>{t("home").toUpperCase()}</a>
                    </li>
                    <li>
                      <a href="/#artists" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '12px 24px', textDecoration: 'none', color: 'inherit', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 'bold' }}>{t("artists").toUpperCase()}</a>
                    </li>
                    <li>
                      <a href="/blog" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '12px 24px', textDecoration: 'none', color: 'inherit', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 'bold' }}>{(t("blog") || "blog").toUpperCase()}</a>
                    </li>
                  </ul>
                </div>
              )}
            </nav>
          </div>
          
          {/* Right Appointment Link */}
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
          <div style={{ width: '100px' }}></div>
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
          </div> {/* 👈 FIXED: Added missing closing div tag for hero-copy right here */}

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
        <section id="artists" className="artists-section fade-section">
          <div className="section-header">
            <p className="eyebrow">ARTISTS</p>
            <h2>{t("artists")}</h2>
          </div>
          
          <div className="carousel-container" style={{ position: 'relative', overflow: 'hidden' }}>
            <div 
              className="artist-carousel-track" 
              style={{ 
                display: 'flex', 
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentArtistIndex * 100}%)`
              }}
            >
              {artists.map((artist) => (
                <div 
                  key={artist.name} 
                  style={{ 
                    minWidth: '100%', 
                    padding: '0 20px',
                    boxSizing: 'border-box'
                  }}
                >
                  <article className="artist-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="artist-image">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={800}
                        height={800}
                        className="artist-photo"
                      />
                    </div>
                    <div className="artist-copy" style={{ textAlign: 'center' }}>
                      <h3>{artist.name}</h3>
                      <p>{t(artist.descKey)}</p>
                      <a className="view-gallery" href="/contact">
                        {t("bookAppointment").toUpperCase()}
                      </a>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Controls */}
            <button 
              onClick={prevArtist}
              className="carousel-control prev"
              aria-label="Previous artist"
              style={{
                position: 'absolute', left: '0', top: '40%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.05)', border: '1px solid currentColor', color: 'currentColor',
                width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
              }}
            >
              ←
            </button>
            <button 
              onClick={nextArtist}
              className="carousel-control next"
              aria-label="Next artist"
              style={{
                position: 'absolute', right: '0', top: '40%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.05)', border: '1px solid currentColor', color: 'currentColor',
                width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
              }}
            >
              →
            </button>

            {/* Indicators */}
            <div className="carousel-indicators" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
              {artists.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentArtistIndex(i)}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%', border: 'none',
                    background: i === currentArtistIndex ? 'currentColor' : 'rgba(128,128,128,0.3)',
                    cursor: 'pointer', padding: 0, transition: 'all 0.3s ease'
                  }}
                  aria-label={`Go to artist ${i + 1}`}
                />
              ))}
            </div>
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