import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Inter } from "next/font/google";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { JsonLd } from "@/components/json-ld";
import { UpdatesPopup } from "@/components/updates-popup";
import { webAppJsonLd } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap"
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap"
});

const defaultTitle = "VibeJudge — Free AI CV Roast & CV Generator";
const defaultDescription =
  "Upload your CV and get a brutally honest AI roast with a score and specific fixes. Download the roast or generate a brand-new CV. Free, no account needed.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: "Your CV is lying to you. Get a brutally honest AI roast, then generate a better CV. Free, no account."
  },
  keywords: [
    "CV roast",
    "resume roast",
    "AI CV checker",
    "AI resume checker",
    "free resume checker",
    "AI CV generator",
    "resume feedback",
    "ATS resume checker"
  ]
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${serif.variable}`}>
      <body>
        <JsonLd data={webAppJsonLd()} />
        <AnalyticsTracker />
        {children}
        <UpdatesPopup />
      </body>
    </html>
  );
}
