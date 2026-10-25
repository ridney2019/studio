// The first-visit choice between the studio and NEXO Labs (home page only).
// Remembering a choice only means "do not show the screen again for 30 days": it never redirects anybody by itself.
// Every read and write of localStorage is inside try/catch (private mode, blocked storage…): on any failure the screen simply shows.

export const LABS_URL = 'https://labs.nexotattooireland.com';
export const ENTRY_CHOICE_KEY = 'nexo-entry-choice';
/** fired on window when the screen is gone (a choice was made, or the page was left) so the cookie banner may appear */
export const ENTRY_CLOSED_EVENT = 'nexo-entry-closed';
export const ENTRY_REMEMBER_DAYS = 30;

export type EntryChoice = 'studio' | 'labs';

const DAY_MS = 24 * 60 * 60 * 1000;

/** robots and crawlers never get the screen (it would hide the studio's own page from them) */
const BOT_UA = /bot|crawler|crawling|spider|slurp|lighthouse/i;
/** people who come from a search engine go straight to the studio */
const SEARCH_HOST = /(^|\.)(google|bing|duckduckgo|yahoo)\.[a-z.]+$/i;

export function isBotUserAgent(ua: string | undefined | null): boolean {
  return BOT_UA.test(ua ?? '');
}

export function isSearchReferrer(referrer: string | undefined | null): boolean {
  if (!referrer) return false;
  // the Google app on Android reports its package as the referrer
  if (/^android-app:\/\/com\.google\.android\.googlequicksearchbox/i.test(referrer)) return true;
  try {
    return SEARCH_HOST.test(new URL(referrer).hostname);
  } catch {
    return false;
  }
}

/** The saved choice if it is still inside the 30 days, otherwise null. */
export function readEntryChoice(now = Date.now()): EntryChoice | null {
  try {
    const raw = window.localStorage.getItem(ENTRY_CHOICE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { choice?: unknown; at?: unknown };
    if ((v.choice !== 'studio' && v.choice !== 'labs') || typeof v.at !== 'number') return null;
    if (now - v.at > ENTRY_REMEMBER_DAYS * DAY_MS || v.at > now + DAY_MS) return null;
    return v.choice;
  } catch {
    return null;
  }
}

export function saveEntryChoice(choice: EntryChoice, now = Date.now()): void {
  try {
    window.localStorage.setItem(ENTRY_CHOICE_KEY, JSON.stringify({ choice, at: now }));
  } catch {
    /* storage blocked: the choice just is not remembered */
  }
}

/**
 * Should the screen be on? Only on the home page ("/", with or without a query string), for people (not robots) who did not come
 * from a search engine and did not choose in the last 30 days. Never runs on the server.
 */
export function entryChooserPending(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname !== '/') return false;
  if (isBotUserAgent(window.navigator.userAgent)) return false;
  if (isSearchReferrer(window.document.referrer)) return false;
  return readEntryChoice() === null;
}
