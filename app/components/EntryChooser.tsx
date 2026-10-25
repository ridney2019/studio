"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { ENTRY_CLOSED_EVENT, LABS_URL, entryChooserPending, saveEntryChoice } from "@/lib/entry-choice";

/**
 * First visit to the home page: studio or NEXO Labs. Full-screen dialog, client only (nothing is rendered on the server, so
 * a returning visitor never sees it flash). X and Esc count as "studio". It never redirects by itself.
 */
export function EntryChooser() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(false);

  // Decide once on the client, before the first paint of the result.
  useEffect(() => {
    if (entryChooserPending()) setOpen(true);
    return () => {
      // leaving the home page without choosing must not keep the cookie banner away
      window.dispatchEvent(new Event(ENTRY_CLOSED_EVENT));
    };
  }, []);

  const chooseStudio = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    saveEntryChoice("studio");
    setOpen(false);
    window.dispatchEvent(new Event(ENTRY_CLOSED_EVENT));
  }, []);

  // Focus on the first button, keep Tab inside, Esc = studio, and the page behind does not scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        chooseStudio();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      const items = Array.from(rootRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !rootRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !rootRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previous;
    };
  }, [open, chooseStudio]);

  if (!open) return null;

  return (
    <div ref={rootRef} className="entry-chooser" role="dialog" aria-modal="true" aria-label={t("entryDialogLabel")}>
      <style dangerouslySetInnerHTML={{ __html: ENTRY_CSS }} />
      <div className="entry-grid">
        <section className="entry-panel">
          <h2 className="entry-title">NEXO Studios</h2>
          <p className="entry-sub">{t("entryStudioSubtitle")}</p>
          <button ref={firstButtonRef} type="button" className="entry-btn entry-btn-studio" onClick={chooseStudio}>
            {t("entryStudioButton")}
          </button>
        </section>
        <section className="entry-panel entry-panel-labs">
          <h2 className="entry-title">NEXO Labs</h2>
          <p className="entry-sub">{t("entryLabsSubtitle")}</p>
          {/* a real link in the same tab; the choice is saved first, the browser then follows the link */}
          <a className="entry-btn entry-btn-labs" href={LABS_URL} onClick={() => saveEntryChoice("labs")}>
            {t("entryLabsButton")}
          </a>
        </section>
      </div>
      <button type="button" className="entry-close" onClick={chooseStudio} aria-label={t("entryClose")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// Same look as the site: its dark/light variables, the red gradient button and the outlined button.
const ENTRY_CSS = `
.entry-chooser { position: fixed; inset: 0; z-index: 10000; background: var(--bg-color, #050505); color: var(--text-primary, #f5f5f5); display: flex; flex-direction: column; overflow-y: auto; }
.entry-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; min-height: 100%; }
.entry-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 1.1rem; padding: 4rem 2rem; }
.entry-panel-labs { border-left: 1px solid var(--border-color, rgba(255,255,255,0.08)); background: var(--card-bg, rgba(255,255,255,0.03)); }
.entry-title { margin: 0; font-size: clamp(2rem, 5vw, 3.6rem); line-height: 1; letter-spacing: 0.12em; font-weight: 800; }
.entry-sub { margin: 0; max-width: 24rem; font-size: 0.9rem; line-height: 1.6; letter-spacing: 0.08em; color: var(--text-secondary, #d4d4d4); }
.entry-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 52px; margin-top: 1rem; padding: 1.1rem 2.4rem; border-radius: 100px; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-decoration: none; cursor: pointer; font-family: inherit; transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), filter 0.2s ease, background 0.2s ease, color 0.2s ease; }
.entry-btn-studio { background: linear-gradient(135deg, #5c0000 0%, #a30015 50%, #e63946 100%); color: #fff; border: 0; box-shadow: 0 10px 26px rgba(108, 4, 12, 0.32); }
.entry-btn-studio:hover { transform: scale(1.02); filter: brightness(1.08); }
.entry-btn-labs { background: transparent; color: var(--text-primary, #f5f5f5); border: 1.5px solid var(--text-primary, #f5f5f5); }
.entry-btn-labs:hover { background: var(--text-primary, #f5f5f5); color: var(--bg-color, #050505); }
.entry-btn:focus-visible, .entry-close:focus-visible { outline: 3px solid var(--text-primary, #f5f5f5); outline-offset: 3px; }
.entry-close { position: fixed; top: 1rem; right: 1rem; z-index: 2; width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--border-color, rgba(255,255,255,0.18)); background: var(--bg-color, #050505); color: var(--text-primary, #f5f5f5); cursor: pointer; }
.entry-close:hover { background: var(--text-primary, #f5f5f5); color: var(--bg-color, #050505); }
@media (max-width: 760px) {
  .entry-grid { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
  .entry-panel { padding: 3.5rem 1.5rem; gap: 0.8rem; }
  .entry-panel-labs { border-left: 0; border-top: 1px solid var(--border-color, rgba(255,255,255,0.08)); }
  .entry-btn { padding: 1rem 2rem; margin-top: 0.6rem; }
}
@media (prefers-reduced-motion: reduce) { .entry-btn { transition: none; } }
`;
