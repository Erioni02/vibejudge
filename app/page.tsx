import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl }
};

export default function Home() {
  return <HomePage />;
}
