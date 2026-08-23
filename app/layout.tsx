import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vibejudge.app"),
  title: "VibeJudge - Get Your Resume Roasted by AI",
  description:
    "Upload your resume and get brutally honest AI feedback, actionable fixes, and a score. Free, no signup required.",
  alternates: {
    canonical: "https://vibejudge.app"
  },
  openGraph: {
    title: "VibeJudge - Get Your Resume Roasted by AI",
    description:
      "Free AI resume feedback with a useful roast, concrete fixes, and an interview-practice next step.",
    url: "https://vibejudge.app",
    siteName: "VibeJudge",
    images: [{ url: "/cv.png", width: 512, height: 512, alt: "VibeJudge logo" }],
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "VibeJudge - Get Your Resume Roasted by AI",
    description: "Upload your resume. Get roasted. Fix it.",
    images: ["/cv.png"]
  },
  icons: {
    icon: "/cv.png",
    shortcut: "/cv.png",
    apple: "/cv.png"
  },
  keywords: [
    "AI resume checker",
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
      <body>{children}</body>
    </html>
  );
}
