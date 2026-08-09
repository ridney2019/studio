"use client";

import { ReactNode, useEffect } from "react";
import { LanguageProvider } from "./providers";
import { CookieBanner } from "./components/CookieBanner";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { SessionProvider } from "next-auth/react";

export function ClientProviders({ children }: { children: ReactNode }) {
  // Automatically fix missing Windows country flags on system render
  useEffect(() => {
    polyfillCountryFlagEmojis();
  }, []);

  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
        <CookieBanner />
      </LanguageProvider>
    </SessionProvider>
  );
}