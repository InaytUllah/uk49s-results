import { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_SEO, SITE_NAME } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: PAGE_SEO.disclaimer.title,
  description: PAGE_SEO.disclaimer.description,
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Disclaimer</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Disclaimer
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <div className="not-prose bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
          <p className="text-amber-800 dark:text-amber-300 font-medium">
            Please read this disclaimer carefully before using {SITE_NAME}. By accessing or using
            our website, you acknowledge and accept this disclaimer in full.
          </p>
        </div>

        <h2>No Affiliation</h2>
        <p>
          {SITE_NAME} is an <strong>independent, informational website</strong>. We are not
          affiliated with, endorsed by, or connected to UK 49s, Gidani (Pty) Ltd, any national
          lottery organisation, or any betting or gambling operator. All trademarks and brand names
          mentioned on this site belong to their respective owners.
        </p>

        <h2>Results Accuracy</h2>
        <p>
          While we make every effort to ensure the accuracy and timeliness of UK 49s lottery
          results displayed on our website, we cannot guarantee that all information is error-free
          at all times. Results are sourced from publicly available data and may occasionally
          contain inaccuracies or delays.
        </p>
        <p>
          <strong>Users should always verify results through official lottery channels or their
          betting provider before making any decisions or claiming prizes.</strong> {SITE_NAME}
          {' '}accepts no liability for any errors or omissions in the results displayed.
        </p>

        <h2>Predictions &amp; Statistical Analysis</h2>
        <p>
          All predictions, number suggestions, hot and cold number analysis, and other statistical
          content provided on this website are based solely on mathematical analysis of historical
          draw data. They are provided for <strong>informational and entertainment purposes
          only</strong>.
        </p>
        <p>
          UK 49s lottery draws are random events. Each draw is independent of all previous draws.
          Past results have no bearing on future outcomes. We make <strong>no guarantee
          whatsoever</strong> that any prediction, suggestion, or analysis will result in a winning
          outcome.
        </p>

        <h2>No Guarantee of Winnings</h2>
        <p>
          We expressly disclaim any warranty or guarantee, whether express or implied, that the use
          of our website, predictions, analysis, or any other content will result in financial gain
          or lottery winnings of any kind. Gambling involves risk, and users may lose money.
        </p>

        <h2>User Responsibility</h2>
        <p>
          By using this website, you acknowledge and agree that:
        </p>
        <ul>
          <li>
            You are solely responsible for your own betting and gambling decisions.
          </li>
          <li>
            Any use of information from this website for gambling purposes is at your own risk.
          </li>
          <li>
            {SITE_NAME} is not liable for any financial losses resulting from gambling activities,
            whether or not based on information from our site.
          </li>
          <li>
            You will verify all results through official channels before acting on them.
          </li>
          <li>
            You will gamble responsibly and within your financial means.
          </li>
        </ul>

        <h2>Age Restriction</h2>
        <p>
          This website is intended for individuals aged <strong>18 years and older</strong> only.
          If you are under 18, you must leave this website immediately. Gambling by individuals
          under the legal age is illegal and strictly prohibited.
        </p>

        <h2>Third-Party Content &amp; Links</h2>
        <p>
          Our website may contain links to third-party websites. These links are provided for
          convenience and informational purposes only. {SITE_NAME} does not endorse, control, or
          accept responsibility for the content, privacy policies, or practices of any third-party
          websites.
        </p>

        <h2>Website Availability</h2>
        <p>
          We do not guarantee that the website will be available at all times or that it will be
          free from errors, viruses, or interruptions. We reserve the right to modify, suspend, or
          discontinue any part of the website at any time without notice.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, {SITE_NAME}, its owners, operators,
          and contributors shall not be liable for any direct, indirect, incidental, consequential,
          or punitive damages arising from:
        </p>
        <ul>
          <li>Your use of or inability to use this website</li>
          <li>Any errors, inaccuracies, or omissions in the content</li>
          <li>Financial losses from gambling or betting activities</li>
          <li>Reliance on any information provided on this website</li>
          <li>Any third-party content, links, or services</li>
        </ul>

        <h2>Governing Law</h2>
        <p>
          This disclaimer is governed by and construed in accordance with the laws of England and
          Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of
          England and Wales.
        </p>

        <h2>Changes to This Disclaimer</h2>
        <p>
          We reserve the right to update or modify this disclaimer at any time. Changes are
          effective immediately upon posting. Your continued use of the website constitutes
          acceptance of any changes.
        </p>

        <h2>Related Pages</h2>
        <p>
          For more information, please review our other legal and informational pages:
        </p>
        <ul>
          <li><Link href="/terms">Terms &amp; Conditions</Link></li>
          <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          <li><Link href="/responsible-gaming">Responsible Gaming</Link></li>
          <li><Link href="/contact">Contact Us</Link></li>
        </ul>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Disclaimer', url: '/disclaimer' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.disclaimer.title, PAGE_SEO.disclaimer.description, '/disclaimer')) }} />
    </div>
  );
}
