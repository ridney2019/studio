import { ReactNode } from "react";
import { ClientProviders } from "./ClientProviders";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXO Studio Tattoo",
  description: "Tattoo studio in Dublin, Ireland.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}