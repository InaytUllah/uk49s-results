import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/data/seo';

// Required under output: 'export' so robots.txt is emitted as a static file.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
