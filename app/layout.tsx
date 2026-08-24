import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { webAppJsonLd } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free AI Resume Checker & Resume Roast | VibeJudge",
    template: `%s | ${siteName}`
  },
  description:
    "Upload your resume and get brutally honest AI feedback, a resume score, ATS analysis, and actionable improvements. Free, no signup required.",
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Free AI Resume Checker & Resume Roast | VibeJudge",
    description:
      "Upload your resume and get brutally honest AI feedback, a resume score, ATS analysis, and actionable fixes in seconds. Free, no signup required.",
    url: siteUrl,
    siteName,
    images: [{ url: "/cv.png", width: 512, height: 512, alt: `${siteName} logo` }],
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Free AI Resume Checker & Resume Roast | VibeJudge",
    description: "Upload your resume. Get roasted. Fix what matters. Free, no signup required.",
    images: ["/cv.png"]
  },
  icons: {
    icon: "/cv.png",
    shortcut: "/cv.png",
    apple: "/cv.png"
  },
  keywords: [
    "AI resume checker",
    "free resume checker",
    "resume roast",
    "resume feedback",
    "free resume review",
    "AI resume reviewer",
    "resume analyzer",
    "resume critique",
    "ATS resume checker"
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <JsonLd data={webAppJsonLd()} />
        {children}
      </body>
    </html>
  );
}
