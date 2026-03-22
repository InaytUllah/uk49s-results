import { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_SEO, SITE_NAME } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.privacyPolicy.title,
  description: PAGE_SEO.privacyPolicy.description,
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated: March 2026
        </p>
        <p>
          At {SITE_NAME}, we are committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, and safeguard information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We do not require user registration, accounts, or any forms to use our website. We do not
          collect any personal information directly from you. Our site is purely informational,
          providing UK 49s lottery results, predictions, and statistical analysis.
        </p>

        <h3>Automatically Collected Information</h3>
        <p>When you visit our website, certain information may be collected automatically through:</p>
        <ul>
          <li>
            <strong>Cookies and similar technologies:</strong> Our website and third-party services
            (such as Google AdSense) may place cookies on your device to improve your experience,
            analyse traffic, and serve relevant advertisements.
          </li>
          <li>
            <strong>Log data:</strong> Our hosting provider (Vercel) may collect standard server log
            information, including your IP address, browser type, pages visited, and the date and
            time of your visit.
          </li>
          <li>
            <strong>Analytics data:</strong> We may use analytics services to understand how visitors
            interact with our site. This data is aggregated and does not personally identify you.
          </li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services that may collect data:</p>
        <ul>
          <li>
            <strong>Google AdSense:</strong> Google may use cookies to serve ads based on your prior
            visits to our website and other websites. You can opt out of personalised advertising by
            visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </li>
          <li>
            <strong>Vercel:</strong> Our website is hosted on Vercel, which may collect standard
            server logs and performance data to ensure the website runs efficiently.
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <p>Any automatically collected information is used solely to:</p>
        <ul>
          <li>Operate and maintain the website</li>
          <li>Improve user experience and site performance</li>
          <li>Analyse website traffic and usage patterns</li>
          <li>Serve relevant advertisements through Google AdSense</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Cookies are small text files stored on your device. You can control cookies through your
          browser settings. Please note that disabling cookies may affect certain features of the
          website and the advertisements displayed.
        </p>
        <p>Types of cookies used on our site:</p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for the website to function properly.</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors use the site.</li>
          <li><strong>Advertising cookies:</strong> Used by Google AdSense to display relevant ads.</li>
        </ul>

        <h2>Your Rights Under GDPR</h2>
        <p>
          If you are located in the European Economic Area (EEA) or the United Kingdom, you have
          certain rights under the General Data Protection Regulation (GDPR), including:
        </p>
        <ul>
          <li>The right to access any data held about you</li>
          <li>The right to request correction of inaccurate data</li>
          <li>The right to request deletion of your data</li>
          <li>The right to restrict processing of your data</li>
          <li>The right to data portability</li>
          <li>The right to object to data processing</li>
        </ul>
        <p>
          Since we do not collect personal data directly, these rights primarily apply to data
          collected by third-party services. You can manage your Google advertising preferences
          directly through Google&apos;s settings.
        </p>

        <h2>Data Security</h2>
        <p>
          We take reasonable measures to protect any information collected through our website.
          However, no method of transmission over the Internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our website is not intended for individuals under the age of 18. We do not knowingly
          collect information from children. If you believe a child has provided information through
          our site, please contact us so we can take appropriate action.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this
          page with an updated revision date. We encourage you to review this policy periodically.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or wish to exercise your data rights,
          please contact us at:
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:info@uk49sresults.co.uk">info@uk49sresults.co.uk</a>
        </p>
        <p>
          We aim to respond to all data-related requests within 30 days.
        </p>
      </div>
    </div>
  );
}
