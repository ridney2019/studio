"use client";

import { ReactNode, useEffect } from "react";
import { LanguageProvider } from "./providers"; 
import { CookieBanner } from "./components/CookieBanner";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Automatically fix missing Windows country flags on system render
  useEffect(() => {
    polyfillCountryFlagEmojis();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>NEXO Studio Tattoo</title>
        <meta name="description" content="Tattoo studio in Dublin, Ireland." />
      </head>
      <body>
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}