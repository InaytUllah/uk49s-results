import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PAGE_SEO, SITE_URL } from '@/lib/data/seo';
import Script from 'next/script';

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    type: 'website',
    locale: 'en_GB',
    siteName: 'UK49s Results',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense - replace with your publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
