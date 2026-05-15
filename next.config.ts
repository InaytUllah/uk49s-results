import type { NextConfig } from "next";

// Static export config for Cloudflare Pages (free tier — truly unlimited bandwidth).
// All pages are pre-rendered at build time. Data freshness comes from rebuild
// cadence (GitHub Actions cron triggers a Cloudflare deploy ~5 min after each
// draw window). No server functions = zero overage risk.
//
// Headers and redirects can't be configured here in static export mode — they
// live in public/_headers and public/_redirects (Cloudflare Pages format).

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    // Static export can't use Next.js Image Optimization (no server).
    // Cloudflare serves the original images as-is.
    unoptimized: true,
  },
  // Trailing slash makes Cloudflare's static asset routing more predictable
  // (e.g. /lunchtime/ instead of /lunchtime).
  trailingSlash: true,
};

export default nextConfig;
