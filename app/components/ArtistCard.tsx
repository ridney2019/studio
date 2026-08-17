"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRef, useState } from "react";
import styles from "./ArtistCard.module.css";

export type ArtistCardProps = {
  name: string;
  specialty?: string;
  style?: string;
  profileImage: string;
  accentColor?: string;
  instagramUrl?: string;
  bookingUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  tags?: string[];
  onSelect?: (name: string) => void;
  isSelected?: boolean;
};

export function ArtistCard({
  name,
  specialty,
  style,
  profileImage,
  accentColor = "#e0a96d",
  instagramUrl,
  bookingUrl = "/contact",
  portfolioUrl,
  bio,
  tags,
  onSelect,
  isSelected = false,
}: ArtistCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width;
    const offsetY = (event.clientY - bounds.top) / bounds.height;

    const rotateY = (offsetX - 0.5) * 18;
    const rotateX = (0.5 - offsetY) * 18;

    setTilt({ rotateX, rotateY });
  };

  const resetTilt = () => setTilt({ rotateX: 0, rotateY: 0 });

  const displayStyle = specialty || style || "Tattoo Artist";
  const dynamicStyle = {
    ["--accent-color" as any]: accentColor,
    ["--accent-glow" as any]: `${accentColor}4d`,
  } as CSSProperties;

  const primaryHref = portfolioUrl || bookingUrl || "/contact";
  const isExternalLink = /^(https?:)?\/\//.test(primaryHref);
  const showInstagram = Boolean(instagramUrl && instagramUrl !== portfolioUrl);
  const showPortfolio = Boolean(portfolioUrl && portfolioUrl !== instagramUrl);
  const visibleTags = tags && tags.length > 0 ? tags.slice(0, 3) : [displayStyle];
  const galleryActionLabel = showPortfolio ? "View Gallery" : isExternalLink ? "View Gallery" : "Book Session";

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(name);
    }
  };

  return (
    <div className={`${styles.cardWrap} ${isSelected ? styles.selectedCard : ""}`}>
      <div
        ref={cardRef}
        className={styles.card}
        style={dynamicStyle}
        onMouseMove={handlePointerMove}
        onMouseLeave={resetTilt}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`View ${name} profile`}
      >
        <div
          className={styles.cardInner}
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          }}
        >
          <span className={styles.watermark}>NEXO TATTOO</span>
          <span className={styles.watermarkSecondary}>ARTIST PROFILE</span>

          <div className={styles.nameRow}>
            <h3 className={styles.name}>{name}</h3>
          </div>

          <div className={styles.circle} />

          <img className={styles.product} src={profileImage} alt={`${name} profile`} />

          <div className={styles.metaRow}> 
            <span className={styles.specialty}>{displayStyle}</span>
          </div>

          <div className={styles.actions}>
            {showInstagram ? (
              <a
                className={styles.secondaryButton}
                href={instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(event) => event.stopPropagation()}
              >
                Instagram
              </a>
            ) : null}

            {showPortfolio || isExternalLink ? (
              <a
                className={styles.primaryButton}
                href={primaryHref}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(event) => event.stopPropagation()}
              >
                {galleryActionLabel}
              </a>
            ) : (
              <a
                className={styles.primaryButton}
                href={primaryHref}
                onClick={(event) => event.stopPropagation()}
              >
                Book Session
              </a>
            )}
          </div>

          {bio ? <p className={styles.cardSummary}>{bio}</p> : null}

          {visibleTags.length > 0 ? (
            <div className={styles.tagRow}>
              {visibleTags.map((tag) => (
                <span key={tag} className={styles.tagPill}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
