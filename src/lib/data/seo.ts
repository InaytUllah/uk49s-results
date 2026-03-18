export const SITE_NAME = 'UK49s Results';
export const SITE_URL = 'https://uk49sresults.co.uk';
export const SITE_DESCRIPTION = 'Get the latest UK 49s Lunchtime and Teatime results. Updated daily with winning numbers, hot & cold numbers, predictions, and number generator.';

export function generateTitle(page: string): string {
  if (page === 'home') return `UK 49s Results Today - Lunchtime & Teatime Winning Numbers | ${SITE_NAME}`;
  return `${page} | ${SITE_NAME}`;
}

export const PAGE_SEO = {
  home: {
    title: `UK 49s Results Today - Lunchtime & Teatime Winning Numbers | ${SITE_NAME}`,
    description: 'Get the latest UK 49s Lunchtime and Teatime results updated daily. Check today\'s winning numbers, hot & cold numbers, predictions, and past results.',
  },
  lunchtime: {
    title: `UK 49s Lunchtime Results Today - Winning Numbers | ${SITE_NAME}`,
    description: 'Check the latest UK 49s Lunchtime results. Today\'s winning numbers drawn at 12:49 PM UK time. View past lunchtime results and number analysis.',
  },
  teatime: {
    title: `UK 49s Teatime Results Today - Winning Numbers | ${SITE_NAME}`,
    description: 'Check the latest UK 49s Teatime results. Today\'s winning numbers drawn at 5:49 PM UK time. View past teatime results and number analysis.',
  },
  hotCold: {
    title: `UK 49s Hot and Cold Numbers - Most & Least Drawn | ${SITE_NAME}`,
    description: 'Discover UK 49s hot and cold numbers. See which numbers are drawn most and least frequently for Lunchtime and Teatime draws.',
  },
  predictions: {
    title: `UK 49s Predictions Today - Lunchtime & Teatime | ${SITE_NAME}`,
    description: 'Get UK 49s predictions for today\'s Lunchtime and Teatime draws. Based on statistical analysis of past results and number frequency.',
  },
  numberGenerator: {
    title: `UK 49s Random Number Generator - Pick Your Numbers | ${SITE_NAME}`,
    description: 'Generate random UK 49s numbers for Lunchtime and Teatime draws. Free random number picker with smart and quick pick options.',
  },
  history: {
    title: `UK 49s Past Results - Lunchtime & Teatime History | ${SITE_NAME}`,
    description: 'Browse UK 49s past results for both Lunchtime and Teatime draws. Complete history of winning numbers searchable by date.',
  },
  howToPlay: {
    title: `How to Play UK 49s - Rules, Odds & Guide | ${SITE_NAME}`,
    description: 'Learn how to play UK 49s lottery. Complete guide covering rules, odds of winning, draw times, and betting options for Lunchtime and Teatime.',
  },
  blog: {
    title: `UK 49s Blog - Latest News, Tips & Analysis | ${SITE_NAME}`,
    description: 'Stay updated with UK 49s news, tips, analysis and winning strategies. Latest articles about Lunchtime and Teatime draws.',
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
    description: 'Learn about UK49s Results, our mission to provide fast and accurate UK 49s Lunchtime and Teatime results, predictions, and statistical analysis.',
  },
  contact: {
    title: `Contact Us | ${SITE_NAME}`,
    description: 'Get in touch with the UK49s Results team. Contact us for questions, feedback, or to report issues with our UK 49s results service.',
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
    description: 'Compare UK 49s Lunchtime and Teatime draws side by side. Discover which draw has the hottest numbers and explore statistical differences.',
  },
  numbers: {
    title: `UK 49s Numbers 1-49 - Individual Number Stats & History | ${SITE_NAME}`,
    description: 'Explore detailed statistics for every UK 49s number from 1 to 49. View frequency, last drawn date, and historical performance for each number.',
  },
};
