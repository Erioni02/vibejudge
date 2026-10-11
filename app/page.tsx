import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { DemoSection } from "@/components/home/demo-section";
import { RoastStudio } from "@/components/home/roast-studio";
import { Faq, FinalCta, HowItWorks, Resources, homeFaq } from "@/components/home/sections";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { faqJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl }
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaq)} />
      <SiteHeader />
      <main>
        <RoastStudio />
        <HowItWorks />
        <DemoSection />
        <Faq />
        <FinalCta />
        <Resources />
      </main>
      <SiteFooter />
    </>
  );
}
