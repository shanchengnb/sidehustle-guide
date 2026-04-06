import { RedditService } from './redditService';
import { HackerNewsService } from './hackerNewsService';
import { ProductHuntService } from './productHuntService';
import { FutureToolsService } from './futureToolsService';
import type { FetchResult, NewsItem } from '../types';

export class NewsService {
  private reddit = new RedditService();
  private hackerNews = new HackerNewsService();
  private productHunt = new ProductHuntService();
  private futureTools = new FutureToolsService();

  async fetchAllSources(): Promise<FetchResult[]> {
    const results = await Promise.all([
      this.reddit.fetch(),
      this.hackerNews.fetch(),
      this.productHunt.fetch(),
      this.futureTools.fetch(),
    ]);

    return results;
  }
}

export function deduplicateByTitle(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const normalizedTitle = item.title.toLowerCase().trim();
    if (seen.has(normalizedTitle)) return false;
    seen.add(normalizedTitle);
    return true;
  });
}

export function sortByDate(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) =>
    b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

export { RedditService, HackerNewsService, ProductHuntService, FutureToolsService };
