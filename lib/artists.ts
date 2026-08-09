import { TranslationKey } from "./translations";

export type ArtistProfile = {
  id: string;
  name: string;
  image: string;
  style: string;
  descKey: string;
};

export const ARTISTS_STORAGE_KEY = "nexo.artists.v1";
export const ARTISTS_UPDATED_EVENT = "nexo:artists-updated";

export const DEFAULT_ARTISTS: ArtistProfile[] = [
  {
    id: "felipe-santos",
    name: "FELIPE SANTOS",
    image: "/artists/felipe-santos.jpg",
    style: "BLACK REALISM",
    descKey: "artistFelipeDesc",
  },
  {
    id: "jay-shin",
    name: "JAY SHIN",
    image: "/artists/jay-shin.svg",
    style: "FINE LINE & FLORAL",
    descKey: "artistCarlaDesc",
  },
  {
    id: "victor",
    name: "VICTOR",
    image: "/artists/victor.svg",
    style: "TRADITIONAL INK",
    descKey: "artistZackDesc",
  },
  {
    id: "zee",
    name: "ZEE",
    image: "/artists/zee.svg",
    style: "NEO-TRADITIONAL",
    descKey: "artistVictoriaDesc",
  },
  {
    id: "adrian",
    name: "ADRIAN",
    image: "/artists/adrian.svg",
    style: "GEOMETRIC / DOTWORK",
    descKey: "artistEliasDesc",
  },
];

const sanitizeArtist = (artist: Partial<ArtistProfile>): ArtistProfile | null => {
  if (
    typeof artist.name !== "string" ||
    typeof artist.image !== "string" ||
    typeof artist.style !== "string" ||
    typeof artist.descKey !== "string"
  ) {
    return null;
  }

  const name = artist.name.trim();
  const image = artist.image.trim();
  const style = artist.style.trim();
  const descKey = artist.descKey.trim();

  if (!name || !image || !style || !descKey) {
    return null;
  }

  return {
    id: typeof artist.id === "string" && artist.id.trim() ? artist.id.trim() : createArtistId(name),
    name,
    image,
    style,
    descKey,
  };
};

export const createArtistId = (name: string): string => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const suffix = Date.now().toString(36).slice(-4);
  return `${slug || "artist"}-${suffix}`;
};

export const normalizeArtists = (value: unknown): ArtistProfile[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => sanitizeArtist(item as Partial<ArtistProfile>))
    .filter((artist): artist is ArtistProfile => artist !== null);
};

export const getArtistsFromStorage = (): ArtistProfile[] => {
  if (typeof window === "undefined") {
    return DEFAULT_ARTISTS;
  }

  const raw = window.localStorage.getItem(ARTISTS_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_ARTISTS;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeArtists(parsed);
    return normalized.length > 0 ? normalized : DEFAULT_ARTISTS;
  } catch {
    return DEFAULT_ARTISTS;
  }
};

export const saveArtistsToStorage = (artists: ArtistProfile[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ARTISTS_STORAGE_KEY, JSON.stringify(artists));
  window.dispatchEvent(new Event(ARTISTS_UPDATED_EVENT));
};

export const resolveArtistDesc = (
  t: (key: TranslationKey) => string,
  descKey: string,
  isTranslationKey: (key: string) => key is TranslationKey
): string => {
  return isTranslationKey(descKey) ? t(descKey) : descKey;
};
