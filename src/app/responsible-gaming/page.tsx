import { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_SEO, SITE_NAME } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: PAGE_SEO.responsibleGaming.title,
  description: PAGE_SEO.responsibleGaming.description,
  alternates: { canonical: '/responsible-gaming' },
};

export default function ResponsibleGamingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Responsible Gaming</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Responsible Gaming
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <div className="not-prose bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
          <p className="text-red-800 dark:text-red-300 font-medium text-lg">
            Gambling should be fun, not a source of stress or financial difficulty. If gambling is
            no longer enjoyable, it may be time to seek help.
          </p>
        </div>

        <p>
          At {SITE_NAME}, we are committed to promoting responsible gambling. While we provide
          lottery results, predictions, and analysis, we recognise the importance of ensuring that
          gambling remains a safe and enjoyable activity.
        </p>

        <h2>Tips for Responsible Play</h2>
        <ul>
          <li>
            <strong>Set a budget:</strong> Decide how much you can afford to spend before you start
            playing and never exceed that amount.
          </li>
          <li>
            <strong>Set a time limit:</strong> Do not let gambling take up time meant for work,
            family, or other important activities.
          </li>
          <li>
            <strong>Never chase losses:</strong> If you have lost money, do not try to win it back
            by gambling more. Accept the loss and walk away.
          </li>
          <li>
            <strong>Do not gamble when upset:</strong> Avoid gambling when you are stressed,
            depressed, or under the influence of alcohol or drugs.
          </li>
          <li>
            <strong>Understand the odds:</strong> Lottery draws are random. No prediction system can
            guarantee a win. Our predictions are statistical tools, not certainties.
          </li>
          <li>
            <strong>Take regular breaks:</strong> Step away from gambling regularly to maintain
            perspective.
          </li>
          <li>
            <strong>Balance gambling with other activities:</strong> Ensure gambling is just one of
            many leisure activities in your life.
          </li>
        </ul>

        <h2>Warning Signs of Problem Gambling</h2>
        <p>
          If you or someone you know experiences any of the following, it may indicate a gambling
          problem:
        </p>
        <ul>
          <li>Spending more money on gambling than you can afford to lose</li>
          <li>Borrowing money or selling possessions to fund gambling</li>
          <li>Feeling restless or irritable when trying to stop or reduce gambling</li>
          <li>Gambling to escape problems or relieve negative feelings</li>
          <li>Lying to family or friends about the extent of your gambling</li>
          <li>Neglecting work, studies, or family responsibilities due to gambling</li>
          <li>Chasing losses by gambling more to try to recover money</li>
          <li>Feeling guilty or anxious about your gambling behaviour</li>
          <li>Being unable to stop gambling despite wanting to</li>
        </ul>

        <h2>Self-Exclusion</h2>
        <p>
          Self-exclusion is a voluntary process where you ask a gambling operator to prevent you
          from using their services for a set period. If you feel you need a break from gambling:
        </p>
        <ul>
          <li>
            Contact your betting provider directly to request self-exclusion from their platform.
          </li>
          <li>
            In the UK, you can register with{' '}
            <a href="https://www.gamstop.co.uk" target="_blank" rel="noopener noreferrer">
              GAMSTOP
            </a>{' '}
            to self-exclude from all UK-licensed online gambling sites.
          </li>
          <li>
            In South Africa, contact the{' '}
            <a href="https://www.responsiblegambling.co.za" target="_blank" rel="noopener noreferrer">
              National Responsible Gambling Programme
            </a>{' '}
            for self-exclusion support.
          </li>
        </ul>

        <h2>Get Help</h2>
        <p>
          If you or someone you know is struggling with problem gambling, please reach out to one
          of the following support organisations:
        </p>

        <div className="not-prose grid grid-cols-1 gap-4 my-6">
          {/* GamCare */}
          <div className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">GamCare (UK)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Free information, support, and counselling for problem gamblers in the UK.
                  Available 24/7.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Freephone: <strong>0808 8020 133</strong>
                </p>
              </div>
              <a
                href="https://www.gamcare.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-center whitespace-nowrap"
              >
                Visit GamCare
              </a>
            </div>
          </div>

          {/* BeGambleAware */}
          <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">BeGambleAware (UK)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Free, confidential help and advice for anyone affected by problem gambling.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Helpline: <strong>0808 8020 133</strong>
                </p>
              </div>
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-center whitespace-nowrap"
              >
                Visit BeGambleAware
              </a>
            </div>
          </div>

          {/* NRGP South Africa */}
          <div className="bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  National Responsible Gambling Programme (South Africa)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Counselling and treatment for problem gambling in South Africa. Free and
                  confidential.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Toll-free: <strong>0800 006 008</strong>
                </p>
              </div>
              <a
                href="https://www.responsiblegambling.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-center whitespace-nowrap"
              >
                Visit NRGP
              </a>
            </div>
          </div>
        </div>

        <h2>Remember</h2>
        <ul>
          <li>You must be <strong>18 years or older</strong> to participate in any form of gambling.</li>
          <li>Lottery draws are entirely random. No system or prediction can guarantee a win.</li>
          <li>Only gamble with money you can afford to lose.</li>
          <li>If gambling stops being fun, stop gambling.</li>
        </ul>

        <p>
          For more information about how to play responsibly, visit our{' '}
          <Link href="/how-to-play">How to Play</Link> guide. If you have any concerns, please do
          not hesitate to <Link href="/contact">contact us</Link>.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Responsible Gaming', url: '/responsible-gaming' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.responsibleGaming.title, PAGE_SEO.responsibleGaming.description, '/responsible-gaming')) }} />
    </div>
  );
}
