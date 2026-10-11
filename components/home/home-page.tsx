import { JsonLd } from "@/components/json-ld";
import { DemoSection } from "@/components/home/demo-section";
import { RoastStudio } from "@/components/home/roast-studio";
import { Faq, FinalCta, HowItWorks, Resources, TierShowcase, homeFaq } from "@/components/home/sections";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { faqJsonLd } from "@/lib/seo";

/** The full landing page. Roast-off links render it with the friend's score preloaded. */
export function HomePage({ challengeScore = null }: { challengeScore?: number | null }) {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaq)} />
      <SiteHeader />
      <main>
        <RoastStudio initialChallengeScore={challengeScore} />
        <HowItWorks />
        <DemoSection />
        <TierShowcase />
        <Faq />
        <FinalCta />
        <Resources />
      </main>
      <SiteFooter />
    </>
  );
}
