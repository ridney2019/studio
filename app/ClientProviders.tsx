"use client";

import { ReactNode, useEffect } from "react";
import { LanguageProvider } from "./providers";
import { CookieBanner } from "./components/CookieBanner";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

export function ClientProviders({ children }: { children: ReactNode }) {
  // Automatically fix missing Windows country flags on system render
  useEffect(() => {
    polyfillCountryFlagEmojis();
  }, []);

  return (
    <LanguageProvider>
      {children}
      <CookieBanner />
    </LanguageProvider>
  );
}