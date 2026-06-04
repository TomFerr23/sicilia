import type { Metadata } from "next";
import { Fraunces, Spline_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const splineSans = Spline_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sicilia — 7 days in the southeast",
  description:
    "An interactive 7-night self-drive itinerary for southeast Sicily (10–17 August). Toggle between flying into Catania or driving down and crossing by ferry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${splineSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
