export const SITE_NAME = 'UK49s Results';
export const SITE_URL = 'https://uk49sresults.co.uk';
export const SITE_DESCRIPTION = 'Get the latest UK 49s results — Brunchtime, Lunchtime, Drivetime and Teatime winning numbers updated within minutes of every draw, plus hot & cold numbers, predictions, and a number generator.';

export function generateTitle(page: string): string {
  if (page === 'home') return `UK 49s Results Today - Lunchtime & Teatime Winning Numbers | ${SITE_NAME}`;
  return `${page} | ${SITE_NAME}`;
}

/**
 * Generate standard OG + Twitter metadata from title, description, and path.
 * Use in page metadata: ...ogMeta('UK 49s Lunchtime Results', 'desc', '/lunchtime')
 *
 * Note: We intentionally don't set `images` here. Next.js auto-detects
 * src/app/opengraph-image.tsx and uses it as the default OG image for every
 * route — which works at build time under static export (zero runtime cost).
 * Individual pages can still override by placing their own opengraph-image.tsx
 * in their route folder.
 */
export function ogMeta(title: string, description: string, path: string) {
  return {
    openGraph: {
      title,
      description,
      type: 'website' as const,
      url: `${SITE_URL}${path}`,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
  };
}

export const PAGE_SEO = {
  home: {
    title: `UK 49s Results Today - Lunchtime & Teatime Winning Numbers | ${SITE_NAME}`,
    description: 'Today\'s UK 49s Lunchtime and Teatime winning numbers. Results go up within minutes of each draw. Also includes hot & cold numbers, predictions, and past results.',
  },
  brunchtime: {
    title: `UK 49s Brunchtime Results Today - Winning Numbers | ${SITE_NAME}`,
    description: 'UK 49s Brunchtime results for today. The 10:49 AM draw numbers are posted here within minutes. Past brunchtime results also available.',
  },
  lunchtime: {
    title: `UK 49s Lunchtime Results Today - Winning Numbers | ${SITE_NAME}`,
    description: 'UK 49s Lunchtime results for today. The 12:49 PM draw numbers are posted here within minutes. Past lunchtime results also available.',
  },
  drivetime: {
    title: `UK 49s Drivetime Results Today - Winning Numbers | ${SITE_NAME}`,
    description: 'UK 49s Drivetime results for today. The 4:49 PM draw numbers are posted here within minutes. Past drivetime results also available.',
  },
  teatime: {
    title: `UK 49s Teatime Results Today - Winning Numbers | ${SITE_NAME}`,
    description: 'UK 49s Teatime results for today. The 5:49 PM draw numbers are posted here within minutes. Past teatime results also available.',
  },
  brunchtimePredictions: {
    title: `UK 49s Brunchtime Predictions Today - 10:49 AM Draw | ${SITE_NAME}`,
    description: 'UK 49s Brunchtime predictions for today\'s 10:49 AM draw. Three data-driven prediction sets using hot streak, balanced, and spread strategies.',
  },
  drivetimePredictions: {
    title: `UK 49s Drivetime Predictions Today - 4:49 PM Draw | ${SITE_NAME}`,
    description: 'UK 49s Drivetime predictions for today\'s 4:49 PM draw. Three data-driven prediction sets using hot streak, balanced, and spread strategies.',
  },
  hotCold: {
    title: `49s Hot and Cold Numbers Today - UK 49s Lunchtime & Teatime | ${SITE_NAME}`,
    description: 'Today\'s 49s hot and cold numbers for UK 49s Lunchtime and Teatime draws. See the most and least frequently drawn numbers updated daily with statistical analysis.',
  },
  predictions: {
    title: `UK 49s Predictions for Today - Lunchtime & Teatime Draw | ${SITE_NAME}`,
    description: 'UK 49s predictions for today\'s Lunchtime and Teatime draws. Statistical analysis, hot numbers, and weighted prediction sets for the 12:49 PM and 5:49 PM draws.',
  },
  numberGenerator: {
    title: `UK 49s Random Number Generator - Pick Your Numbers | ${SITE_NAME}`,
    description: 'Random number picker for UK 49s. Generates 6 numbers plus a Booster for Lunchtime or Teatime bets. Quick pick or choose your own.',
  },
  history: {
    title: `UK 49s Past Results - Lunchtime & Teatime History | ${SITE_NAME}`,
    description: 'Full archive of UK 49s past results. Look up any Lunchtime or Teatime draw by date. Updated after every draw.',
  },
  howToPlay: {
    title: `How to Play UK 49s - Rules, Odds & Guide | ${SITE_NAME}`,
    description: 'UK 49s rules explained simply. How the draws work, what the Booster ball is, how odds change based on how many numbers you pick, and where to place bets.',
  },
  blog: {
    title: `UK 49s Blog - Latest News, Tips & Analysis | ${SITE_NAME}`,
    description: 'UK 49s predictions, number analysis, and draw breakdowns. New posts before each Lunchtime and Teatime draw.',
  },
  privacyPolicy: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'Read our privacy policy to understand how UK49s Results handles your data, cookies, and third-party services like Google AdSense.',
  },
  terms: {
    title: `Terms & Conditions | ${SITE_NAME}`,
    description: 'Terms and conditions for using UK49s Results. Important information about our services, disclaimers, and user responsibilities.',
  },
  about: {
    title: `About Us - UK 49s Results & Predictions | ${SITE_NAME}`,
    description: 'Who runs UK49s Results and why we built it. We post Lunchtime and Teatime numbers fast and keep the site clean and easy to use.',
  },
  contact: {
    title: `Contact Us | ${SITE_NAME}`,
    description: 'Questions, feedback, or something broken? Get in touch with the UK49s Results team.',
  },
  responsibleGaming: {
    title: `Responsible Gaming - Play Safely | ${SITE_NAME}`,
    description: 'Information about responsible gambling. Find help, support organisations, and tips for safe and responsible play with UK 49s.',
  },
  disclaimer: {
    title: `Disclaimer | ${SITE_NAME}`,
    description: 'Important disclaimer about UK49s Results. We are not affiliated with UK 49s or any lottery operator. Predictions are for informational purposes only.',
  },
  faq: {
    title: `UK 49s FAQ - Frequently Asked Questions About UK49s Lottery | ${SITE_NAME}`,
    description: 'Find answers to the most common UK 49s questions. Learn about draw times, odds, how to play, results checking, and winning strategies.',
  },
  odds: {
    title: `UK 49s Odds & Payouts - Winning Chances Explained | ${SITE_NAME}`,
    description: 'Understand UK 49s odds and payouts for every bet type. Compare odds for 1 to 5 number selections with and without the Booster ball.',
  },
  lunchtimeVsTeatime: {
    title: `Lunchtime vs Teatime - UK 49s Draw Comparison & Stats | ${SITE_NAME}`,
    description: 'Side-by-side comparison of UK 49s Lunchtime and Teatime draws. See which numbers show up more in each draw and how the two differ statistically.',
  },
  numbers: {
    title: `UK49s Statistics - Number Frequency & Analysis for All 49 Numbers | ${SITE_NAME}`,
    description: 'Complete UK49s statistics for all 49 numbers. View draw frequency, percentage, hot/cold status, and historical performance for every UK 49s Lunchtime and Teatime number.',
  },
};
