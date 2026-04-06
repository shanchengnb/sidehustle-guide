import type { NewsItem, FetchResult, DataSource } from '../types';

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'llm',
  'gpt', 'chatgpt', 'claude', 'gemini', 'openai', 'anthropic',
  'agent', 'copilot', 'automation', 'nlp', 'computer vision',
  'generative', 'deep learning', 'neural', 'transformer'
];

export class HackerNewsService {
  async fetch(): Promise<FetchResult> {
    const items: NewsItem[] = [];

    try {
      // Search for AI-related posts
      const data = await this.searchHN('AI machine learning LLM');
      items.push(...this.transformHits(data.hits || []));

      // Also search for specific topics
      const agentData = await this.searchHN('AI agent autonomous');
      items.push(...this.transformHits(agentData.hits || []));
    } catch (error) {
      console.error('HackerNews fetch error:', error);
    }

    // Remove duplicates
    const uniqueItems = this.deduplicateByUrl(items);

    return {
      items: uniqueItems,
      source: 'hackernews',
      fetchedAt: new Date()
    };
  }

  private async searchHN(query: string): Promise<any> {
    const response = await fetch(
      `/api/hn/search?query=${encodeURIComponent(query)}&hitsPerPage=30`
    );
    if (!response.ok) throw new Error('HN fetch failed');
    return response.json();
  }

  private transformHits(hits: any[]): NewsItem[] {
    return hits
      .filter(hit => hit.title && this.matchesKeywords(hit.title))
      .map((hit): NewsItem => ({
        id: `hn-${hit.objectID}`,
        title: hit.title,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        source: 'hackernews' as DataSource,
        publishedAt: new Date(hit.created_at_i * 1000),
        summary: hit._highlightResult?.title?.value || hit.title,
        tags: this.extractTags(hit.title),
        upvotes: hit.points,
        comments: hit.num_comments
      }));
  }

  private matchesKeywords(title: string): boolean {
    const lowerTitle = title.toLowerCase();
    return AI_KEYWORDS.some(kw => lowerTitle.includes(kw));
  }

  private extractTags(title: string): string[] {
    const tags: string[] = [];

    if (/gpt|chatgpt/i.test(title)) tags.push('GPT');
    if (/agent/i.test(title)) tags.push('Agent');
    if (/llm/i.test(title)) tags.push('LLM');
    if (/openai/i.test(title)) tags.push('OpenAI');
    if (/claude|anthropic/i.test(title)) tags.push('Claude');

    return tags;
  }

  private deduplicateByUrl(items: NewsItem[]): NewsItem[] {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }
}
