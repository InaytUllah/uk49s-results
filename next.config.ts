import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure fresh results are not cached by browsers/CDNs
  async headers() {
    return [
      {
        // Dynamic pages that show results - don't cache in browser
        source: '/(lunchtime|teatime|predictions|hot-cold-numbers|history|numbers|lunchtime-vs-teatime)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=30',
          },
        ],
      },
      {
        // Homepage - always fresh
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=30',
          },
        ],
      },
      {
        // API/cron endpoint - never cache
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
