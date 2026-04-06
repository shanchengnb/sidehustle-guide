import * as cheerio from 'cheerio';
import type { NewsItem, FetchResult, DataSource } from '../types';

export class FutureToolsService {
  async fetch(): Promise<FetchResult> {
    const items: NewsItem[] = [];

    try {
      const html = await this.fetchPage();
      items.push(...this.parsePage(html));
    } catch (error) {
      console.error('FutureTools fetch error:', error);
    }

    return {
      items,
      source: 'futuretools',
      fetchedAt: new Date()
    };
  }

  private async fetchPage(): Promise<string> {
    const response = await fetch('/api/futuretools');
    if (!response.ok) throw new Error('FutureTools fetch failed');
    return response.text();
  }

  private parsePage(html: string): NewsItem[] {
    const $ = cheerio.load(html);
    const items: NewsItem[] = [];

    // FutureTools结构可能变化，这里做简单的解析
    $('a[href*="/tools/"]').each((index, element) => {
      const $el = $(element);
      const href = $el.attr('href');
      const title = $el.find('h3, h2, .tool-name, [class*="name"]').first().text().trim()
        || $el.text().trim();

      if (title && href) {
        items.push({
          id: `ft-${index}`,
          title,
          url: href.startsWith('http') ? href : `https://www.futuretools.io${href}`,
          source: 'futuretools' as DataSource,
          publishedAt: new Date(),
          summary: '来自FutureTools的AI工具',
          tags: this.extractTags(title),
        });
      }
    });

    // Fallback: try another selector
    if (items.length === 0) {
      $('.tool-card, [class*="ToolCard"], .grid a').each((index, element) => {
        const $el = $(element);
        const title = $el.find('h3, h2, h4').first().text().trim() || $el.attr('title') || '';
        const href = $el.attr('href') || '';

        if (title && href && this.isAIRelated(title)) {
          items.push({
            id: `ft-${index}`,
            title,
            url: href.startsWith('http') ? href : `https://www.futuretools.io${href}`,
            source: 'futuretools' as DataSource,
            publishedAt: new Date(),
            summary: '来自FutureTools的AI工具',
            tags: this.extractTags(title),
          });
        }
      });
    }

    return items.slice(0, 15);
  }

  private isAIRelated(title: string): boolean {
    const aiKeywords = ['ai', 'gpt', 'chat', 'assistant', 'ai-', 'artificial'];
    const lowerTitle = title.toLowerCase();
    return aiKeywords.some(kw => lowerTitle.includes(kw));
  }

  private extractTags(title: string): string[] {
    const tags: string[] = [];
    const lowerTitle = title.toLowerCase();

    if (/gpt|chatgpt/i.test(title)) tags.push('GPT');
    if (/image|art|picture/i.test(lowerTitle)) tags.push('图像');
    if (/video/i.test(lowerTitle)) tags.push('视频');
    if (/writing|content/i.test(lowerTitle)) tags.push('写作');
    if (/code|developer/i.test(lowerTitle)) tags.push('编程');
    if (/audio|voice|speech/i.test(lowerTitle)) tags.push('音频');

    return tags;
  }
}
