import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getArticleBySlug, getRelatedArticles } from '@/lib/articles/data';
import type { ArticleSection } from '@/lib/articles/types';
import { SITE_NAME, SITE_URL, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema } from '@/lib/schema';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: `Article not found | ${SITE_NAME}` };

  const fullTitle = `${article.title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description: article.description,
    alternates: { canonical: `${SITE_URL}/articles/${article.slug}` },
    ...ogMeta(article.title, article.description, `/articles/${article.slug}`),
  };
}

export const revalidate = 3600; // 1 hour
export const dynamicParams = false;

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function renderSection(section: ArticleSection, idx: number) {
  switch (section.type) {
    case 'p':
      return (
        <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {section.text}
        </p>
      );
    case 'h2':
      return (
        <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          {section.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
          {section.text}
        </h3>
      );
    case 'ul':
      return (
        <ul key={idx} className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
          {section.items.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={idx} className="list-decimal pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
          {section.items.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ol>
      );
    case 'tldr':
      return (
        <div key={idx} className="my-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 p-5">
          <p className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 mb-3">TL;DR</p>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                <span aria-hidden="true" className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'callout': {
      const styles = {
        tip: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400' },
        warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400' },
        note: { bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700', text: 'text-gray-700 dark:text-gray-300' },
        fact: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-400' },
      };
      const s = styles[section.kind];
      return (
        <div key={idx} className={`my-6 rounded-xl border-2 ${s.border} ${s.bg} p-5`}>
          {section.title && (
            <p className={`text-xs uppercase tracking-wider font-bold ${s.text} mb-2`}>{section.title}</p>
          )}
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{section.text}</p>
        </div>
      );
    }
    case 'quote':
      return (
        <blockquote key={idx} className="my-6 pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-700 dark:text-gray-300">
          <p className="leading-relaxed">&ldquo;{section.text}&rdquo;</p>
          {section.attribution && (
            <footer className="mt-2 text-sm text-gray-500 dark:text-gray-400 not-italic">— {section.attribution}</footer>
          )}
        </blockquote>
      );
    default:
      return null;
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug);

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1 flex-wrap">
          <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li><Link href="/articles" className="hover:text-emerald-600">Articles</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{article.title}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            {article.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {article.readingTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Team</Link></span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.publishedDate}>Published {formatDate(article.publishedDate)}</time>
          {article.updatedDate !== article.publishedDate && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={article.updatedDate}>Updated {formatDate(article.updatedDate)}</time>
            </>
          )}
        </div>
      </header>

      <div>
        {article.sections.map((s, i) => renderSection(s, i))}
      </div>

      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related reading</h2>
          <ul className="space-y-3">
            {related.map(r => (
              <li key={r.slug}>
                <Link
                  href={`/articles/${r.slug}`}
                  className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">{r.category}</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{r.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{r.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: 'Articles', url: '/articles' },
          { name: article.title, url: `/articles/${article.slug}` },
        ])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          datePublished: article.publishedDate,
          dateModified: article.updatedDate,
          author: { '@type': 'Organization', name: 'UK49s Results Team', url: `${SITE_URL}/about` },
          publisher: { '@type': 'Organization', name: 'UK49s Results', url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`,
        }) }}
      />
    </article>
  );
}
