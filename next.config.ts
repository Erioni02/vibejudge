import type { NextConfig } from "next";

const privateHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Cache-Control", value: "no-store, private" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" }
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb"
    }
  },
  async headers() {
    // The admin area is deliberately not listed in robots.txt (that would advertise it).
    return [
      { source: "/admin-analytics", headers: privateHeaders },
      { source: "/admin-analytics/:path*", headers: privateHeaders },
      { source: "/api/admin/:path*", headers: privateHeaders }
    ];
  }
};

export default nextConfig;
