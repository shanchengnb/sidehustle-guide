import Parser from 'rss-parser';
import type { NewsItem, FetchResult, DataSource } from '../types';

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'llm',
  'gpt', 'chatgpt', 'claude', 'gemini', 'openai', 'anthropic',
  'agent', 'copilot', 'automation', 'chatbot', 'assistant',
  'generative', 'ai-powered', 'ai tool'
];

export class ProductHuntService {
  private parser = new Parser();

  async fetch(): Promise<FetchResult> {
    const items: NewsItem[] = [];

    try {
      const feed = await this.fetchRSS();
      items.push(...this.transformFeed(feed));
    } catch (error) {
      console.error('Product Hunt fetch error:', error);
    }

    return {
      items,
      source: 'producthunt',
      fetchedAt: new Date()
    };
  }

  private async fetchRSS(): Promise<any> {
    const response = await fetch('/api/producthunt');
    const text = await response.text();
    return this.parser.parseString(text);
  }

  private transformFeed(feed: any): NewsItem[] {
    if (!feed?.items) return [];

    return feed.items
      .filter((item: any) => this.matchesKeywords(item.title + ' ' + (item.contentSnippet || '')))
      .map((item: any): NewsItem => ({
        id: `ph-${item.guid || item.link?.split('/').pop() || Date.now()}`,
        title: item.title,
        url: item.link,
        source: 'producthunt' as DataSource,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        summary: this.extractSummary(item.contentSnippet),
        tags: this.extractTags(item.title + ' ' + (item.contentSnippet || '')),
      }))
      .slice(0, 20); // Limit to 20 items
  }

  private matchesKeywords(text: string): boolean {
    const lowerText = text.toLowerCase();
    // Always include if it's from Product Hunt and has AI keywords
    return AI_KEYWORDS.some(kw => lowerText.includes(kw));
  }

  private extractSummary(content: string): string {
    if (!content) return '查看Product Hunt详情';
    // Clean up content
    return content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200);
  }

  private extractTags(text: string): string[] {
    const tags: string[] = [];
    const lowerText = text.toLowerCase();

    if (/gpt|chatgpt/i.test(text)) tags.push('GPT');
    if (/agent/i.test(text)) tags.push('Agent');
    if (/assistant|copilot/i.test(text)) tags.push('Assistant');
    if (/writing|content/i.test(lowerText)) tags.push('写作');
    if (/code|coding|developer/i.test(lowerText)) tags.push('编程');
    if (/image|art|design/i.test(lowerText)) tags.push('设计');
    if (/chat|conversation/i.test(lowerText)) tags.push('对话');
    if (/automat/i.test(lowerText)) tags.push('自动化');

    return tags;
  }
}
