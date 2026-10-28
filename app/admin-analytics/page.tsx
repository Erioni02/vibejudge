import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AdminLogin } from "@/components/admin/login-form";
import { AnalyticsDashboard } from "@/components/admin/dashboard";
import { ADMIN_COOKIE, adminConfig, verifySessionToken } from "@/lib/server/admin-auth";

// Private: never cached, never indexed, not linked from anywhere on the site.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: { absolute: "Analytics · VibeJudge" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null
};

export default async function AdminAnalyticsPage() {
  // Without configured credentials the route does not exist at all.
  if (!adminConfig()) notFound();

  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const signedIn = verifySessionToken(token);

  return <div className="admin-theme">{signedIn ? <AnalyticsDashboard /> : <AdminLogin />}</div>;
}
