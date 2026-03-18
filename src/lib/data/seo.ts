export const SITE_NAME = 'UK49s Results';
export const SITE_URL = 'https://uk49sresults.com'; // placeholder - will be updated
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
};
