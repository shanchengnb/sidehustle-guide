export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: DataSource;
  publishedAt: Date;
  summary: string;
  tags: string[];
  upvotes?: number;
  comments?: number;
  thumbnail?: string;
}

export type DataSource =
  | 'reddit'
  | 'producthunt'
  | 'hackernews'
  | 'futuretools';

export interface FetchResult {
  items: NewsItem[];
  source: DataSource;
  fetchedAt: Date;
  error?: string;
}

export interface FilterOptions {
  sources: DataSource[];
  keywords: string[];
}

export const SOURCE_LABELS: Record<DataSource, string> = {
  reddit: 'Reddit',
  producthunt: 'Product Hunt',
  hackernews: 'Hacker News',
  futuretools: 'FutureTools',
};

export const SOURCE_COLORS: Record<DataSource, string> = {
  reddit: 'bg-orange-100 text-orange-800 border-orange-200',
  producthunt: 'bg-red-100 text-red-800 border-red-200',
  hackernews: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  futuretools: 'bg-blue-100 text-blue-800 border-blue-200',
};
