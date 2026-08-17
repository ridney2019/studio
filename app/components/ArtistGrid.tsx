"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArtistCard, type ArtistCardProps } from "./ArtistCard";
import styles from "./ArtistGrid.module.css";

export type ArtistGridItem = ArtistCardProps;

type ArtistFilter = "all" | "blackwork" | "fine-line" | "traditional" | "neo-traditional" | "geometric";

const FILTERS: { id: ArtistFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "blackwork", label: "Blackwork" },
  { id: "fine-line", label: "Fine Line" },
  { id: "traditional", label: "Traditional" },
  { id: "neo-traditional", label: "Neo-traditional" },
  { id: "geometric", label: "Geometric" },
];

const getArtistFilter = (style: string = ""): ArtistFilter => {
  const value = style.toLowerCase();

  if (value.includes("black")) return "blackwork";
  if (value.includes("fine") || value.includes("line")) return "fine-line";
  if (value.includes("neo")) return "neo-traditional";
  if (value.includes("traditional") || value.includes("tribal")) return "traditional";
  if (value.includes("geo") || value.includes("dot")) return "geometric";

  return "all";
};

export function ArtistGrid({ artists }: { artists: ArtistGridItem[] }) {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(artists[0]?.name ?? null);
  const [activeFilter, setActiveFilter] = useState<ArtistFilter>("all");

  const filteredArtists = useMemo(() => {
    if (activeFilter === "all") return artists;
    return artists.filter((artist) => getArtistFilter(artist.style) === activeFilter);
  }, [activeFilter, artists]);

  useEffect(() => {
    if (!artists.length) {
      setSelectedArtist(null);
      return;
    }

    if (!selectedArtist || !artists.some((artist) => artist.name === selectedArtist)) {
      setSelectedArtist(artists[0].name);
    }
  }, [artists, selectedArtist]);

  useEffect(() => {
    if (!filteredArtists.length) {
      return;
    }

    const activeExists = filteredArtists.some((artist) => artist.name === selectedArtist);
    if (!activeExists) {
      setSelectedArtist(filteredArtists[0].name);
    }
  }, [filteredArtists, selectedArtist]);

  const activeArtist = filteredArtists.find((artist) => artist.name === selectedArtist) ?? filteredArtists[0] ?? artists[0];

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`${styles.filterButton} ${activeFilter === filter.id ? styles.filterButtonActive : ""}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeArtist ? (
          <motion.div
            key={activeArtist.name}
            className={styles.featuredPanel}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.featuredImageWrap}>
              <img src={activeArtist.profileImage} alt={activeArtist.name} className={styles.featuredImage} />
            </div>

            <div className={styles.featuredContent}>
              <div className={styles.featuredMeta}>
                <span>Artist Profile</span>
                <span>{activeArtist.specialty || activeArtist.style || "Tattoo Artist"}</span>
              </div>

              <h3>{activeArtist.name}</h3>
              <p className={styles.featuredStyle}>{activeArtist.specialty || activeArtist.style || "Tattoo Artist"}</p>
              <p className={styles.featuredBio}>
                {activeArtist.bio || "Crafting expressive, bespoke work with a focus on detail, flow, and individuality."}
              </p>

              <div className={styles.featuredTags}>
                {(activeArtist.tags && activeArtist.tags.length > 0 ? activeArtist.tags : [activeArtist.style || "Tattoo Artist"]).slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className={styles.featuredActions}>
                {activeArtist.instagramUrl && activeArtist.instagramUrl !== activeArtist.portfolioUrl ? (
                  <a href={activeArtist.instagramUrl} target="_blank" rel="noreferrer noopener">Instagram</a>
                ) : null}
                {activeArtist.portfolioUrl && activeArtist.portfolioUrl !== activeArtist.instagramUrl ? (
                  <a href={activeArtist.portfolioUrl} target="_blank" rel="noreferrer noopener">View Gallery</a>
                ) : null}
                <a href={activeArtist.bookingUrl || "/contact"}>Book Session</a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={styles.grid}>
        {filteredArtists.map((artist) => (
          <ArtistCard
            key={artist.name}
            {...artist}
            onSelect={setSelectedArtist}
            isSelected={selectedArtist === artist.name}
          />
        ))}
      </div>
    </div>
  );
}
