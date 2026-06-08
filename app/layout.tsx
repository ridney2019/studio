import type { Metadata } from "next";
import { ReactNode } from "react";
import { LanguageProvider } from "./providers"; // Points directly to app/providers
import { Header } from "./components/Header";
import { CookieBanner } from "./components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXO Studio Tattoo",
  description: "Tattoo studio in Dublin, Ireland.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
