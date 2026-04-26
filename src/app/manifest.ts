import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UK49s Results',
    short_name: 'UK49s',
    description: 'Today\'s UK 49s Lunchtime and Teatime winning numbers, hot & cold analysis, predictions, and a number checker. Updated within minutes of each draw.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#059669',
    categories: ['games', 'sports', 'utilities'],
    lang: 'en-GB',
    icons: [
      {
        src: '/app-icon?size=192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon?size=192&maskable=1',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/app-icon?size=512&maskable=1',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
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
