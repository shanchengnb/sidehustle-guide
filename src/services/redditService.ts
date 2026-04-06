import type { NewsItem, FetchResult, DataSource } from '../types';

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'llm',
  'gpt', 'chatgpt', 'claude', 'gemini', 'openai', 'anthropic',
  'agent', 'copilot', 'automation', 'nlp', 'computer vision',
  'generative', 'deep learning', 'neural', 'transformer',
  'autonomous', 'assistant', 'bot', 'chatbot', 'langchain',
  'embeddings', 'rag', 'prompt', 'fine-tuning', 'model'
];

export class RedditService {
  private subreddits = [
    'MachineLearning',
    'artificial',
    'OpenAI',
    'ChatGPT',
    'LocalLLaMA',
    'ArtificialIntelligence'
  ];

  async fetch(): Promise<FetchResult> {
    const items: NewsItem[] = [];

    await Promise.all(
      this.subreddits.map(async (subreddit) => {
        try {
          const data = await this.fetchSubreddit(subreddit);
          items.push(...this.transformPosts(data, subreddit));
        } catch (error) {
          console.error(`Failed to fetch r/${subreddit}:`, error);
        }
      })
    );

    return {
      items,
      source: 'reddit',
      fetchedAt: new Date()
    };
  }

  private async fetchSubreddit(subreddit: string): Promise<any> {
    const response = await fetch(`/api/reddit/${subreddit}?sort=hot&limit=25`);
    if (!response.ok) throw new Error('Reddit fetch failed');
    return response.json();
  }

  private transformPosts(data: any, _subreddit: string): NewsItem[] {
    if (!data?.data?.children) return [];

    return data.data.children
      .filter((post: any) => this.matchesKeywords(post.data.title))
      .map((post: any): NewsItem => ({
        id: `reddit-${post.data.id}`,
        title: post.data.title,
        url: `https://www.reddit.com${post.data.permalink}`,
        source: 'reddit' as DataSource,
        publishedAt: new Date(post.data.created_utc * 1000),
        summary: post.data.selftext?.slice(0, 200) || '点击查看详情',
        tags: this.extractTags(post.data.title),
        upvotes: post.data.score,
        comments: post.data.num_comments,
        thumbnail: post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default'
          ? post.data.thumbnail
          : undefined
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
    if (/gemini|google/i.test(title)) tags.push('Gemini');
    if (/multimodal|vision/i.test(title)) tags.push('Multimodal');
    if (/open.?source/i.test(title)) tags.push('开源');
    if (/launch|release|announce/i.test(title)) tags.push('新品');

    return tags;
  }
}
