import type { MetadataRoute } from 'next';

// Required under output: 'export' so manifest.webmanifest is emitted as a
// static JSON file at build time.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UK49s Results',
    short_name: 'UK49s',
    description: 'Today\'s UK 49s Brunchtime, Lunchtime, Drivetime and Teatime winning numbers, hot & cold analysis, predictions, and a number checker. Updated within minutes of each draw.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#059669',
    categories: ['games', 'sports', 'utilities'],
    lang: 'en-GB',
    icons: [
      // Next.js auto-generates /icon.png (32x32) and /apple-icon.png (180x180)
      // from icon.tsx / apple-icon.tsx — those work for browser tabs and iOS
      // home screen. Android PWA install prefers 192/512 but will fall back.
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Lunchtime Results',
        short_name: 'Lunch',
        description: 'Today\'s 12:49 PM Lunchtime draw',
        url: '/lunchtime',
      },
      {
        name: 'Teatime Results',
        short_name: 'Tea',
        description: 'Today\'s 5:49 PM Teatime draw',
        url: '/teatime',
      },
      {
        name: 'Number Checker',
        short_name: 'Check',
        description: 'Did your numbers win?',
        url: '/check',
      },
      {
        name: 'Hot & Cold Numbers',
        short_name: 'Hot/Cold',
        description: 'Most and least drawn numbers',
        url: '/hot-cold-numbers',
      },
    ],
  };
}
