import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (OFL licensed, see src/app/fonts/) so builds and demos never depend on Google Fonts.
const publicSans = localFont({ src: "./fonts/public-sans-latin-wght-normal.woff2", weight: "100 900", variable: "--font-public-sans" });
const plexMono = localFont({ src: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: { default: "HackNCAT", template: "%s · HackNCAT" },
  description: "Team projects for HackNCAT.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
