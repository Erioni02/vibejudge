import Link from "next/link";
import { ContentShell, ToolCta } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";
import { resumeExamples } from "@/data/resume-examples";

export const metadata = pageMetadata({
  title: "Resume Examples by Role and Career Stage",
  description:
    "Free resume examples for 20+ roles and career stages: software engineer, product manager, data analyst, student, career change and more. Each with bullet samples, ATS keywords, and formatting tips.",
  path: "/resume-examples"
});

const categoryLabels: Record<string, string> = {
  engineering: "Engineering & Security",
  data: "Data & Analytics",
  "product-design": "Product & Design",
  business: "Business & Marketing",
  "career-stage": "Career Stage"
};

export default function ResumeExamplesPage() {
  const categories = Object.keys(categoryLabels).filter((category) =>
    resumeExamples.some((example) => example.category === category)
  );

  return (
    <ContentShell>
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">Resume Examples</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">Resume Examples by Role</h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">
        Each example page includes a full sample resume, a professional summary you can learn from, bad-versus-good
        bullet rewrites with explanations, role-specific ATS keywords, formatting tips, and the mistakes that get that
        role&apos;s resumes rejected.
      </p>

      {categories.map((category) => (
        <section key={category} className="mt-12">
          <h2 className="text-2xl font-black uppercase">{categoryLabels[category]}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {resumeExamples
              .filter((example) => example.category === category)
              .map((example) => (
                <Link
                  key={example.slug}
                  href={`/resume-examples/${example.slug}`}
                  className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-ink"
                >
                  <h3 className="font-black group-hover:text-ember">{example.role} resume example →</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{example.introduction.split(". ")[0]}.</p>
                </Link>
              ))}
          </div>
        </section>
      ))}

      <div className="mt-12">
        <ToolCta
          heading="How does your resume compare?"
          body="You have seen what good looks like for your role. Upload yours and get the score, the roast, and the fixes."
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase">Keep reading</h2>
        <ul className="mt-4 grid gap-3 text-sm font-semibold sm:grid-cols-2">
          <li>
            <Link href="/guides" className="text-stone-700 hover:text-ink">
              Resume guides: writing, ATS, bullets, and more →
            </Link>
          </li>
          <li>
            <Link href="/resume-roast" className="text-stone-700 hover:text-ink">
              Resume roasts by role: weak bullets, rebuilt →
            </Link>
          </li>
          <li>
            <Link href="/guides/how-to-write-a-resume" className="text-stone-700 hover:text-ink">
              How to write a resume, step by step →
            </Link>
          </li>
          <li>
            <Link href="/guides/ats-resume-guide" className="text-stone-700 hover:text-ink">
              Passing ATS: the complete guide →
            </Link>
          </li>
        </ul>
      </section>
    </ContentShell>
  );
}
