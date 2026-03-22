import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: `UK 49s Number Generator - Random Numbers | ${SITE_NAME}`,
  description: 'Generate random UK 49s numbers for your next bet. Choose how many numbers to pick and whether to include the Booster ball.',
  alternates: { canonical: '/number-generator' },
};

export default function NumberGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
