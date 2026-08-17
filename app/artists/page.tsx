"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SocialLinks } from "../components/SocialLinks";
import ScrollToTopButton from "../components/ScrollToTopButton";
import FloatingSocials from "../components/FloatingSocials";
import { ArtistProfile, DEFAULT_ARTISTS, getArtistsFromStorage } from "@/lib/artists";

const galleryNavItems = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/#location", label: "Location" },
  { href: "/contact", label: "Contact" },
  { href: "/workshop", label: "Workshop" },
];

export default function ArtistsIndexPage() {
  const [artists, setArtists] = useState<ArtistProfile[]>(DEFAULT_ARTISTS);

  useEffect(() => {
    setArtists(getArtistsFromStorage());
  }, []);

  return (
    <>
      <header className="gallery-header">
        <div className="gallery-header-inner">
          <Link href="/" className="gallery-brand">
            NEXO TATTOO
          </Link>

          <nav className="gallery-main-nav" aria-label="Main navigation">
            {galleryNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="gallery-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="gallery-header-actions">
            <Link href="/contact" className="gallery-book-btn">
              Book Session
            </Link>
          </div>
        </div>
      </header>

      <main
        className="gallery-page-shell"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "7.5rem 1.2rem 4rem",
          color: "var(--text-color, #f5f5f5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "inherit",
              textDecoration: "none",
              opacity: 0.8,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ← Back home
          </Link>

          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.8rem 1.2rem",
              borderRadius: 999,
              background: "linear-gradient(135deg, #5c0000 0%, #a30015 55%, #e63946 100%)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: 11,
              boxShadow: "0 16px 34px rgba(109, 6, 17, 0.28)",
            }}
          >
            Book a session
          </Link>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ margin: 0, opacity: 0.7, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 11 }}>
            Studio roster
          </p>
          <h1
            style={{
              margin: "0.8rem 0 0",
              fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
              letterSpacing: "-0.06em",
              lineHeight: 0.95,
            }}
          >
            Our Artists
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem" }}>
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "24px",
                overflow: "hidden",
                background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                boxShadow: "0 24px 48px rgba(0,0,0,0.08)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
              }}
            >
              <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
                <img
                  src={artist.image}
                  alt={artist.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.52))",
                  }}
                />
              </div>

              <div style={{ padding: "1rem 1rem 1.2rem" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
                  {artist.style}
                </div>
                <h2 style={{ margin: "0.45rem 0 0", fontSize: "1.6rem", letterSpacing: "-0.05em", lineHeight: 1.05 }}>
                  {artist.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="gallery-footer">
        <SocialLinks />
      </footer>

      <FloatingSocials />
      <ScrollToTopButton />

      <style dangerouslySetInnerHTML={{ __html: `
        .gallery-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .gallery-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 76px;
          padding: 0 1.2rem;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }

        .gallery-brand {
          color: var(--text-color, #f5f5f5);
          text-decoration: none;
          font-weight: 900;
          letter-spacing: -0.04em;
          font-size: 1.1rem;
        }

        .gallery-main-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.2rem;
          flex-wrap: wrap;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }

        .gallery-nav-link {
          color: var(--text-color, #f5f5f5);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.68rem;
          opacity: 0.7;
        }

        .gallery-nav-link:hover {
          opacity: 1;
        }

        .gallery-header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.8rem;
        }

        .gallery-book-btn,
        .gallery-admin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 1rem;
          border-radius: 999px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.65rem;
          font-weight: 800;
        }

        .gallery-book-btn {
          background: linear-gradient(135deg, #5c0000 0%, #a30015 55%, #e63946 100%);
          color: #fff;
          box-shadow: 0 10px 24px rgba(109, 6, 17, 0.28);
        }

        .gallery-admin-btn {
          border: 1px solid rgba(255,255,255,0.18);
          color: var(--text-color, #f5f5f5);
          background: rgba(255,255,255,0.02);
        }

        .gallery-page-shell {
          min-height: calc(100vh - 120px);
        }

        .gallery-footer {
          margin-top: 3rem;
          padding: 2rem 1.2rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.04);
        }

        @media (max-width: 900px) {
          .gallery-header-inner {
            grid-template-columns: 1fr;
            height: auto;
            padding-top: 0.85rem;
            padding-bottom: 0.85rem;
          }

          .gallery-main-nav {
            gap: 0.7rem 1rem;
          }

          .gallery-header-actions {
            justify-content: center;
          }

          .gallery-page-shell {
            padding-top: 10rem !important;
          }
        }
      `}} />
    </>
  );
}
