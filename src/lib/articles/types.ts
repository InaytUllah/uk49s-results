export type ArticleSection =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id?: string }
  | { type: 'h3'; text: string; id?: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; kind: 'tip' | 'warning' | 'note' | 'fact'; title?: string; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'tldr'; items: string[] };

export type ArticleCategory = 'Guide' | 'Statistics' | 'Strategy' | 'Culture' | 'Safety';

export interface Article {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedDate: string;
  updatedDate: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
  sections: ArticleSection[];
  // Related article slugs (manual curation)
  related?: string[];
}
