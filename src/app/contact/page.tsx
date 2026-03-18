import { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_SEO, SITE_NAME } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.contact.title,
  description: PAGE_SEO.contact.description,
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Contact Us</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Contact Us
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Have a question, suggestion, or need help? We are here for you. Get in touch with the
          {' '}{SITE_NAME} team using the details below.
        </p>

        {/* Contact Card */}
        <div className="not-prose bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-8 my-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The best way to reach us is by email. Whether you have a question about our results,
            predictions, or anything else, send us a message and we will get back to you.
          </p>
          <a
            href="mailto:info@uk49sresults.co.uk"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            info@uk49sresults.co.uk
          </a>
        </div>

        <h2>Response Times</h2>
        <p>
          We aim to respond to all enquiries within <strong>24 to 48 hours</strong> during
          weekdays. Please note that response times may be longer during weekends and public
          holidays.
        </p>
        <p>
          For urgent matters, please include &quot;URGENT&quot; in your email subject line and we
          will prioritise your message.
        </p>

        <h2>What Can We Help With?</h2>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">General Enquiries</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Questions about our website, results, predictions, or any of our features.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Report an Issue</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Found an incorrect result, a broken page, or a technical issue? Let us know so we
              can fix it promptly.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Feedback &amp; Suggestions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Have ideas for improving our site? We welcome all feedback and suggestions from our
              users.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Data &amp; Privacy Requests</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              For any GDPR or data-related enquiries, please refer to our{' '}
              <Link href="/privacy-policy" className="text-amber-600 dark:text-amber-400 hover:underline">
                Privacy Policy
              </Link>{' '}
              or email us directly.
            </p>
          </div>
        </div>

        <h2>Frequently Asked Questions</h2>
        <p>
          Before reaching out, you may find the answer to your question on our{' '}
          <Link href="/how-to-play">How to Play</Link> page which covers common questions about
          UK 49s rules, odds, and betting options.
        </p>

        <h2>Report Incorrect Results</h2>
        <p>
          Accuracy is our top priority. If you notice any incorrect results on our website, please
          email us immediately with the following details:
        </p>
        <ul>
          <li>The draw type (Lunchtime or Teatime)</li>
          <li>The date of the draw</li>
          <li>The numbers you believe are incorrect</li>
          <li>The correct numbers (if known) and your source</li>
        </ul>
        <p>
          We will investigate and update the results as quickly as possible.
        </p>

        <h2>Important Notes</h2>
        <p>
          Please note that {SITE_NAME} is an independent informational website. We are not
          affiliated with UK 49s, any lottery operator, or any betting company. We cannot assist
          with:
        </p>
        <ul>
          <li>Placing bets or wagers</li>
          <li>Claiming prizes or winnings</li>
          <li>Account issues with betting operators</li>
          <li>Official lottery complaints</li>
        </ul>
        <p>
          For these matters, please contact your betting provider directly.
        </p>
      </div>
    </div>
  );
}
