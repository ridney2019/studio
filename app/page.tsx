"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "./hooks/useTranslation";
import { useLanguage } from "./providers";
import { SocialLinks } from "./components/SocialLinks";
import { LocationMap } from "./components/LocationMap";

import ScrollToTopButton from "./components/ScrollToTopButton";
import FloatingSocials from "./components/FloatingSocials";

const artists = [
  {
    name: "FELIPE SANTOS BANG",
    image: "/artists/bang-bang.svg",
    description: "Owner/operator FELIPE SANTOS NEXO is named by 'CONCEPTION?' as the most famous tattoo artist in the world.",
  },
  {
    name: "CARLA MORALES",
    image: "/artists/jay-shin.svg",
    description: "Specializes in illustrative color, fine line and single needle tattoo work.",
  },
  {
    name: "ZACK",
    image: "/artists/zee.svg",
    description: "Specializes in black and gray realism and fine line. Flowers, texture, and portrait detail define his work.",
  },
  {
    name: "VICTORIA",
    image: "/artists/pawel.svg",
    description: "Black and gray hyper realism with baroque light and sculptural detail.",
  },
  {
    name: "OWEN",
    image: "/artists/solar.svg",
    description: "Illustrative color and ornamental art inspired by antique jewels, royal artifacts, and modern decorative detail.",
  },
  {
    name: "CONOR",
    image: "/artists/adrian.svg",
    description: "Watercolor and illustrative color tattoos with space, galaxy and dreamlike themes.",
  },
  {
    name: "SARAH MORGAN",
    image: "/artists/sara-kori.svg",
    description: "Fine line technique celebrating strength, individuality, and emotional power.",
  },
  {
    name: "ELIAS SILVA",
    image: "/artists/victor.svg",
    description: "Blackwork, fineline, geometric realism, and cyberpunk-inspired tattoo artistry.",
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
  const { theme, toggleTheme } = useLanguage();

  if (!isHydrated) return null;

  return (
    <>
      {/* 1. Main visual viewport layout container */}
      <main className="page-shell loaded relative">
        <header className="site-header fade-section">
          <button 
            onClick={toggleTheme}
            className="accessibility-toggle"
            aria-label="Toggle Accessibility Theme"
          >
            {theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}
          </button>
          <div className="brand">NEXO STUDIO TATTOO</div>
          <a className="appointment-link" href="/contact">
            MAKE AN APPOINTMENT
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
                BOOK NOW
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

        {/* Aftercare Section */}
        <section className="product-section fade-section">
          <div className="product-copy">
            <p className="eyebrow">MARKET PLACE</p>
            <h2>Gentle care for fresh ink</h2>
            <p>
              Shop a tattoo aftercare line that keeps your new work vibrant and protected while it heals.
            </p>
          </div>
          <div className="product-action">
            <a className="button button-outline" href="">
              SHOP NOW
            </a>
          </div>
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
                  <p>{artist.description}</p>
                  <a className="view-gallery" href="/contact">
                    BOOK AN APPOINTMENT
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Location Section */}
        <LocationMap />

        {/* Social Media Links Footer Section */}
        <SocialLinks />
      </main>

      {/* ========================================================= */}
      {/* 2. FLOATING SYSTEM OVERLAYS (OUTSIDE OUTFLOW CONTAINER)    */}
      {/* ========================================================= */}
      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}