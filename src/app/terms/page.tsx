import { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_SEO, SITE_NAME } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: PAGE_SEO.terms.title,
  description: PAGE_SEO.terms.description,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Terms &amp; Conditions</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Terms &amp; Conditions
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated: March 2026
        </p>
        <p>
          Please read these Terms &amp; Conditions carefully before using the {SITE_NAME} website.
          By accessing or using our website, you agree to be bound by these terms.
        </p>

        <h2>1. Nature of Service</h2>
        <p>
          {SITE_NAME} is an informational website that provides UK 49s lottery results, statistical
          analysis, number predictions, and related content. We are <strong>not</strong> a betting
          operator, gambling company, or lottery provider. We do not accept bets, process
          transactions, or facilitate any form of gambling.
        </p>
        <p>
          Our website is intended purely as a reference and information resource for individuals
          interested in UK 49s lottery results and analysis.
        </p>

        <h2>2. Results Accuracy</h2>
        <p>
          While we strive to provide accurate and up-to-date UK 49s results, we cannot guarantee
          the absolute accuracy of all information displayed on our website. Results are sourced
          from publicly available data and are provided on an &quot;as is&quot; basis.
        </p>
        <p>
          Users should always verify results through official lottery channels before making any
          decisions based on information from our site.
        </p>

        <h2>3. Predictions Disclaimer</h2>
        <p>
          All predictions and number suggestions provided on this website are based on statistical
          analysis of historical draw data. These predictions are for entertainment and informational
          purposes only. We make <strong>no guarantee</strong> that any prediction will result in a
          winning outcome.
        </p>
        <p>
          Lottery draws are random events. Past results do not influence future draws. Any decisions
          made based on our predictions are entirely at your own risk.
        </p>

        <h2>4. Age Restriction</h2>
        <p>
          You must be at least <strong>18 years of age</strong> to use this website. By accessing
          our site, you confirm that you meet this age requirement. We encourage responsible
          gambling practices and provide resources for those who may need help. Please visit our{' '}
          <Link href="/responsible-gaming">Responsible Gaming</Link> page for more information.
        </p>

        <h2>5. User Responsibilities</h2>
        <p>By using this website, you agree to:</p>
        <ul>
          <li>Use the site for lawful purposes only</li>
          <li>Not attempt to disrupt or compromise the website&apos;s security or functionality</li>
          <li>Not reproduce, duplicate, or exploit any part of the website for commercial purposes without our express written consent</li>
          <li>Verify all lottery results through official channels before acting on them</li>
          <li>Take full responsibility for any betting or gambling decisions you make</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>
          The content, design, layout, and graphics on this website are the intellectual property
          of {SITE_NAME} and are protected by applicable copyright and trademark laws. You may not
          reproduce, distribute, modify, or republish any content from this site without prior
          written permission.
        </p>
        <p>
          UK 49s lottery results data is publicly available information. Our proprietary analysis,
          predictions algorithms, and unique content remain our intellectual property.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE_NAME} shall not be held liable for any
          direct, indirect, incidental, consequential, or special damages arising from your use
          of this website, including but not limited to:
        </p>
        <ul>
          <li>Financial losses from gambling or betting decisions</li>
          <li>Inaccuracies in displayed results or predictions</li>
          <li>Website downtime or service interruptions</li>
          <li>Any actions taken based on information provided on this site</li>
        </ul>

        <h2>8. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We have no control over the
          content, privacy policies, or practices of these external sites and accept no
          responsibility for them. Use of third-party links is at your own risk.
        </p>

        <h2>9. Modifications</h2>
        <p>
          We reserve the right to modify these Terms &amp; Conditions at any time without prior
          notice. Changes will be effective immediately upon posting on this page. Your continued
          use of the website constitutes acceptance of any modifications.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms &amp; Conditions are governed by and construed in accordance with the laws
          of England and Wales. Any disputes arising from the use of this website shall be subject
          to the exclusive jurisdiction of the English courts.
        </p>

        <h2>Contact</h2>
        <p>
          If you have any questions about these Terms &amp; Conditions, please{' '}
          <Link href="/contact">contact us</Link>.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Terms & Conditions', url: '/terms' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.terms.title, PAGE_SEO.terms.description, '/terms')) }} />
    </div>
  );
}
