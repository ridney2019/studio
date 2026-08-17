"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialLinks } from "../../components/SocialLinks";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import FloatingSocials from "../../components/FloatingSocials";
import { ArtistProfile, DEFAULT_ARTISTS, getArtistsFromStorage } from "@/lib/artists";

const galleryNavItems = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/#location", label: "Location" },
  { href: "/contact", label: "Contact" },
  { href: "/workshop", label: "Workshop" },
];

export default function ArtistDetailPage() {
  const params = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const artists = getArtistsFromStorage();
    const matched = artists.find((item) => item.id === params?.id) ?? DEFAULT_ARTISTS.find((item) => item.id === params?.id) ?? null;
    setArtist(matched);
    setSelectedImage(null);
    setIsLightboxOpen(false);
  }, [params?.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  if (!artist) {
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

        <main style={{ maxWidth: 900, margin: "0 auto", padding: "7.5rem 1.25rem 3rem" }}>
          <Link href="/artists" style={{ color: "inherit", textDecoration: "none", opacity: 0.75 }}>
            ← Back to artists
          </Link>
          <h1 style={{ margin: "1.5rem 0 0", fontSize: "clamp(2.2rem, 6vw, 4rem)" }}>Artist not found</h1>
        </main>
      </>
    );
  }

  const galleryImages = artist.galleryImages && artist.galleryImages.length > 0 ? artist.galleryImages : [artist.image];

  const openLightbox = (image: string) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
  };

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
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "7.5rem 1.2rem 4rem",
          color: "var(--text-color, #f5f5f5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/artists"
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
            ← All artists
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
            Book session
          </Link>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 520px) minmax(0, 1fr)",
            gap: "2rem",
            alignItems: "center",
            marginTop: "2rem",
            padding: "1.2rem",
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
            boxShadow: "0 28px 60px rgba(0,0,0,0.08)",
          }}
        >
          <button
            type="button"
            onClick={() => openLightbox(artist.image)}
            style={{
              position: "relative",
              borderRadius: "28px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.14)",
              minHeight: 620,
              background: "rgba(0,0,0,0.15)",
              padding: 0,
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <img
              src={artist.image}
              alt={artist.name}
              style={{ display: "block", width: "100%", height: "100%", minHeight: 620, objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.32))",
              }}
            />
          </button>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
              Artist profile
            </div>
            <h1
              style={{
                margin: "0.8rem 0 0.5rem",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                letterSpacing: "-0.06em",
                lineHeight: 0.92,
              }}
            >
              {artist.name}
            </h1>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>
              {artist.style}
            </p>

            <p style={{ marginTop: "1.5rem", lineHeight: 1.8, opacity: 0.82, maxWidth: 650, fontSize: "1.02rem" }}>
              {artist.descKey || "Custom tattoo artistry focused on detail, flow, and a personal visual language."}
            </p>

            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.8rem" }}>
              {artist.instagram ? (
                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.8rem 1.2rem",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontSize: 11,
                  }}
                >
                  Instagram
                </a>
              ) : null}

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
                }}
              >
                Book session
              </Link>
            </div>

            {artist.tags && artist.tags.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "1.8rem" }}>
                {artist.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 999,
                      padding: "0.5rem 0.8rem",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section style={{ marginTop: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
            <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}>
              Gallery
            </h2>
            <span style={{ opacity: 0.7, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {galleryImages.length} image{galleryImages.length > 1 ? "s" : ""}
            </span>
          </div>

          <div
            style={{
              columnCount: "auto",
              columnWidth: "min(100%, 280px)",
              columnGap: "1rem",
            }}
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${artist.id}-${index}`}
                type="button"
                onClick={() => openLightbox(image)}
                style={{
                  display: "inline-block",
                  width: "100%",
                  margin: "0 0 1rem",
                  padding: 0,
                  borderRadius: "22px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                  boxShadow: "0 18px 42px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  breakInside: "avoid",
                  transition: "transform 0.28s ease, opacity 0.28s ease",
                }}
              >
                <img
                  src={image}
                  alt={`${artist.name} gallery ${index + 1}`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: index % 3 === 0 ? 360 : index % 3 === 1 ? 280 : 330,
                    objectFit: "cover",
                    transform: "scale(1.01)",
                    transition: "transform 0.35s ease",
                  }}
                />
              </button>
            ))}
          </div>
        </section>

        {isLightboxOpen && selectedImage ? (
          <div
            onClick={() => {
              setIsLightboxOpen(false);
              setSelectedImage(null);
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.82)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: "1.5rem",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                position: "relative",
                width: "min(100%, 1100px)",
                maxHeight: "90vh",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 28px 80px rgba(0,0,0,0.5)",
                background: "#111",
                animation: "zoomIn 0.25s ease",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setSelectedImage(null);
                }}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  zIndex: 2,
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: 0,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 22,
                }}
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt={artist.name}
                style={{ display: "block", width: "100%", maxHeight: "90vh", objectFit: "contain" }}
              />
            </div>
          </div>
        ) : null}
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

        .gallery-footer {
          margin-top: 0;
          padding: 2rem 1.2rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.04);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
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

          main {
            padding-top: 10rem !important;
          }
        }
      `}} />
    </>
  );
}
