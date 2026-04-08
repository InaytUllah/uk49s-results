import { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_SEO, SITE_NAME, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: PAGE_SEO.about.title,
  description: PAGE_SEO.about.description,
  alternates: { canonical: '/about' },
  ...ogMeta(PAGE_SEO.about.title, PAGE_SEO.about.description, '/about'),
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">About Us</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        About {SITE_NAME}
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your trusted source for UK 49s Lunchtime and Teatime results, predictions, and
          statistical analysis.
        </p>

        <h2>Our Mission</h2>
        <p>
          At {SITE_NAME}, our mission is simple: to provide the fastest, most accurate, and most
          comprehensive UK 49s results service available online. We believe every player deserves
          free access to the latest results, detailed statistical analysis, and data-driven
          predictions to enhance their lottery experience.
        </p>

        <h2>What We Offer</h2>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2">
              Fast Results
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get UK 49s Lunchtime and Teatime results as soon as they are drawn. No delays, no
              waiting around.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-2">
              Free Predictions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Daily predictions for both Lunchtime and Teatime draws based on thorough statistical
              analysis of historical data.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">
              Statistical Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              In-depth hot and cold number analysis, frequency charts, and trend data to help you
              make informed choices.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-2">
              Complete History
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Full archive of past UK 49s results for both draws, searchable by date so you can
              research patterns and trends.
            </p>
          </div>
        </div>

        <h2>What Makes Us Different</h2>
        <ul>
          <li>
            <strong>Speed:</strong> Our results are updated rapidly after each draw, so you never
            have to wait.
          </li>
          <li>
            <strong>Completely free:</strong> All our features, including predictions and analysis,
            are available at no cost.
          </li>
          <li>
            <strong>Data-driven predictions:</strong> Our prediction engine analyses historical draw
            data to identify patterns and trends.
          </li>
          <li>
            <strong>Mobile-friendly:</strong> Our website is fully responsive, so you can check
            results on any device, anywhere.
          </li>
          <li>
            <strong>No registration required:</strong> Access all features instantly without creating
            an account.
          </li>
        </ul>

        <h2>Our Team</h2>
        <p>
          Behind {SITE_NAME} is a dedicated team of lottery enthusiasts and data analysts who share
          a passion for numbers and statistical analysis. We combine our expertise in web technology
          and data science to deliver the best possible experience for UK 49s players.
        </p>
        <p>
          Our team works around the clock to ensure results are published promptly, predictions are
          generated accurately, and the website runs smoothly for all our visitors.
        </p>

        <h2>Responsible Gaming</h2>
        <p>
          We are committed to promoting responsible gambling. While we provide results and analysis
          to enhance your lottery experience, we always encourage players to gamble responsibly and
          within their means. Please visit our{' '}
          <Link href="/responsible-gaming">Responsible Gaming</Link> page for support and resources.
        </p>

        <h2>Explore Our Features</h2>
        <div className="not-prose flex flex-wrap gap-3 my-6">
          <Link
            href="/lunchtime"
            className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
          >
            Lunchtime Results
          </Link>
          <Link
            href="/teatime"
            className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
          >
            Teatime Results
          </Link>
          <Link
            href="/predictions"
            className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            Predictions
          </Link>
          <Link
            href="/hot-cold-numbers"
            className="inline-block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Hot &amp; Cold Numbers
          </Link>
          <Link
            href="/number-generator"
            className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            Number Generator
          </Link>
          <Link
            href="/history"
            className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Past Results
          </Link>
        </div>

        <h2>Get in Touch</h2>
        <p>
          Have questions, suggestions, or feedback? We would love to hear from you. Visit our{' '}
          <Link href="/contact">Contact</Link> page to get in touch with the team.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'About Us', url: '/about' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.about.title, PAGE_SEO.about.description, '/about')) }} />
    </div>
  );
}
