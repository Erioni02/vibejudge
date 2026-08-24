import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { resumeExamples } from "@/data/resume-examples";
import { roastPages } from "@/data/roasts";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: "", priority: 1 },
    { path: "/ai-resume-checker", priority: 0.9 },
    { path: "/free-resume-checker", priority: 0.9 },
    { path: "/resume-review", priority: 0.8 },
    { path: "/resume-roast", priority: 0.8 },
    { path: "/resume-feedback", priority: 0.8 },
    { path: "/ats-resume-checker", priority: 0.9 },
    { path: "/resume-examples", priority: 0.8 },
    { path: "/guides", priority: 0.8 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 }
  ];

  return [
    ...staticPaths.map((item) => ({
      url: `${siteUrl}${item.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: item.priority
    })),
    ...resumeExamples.map((example) => ({
      url: `${siteUrl}/resume-examples/${example.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...guides.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified: new Date(guide.published),
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...roastPages.map((page) => ({
      url: `${siteUrl}/resume-roast/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
