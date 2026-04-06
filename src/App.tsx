import { useState, useEffect } from 'react';
import SideHustleGuide from './SideHustleGuide';

function App() {
  const [currentPage, setCurrentPage] = useState<'news' | 'sidehustle'>('sidehustle');

  if (currentPage === 'sidehustle') {
    return (
      <div>
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
          <div className="max-w-6xl mx-auto px-4 py-2 flex justify-center gap-4">
            <button
              onClick={() => setCurrentPage('news')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              📰 AI每日资讯
            </button>
            <button
              onClick={() => setCurrentPage('sidehustle')}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg"
            >
              💰 副业致富指南
            </button>
          </div>
        </div>
        <div className="pt-12">
          <SideHustleGuide />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage('news')}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg"
          >
            📰 AI每日资讯
          </button>
          <button
            onClick={() => setCurrentPage('sidehustle')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            💰 副业致富指南
          </button>
        </div>
      </div>
      <div className="pt-12">
        <NewsApp />
      </div>
    </div>
  );
}

interface NewsItem {
  id: string;
  title: string;
  titleZh?: string;
  url: string;
  source: string;
  publishedAt: Date;
  summary: string;
  summaryZh?: string;
  tags: string[];
  upvotes?: number;
  comments?: number;
  analysis?: string;  // AI分析
}

type DataSource = 'reddit' | 'producthunt' | 'hackernews' | 'futuretools';

const SOURCE_LABELS: Record<DataSource, string> = {
  reddit: 'Reddit',
  producthunt: 'Product Hunt',
  hackernews: 'Hacker News',
  futuretools: 'FutureTools',
};

const SOURCE_COLORS: Record<DataSource, string> = {
  reddit: 'bg-orange-100 text-orange-800 border-orange-200',
  producthunt: 'bg-red-100 text-red-800 border-red-200',
  hackernews: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  futuretools: 'bg-blue-100 text-blue-800 border-blue-200',
};

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'llm',
  'gpt', 'chatgpt', 'claude', 'gemini', 'openai', 'anthropic',
  'agent', 'copilot', 'automation', 'nlp', 'generative', 'deepmind',
  'stable diffusion', 'midjourney', 'dalle', 'llama', 'mistral',
  'video', 'image', 'speech', 'text', 'writing', 'coding',
  'assistant', 'bot', 'chatbot', 'neural', 'deep learning'
];

// 默认提示词模板
const DEFAULT_PROMPT = `你是AI产品经理助手。根据以下今日AI产品资讯，进行分析总结。

## 资讯数据
{{DATA}}

## 输出要求
请从产品经理视角分析：
1. **今日重点** - 3-5个核心动态，每个不超过50字
2. **趋势洞察** - 2-3句话分析产品趋势和机会
3. **值得关注** - 列出有潜力的产品及简介`;

// 单个产品分析提示词
const PRODUCT_ANALYSIS_PROMPT = `你是AI产品经理。分析以下产品，输出一段话（50-100字）：

产品名称：{{TITLE}}
产品描述：{{SUMMARY}}

从以下角度分析：
1. 产品定位和核心功能
2. 目标用户和场景
3. 商业化潜力或差异化亮点

要求：简洁专业，突出产品价值。`;

function NewsApp() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedSources, setSelectedSources] = useState<DataSource[]>([]);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('wq-api-key') || 'e6thjxhllw5rn8sikp36nj4xng7xxtbwaj29');

  // 自定义提示词
  const [customPrompt, setCustomPrompt] = useState(() =>
    localStorage.getItem('ai-news-prompt') || DEFAULT_PROMPT
  );
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  // 分析进度
  const [analyzeProgress, setAnalyzeProgress] = useState({ current: 0, total: 0 });

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [redditData, hnData, phData] = await Promise.all([
        fetchReddit(),
        fetchHN(),
        fetchProductHunt()
      ]);

      const allItems = [...redditData, ...hnData, ...phData];
      const sorted = allItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      setItems(sorted);
      setLastUpdated(new Date());
      localStorage.setItem('ai-news-cache', JSON.stringify({
        items: sorted.map(i => ({...i, publishedAt: i.publishedAt.toISOString()})),
        timestamp: new Date().toISOString()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '数据获取失败');

      const cached = localStorage.getItem('ai-news-cache');
      if (cached) {
        const { items: cachedItems } = JSON.parse(cached);
        setItems(cachedItems.map((i: any) => ({...i, publishedAt: new Date(i.publishedAt)})));
      }
    } finally {
      setLoading(false);
    }
  };

  // 翻译成中文
  const translateAll = async () => {
    if (!apiKey.trim()) {
      alert('请先输入万晴平台API Key');
      return;
    }

    setTranslateLoading(true);
    const toTranslate = items.filter(i => !i.titleZh).slice(0, 20);

    if (toTranslate.length === 0) {
      alert('已全部翻译完成');
      setTranslateLoading(false);
      return;
    }

    try {
      const translatedItems: NewsItem[] = [];

      for (let i = 0; i < toTranslate.length; i += 5) {
        const batch = toTranslate.slice(i, i + 5);
        const titlesText = batch.map((item, idx) => `${idx + 1}. ${item.title}`).join('\n');

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: '你是专业翻译，将英文AI产品资讯翻译成简洁的中文。只输出翻译结果，每行一个，格式：序号. 中文标题',
            userInput: `翻译以下AI产品资讯标题，保持技术术语准确：\n\n${titlesText}`,
            apiKey
          })
        });

        const data = await res.json();
        if (data.success) {
          const lines = data.content.split('\n').filter((l: string) => l.trim());
          batch.forEach((item, idx) => {
            const translated = lines[idx]?.replace(/^\d+\.\s*/, '').trim() || item.title;
            translatedItems.push({
              ...item,
              titleZh: translated,
              summaryZh: translated
            });
          });
        }
      }

      setItems(prev => {
        const updated = [...prev];
        translatedItems.forEach(t => {
          const idx = updated.findIndex(i => i.id === t.id);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], titleZh: t.titleZh, summaryZh: t.summaryZh };
          }
        });
        localStorage.setItem('ai-news-cache', JSON.stringify({
          items: updated.map(i => ({...i, publishedAt: i.publishedAt.toISOString()})),
          timestamp: new Date().toISOString()
        }));
        return updated;
      });

    } catch {
      alert('翻译失败，请重试');
    } finally {
      setTranslateLoading(false);
    }
  };

  // 分析所有产品
  const analyzeAllProducts = async () => {
    if (!apiKey.trim()) {
      alert('请先输入万晴平台API Key');
      return;
    }

    const toAnalyze = items.filter(i => !i.analysis);
    if (toAnalyze.length === 0) {
      alert('已全部分析完成');
      return;
    }

    setAnalyzeLoading(true);
    setAnalyzeProgress({ current: 0, total: toAnalyze.length });

    try {
      for (let i = 0; i < toAnalyze.length; i++) {
        const item = toAnalyze[i];
        setAnalyzeProgress({ current: i + 1, total: toAnalyze.length });

        const prompt = PRODUCT_ANALYSIS_PROMPT
          .replace('{{TITLE}}', item.titleZh || item.title)
          .replace('{{SUMMARY}}', item.summaryZh || item.summary);

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: '你是专业的AI产品经理，擅长快速分析产品价值。',
            userInput: prompt,
            apiKey
          })
        });

        const data = await res.json();
        if (data.success) {
          setItems(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(it => it.id === item.id);
            if (idx >= 0) {
              updated[idx] = { ...updated[idx], analysis: data.content };
            }
            localStorage.setItem('ai-news-cache', JSON.stringify({
              items: updated.map(i => ({...i, publishedAt: i.publishedAt.toISOString()})),
              timestamp: new Date().toISOString()
            }));
            return updated;
          });
        }

        // 每个请求间隔100ms避免限流
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch {
      alert('分析失败，请重试');
    } finally {
      setAnalyzeLoading(false);
      setAnalyzeProgress({ current: 0, total: 0 });
    }
  };

  // 分析单个产品
  const analyzeSingleProduct = async (item: NewsItem) => {
    if (!apiKey.trim()) {
      alert('请先输入万晴平台API Key');
      return;
    }

    const prompt = PRODUCT_ANALYSIS_PROMPT
      .replace('{{TITLE}}', item.titleZh || item.title)
      .replace('{{SUMMARY}}', item.summaryZh || item.summary);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: '你是专业的AI产品经理，擅长快速分析产品价值。',
          userInput: prompt,
          apiKey
        })
      });

      const data = await res.json();
      if (data.success) {
        setItems(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(it => it.id === item.id);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], analysis: data.content };
          }
          localStorage.setItem('ai-news-cache', JSON.stringify({
            items: updated.map(i => ({...i, publishedAt: i.publishedAt.toISOString()})),
            timestamp: new Date().toISOString()
          }));
          return updated;
        });
      }
    } catch {
      alert('分析失败');
    }
  };

  const fetchReddit = async (): Promise<NewsItem[]> => {
    const subreddits = ['MachineLearning', 'artificial', 'OpenAI', 'ChatGPT', 'LocalLLaMA'];
    const items: NewsItem[] = [];

    for (const sub of subreddits) {
      try {
        const res = await fetch(`/api/reddit/${sub}?limit=20`);
        const data = await res.json();

        if (data?.data?.children) {
          for (const post of data.data.children) {
            const p = post.data;
            if (AI_KEYWORDS.some(kw => p.title.toLowerCase().includes(kw))) {
              items.push({
                id: `reddit-${p.id}`,
                title: p.title,
                url: `https://www.reddit.com${p.permalink}`,
                source: 'reddit',
                publishedAt: new Date(p.created_utc * 1000),
                summary: p.selftext?.slice(0, 100) || 'Reddit 讨论',
                tags: extractTags(p.title),
                upvotes: p.score,
                comments: p.num_comments
              });
            }
          }
        }
      } catch (e) {
        console.error('Reddit error:', e);
      }
    }
    return items;
  };

  const fetchHN = async (): Promise<NewsItem[]> => {
    try {
      const res = await fetch('/api/hn/search?query=AI%20LLM%20GPT%20agent&hitsPerPage=25');
      const data = await res.json();

      if (data?.hits) {
        return data.hits
          .filter((h: any) => AI_KEYWORDS.some(kw => h.title?.toLowerCase().includes(kw)))
          .map((h: any): NewsItem => ({
            id: `hn-${h.objectID}`,
            title: h.title,
            url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
            source: 'hackernews',
            publishedAt: new Date(h.created_at_i * 1000),
            summary: 'HN 讨论',
            tags: extractTags(h.title),
            upvotes: h.points,
            comments: h.num_comments
          }));
      }
    } catch (e) {
      console.error('HN error:', e);
    }
    return [];
  };

  const fetchProductHunt = async (): Promise<NewsItem[]> => {
    try {
      const res = await fetch('/api/producthunt');
      const text = await res.text();

      const items: NewsItem[] = [];
      const entryMatches = text.matchAll(/<entry>([\s\S]*?)<\/entry>/g);

      for (const match of entryMatches) {
        const entry = match[1];
        const titleMatch = entry.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
        const linkMatch = entry.match(/<link[^>]*href="([^"]+)"[^>]*>/);
        const dateMatch = entry.match(/<published>(.*?)<\/published>/);
        const contentMatch = entry.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/);

        if (titleMatch && linkMatch) {
          const title = titleMatch[1].trim();
          const content = contentMatch ? contentMatch[1] : '';
          const fullText = (title + ' ' + content).toLowerCase();
          const isAIRelated = AI_KEYWORDS.some(kw => fullText.includes(kw.toLowerCase()));

          if (isAIRelated) {
            items.push({
              id: `ph-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              title,
              url: linkMatch[1],
              source: 'producthunt',
              publishedAt: dateMatch ? new Date(dateMatch[1]) : new Date(),
              summary: content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100) || 'Product Hunt 新品',
              tags: extractTags(title + ' ' + content)
            });
          }
        }
        if (items.length >= 25) break;
      }
      return items;
    } catch (e) {
      console.error('PH error:', e);
    }
    return [];
  };

  const extractTags = (title: string): string[] => {
    const tags: string[] = [];
    if (/gpt|chatgpt/i.test(title)) tags.push('GPT');
    if (/agent/i.test(title)) tags.push('Agent');
    if (/llm/i.test(title)) tags.push('LLM');
    if (/openai/i.test(title)) tags.push('OpenAI');
    if (/claude|anthropic/i.test(title)) tags.push('Claude');
    if (/gemini/i.test(title)) tags.push('Gemini');
    if (/image|art|picture/i.test(title)) tags.push('图像');
    if (/video/i.test(title)) tags.push('视频');
    if (/code|developer/i.test(title)) tags.push('编程');
    return tags.slice(0, 3);
  };

  // 生成每日总结
  const generateSummary = async () => {
    if (!apiKey.trim()) {
      alert('请输入万晴平台API Key');
      return;
    }

    setSummaryLoading(true);

    const topItems = items.slice(0, 15);
    const grouped = topItems.reduce((acc, item) => {
      if (!acc[item.source]) acc[item.source] = [];
      acc[item.source].push(item.titleZh || item.title);
      return acc;
    }, {} as Record<string, string[]>);

    const dataStr = Object.entries(grouped)
      .map(([s, titles]) => `### ${SOURCE_LABELS[s as DataSource] || s}\n${titles.slice(0, 5).map(t => `- ${t}`).join('\n')}`)
      .join('\n\n');

    const finalPrompt = customPrompt.replace('{{DATA}}', dataStr);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: '你是一位专业的AI产品经理，擅长从产品视角分析行业动态。',
          userInput: finalPrompt,
          apiKey
        })
      });

      const data = await res.json();
      if (data.success) {
        setSummary(data.content);
      } else {
        alert(data.error || '生成失败');
      }
    } catch {
      alert('请求失败');
    } finally {
      setSummaryLoading(false);
    }
  };

  const resetPrompt = () => {
    setCustomPrompt(DEFAULT_PROMPT);
    localStorage.setItem('ai-news-prompt', DEFAULT_PROMPT);
  };

  const savePrompt = () => {
    localStorage.setItem('ai-news-prompt', customPrompt);
    setShowPromptEditor(false);
  };

  useEffect(() => {
    const cached = localStorage.getItem('ai-news-cache');
    if (cached) {
      const { items: cachedItems, timestamp } = JSON.parse(cached);
      const age = Date.now() - new Date(timestamp).getTime();
      if (age < 30 * 60 * 1000) {
        setItems(cachedItems.map((i: any) => ({...i, publishedAt: new Date(i.publishedAt)})));
        setLastUpdated(new Date(timestamp));
        return;
      }
    }
    fetchData();
  }, []);

  const filteredItems = selectedSources.length > 0
    ? items.filter(i => selectedSources.includes(i.source as DataSource))
    : items;

  const formatDate = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (hours < 168) return `${Math.floor(hours / 24)}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">每日AI产品咨询</h1>
            <p className="text-gray-500 text-sm mt-1">
              {lastUpdated && `最后更新: ${lastUpdated.toLocaleString('zh-CN')}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {loading ? '刷新中...' : '刷新数据'}
            </button>
            {items.length > 0 && (
              <>
                <button
                  onClick={translateAll}
                  disabled={translateLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {translateLoading ? '翻译中...' : '翻译成中文'}
                </button>
                <button
                  onClick={analyzeAllProducts}
                  disabled={analyzeLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                >
                  {analyzeLoading ? `分析中 ${analyzeProgress.current}/${analyzeProgress.total}` : '分析所有产品'}
                </button>
              </>
            )}
          </div>
        </header>

        {/* API Key 配置 */}
        <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">API Key 配置（已默认）</summary>
          <div className="flex gap-2 mt-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); localStorage.setItem('wq-api-key', e.target.value); }}
              placeholder="万晴平台API Key"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </details>

        {/* Source Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">数据来源：</span>
          <button
            onClick={() => setSelectedSources([])}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedSources.length === 0 ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部 ({items.length})
          </button>
          {(['reddit', 'hackernews', 'producthunt'] as DataSource[]).map(source => (
            <button
              key={source}
              onClick={() => setSelectedSources(prev =>
                prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
              )}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedSources.includes(source)
                  ? SOURCE_COLORS[source]
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {SOURCE_LABELS[source]} ({items.filter(i => i.source === source).length})
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && items.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 mt-4">正在获取AI产品资讯...</p>
          </div>
        )}

        {/* Summary Section */}
        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">AI每日总结</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPromptEditor(!showPromptEditor)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {showPromptEditor ? '收起提示词' : '✏️ 编辑提示词'}
                </button>
                <button
                  onClick={generateSummary}
                  disabled={summaryLoading || items.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
                >
                  {summaryLoading ? '生成中...' : '生成总结'}
                </button>
              </div>
            </div>

            {/* Prompt Editor */}
            {showPromptEditor && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">自定义提示词</label>
                  <div className="flex gap-2">
                    <button onClick={resetPrompt} className="text-xs text-blue-600 hover:underline">重置为默认</button>
                    <button onClick={savePrompt} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
                  </div>
                </div>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="输入你的提示词，使用 {{DATA}} 作为数据占位符"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 提示：<code className="bg-gray-200 px-1 rounded">{'{{DATA}}'}</code> 会被替换为实际的资讯数据
                </p>
              </div>
            )}

            {summary && (
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {summary}
                </pre>
              </div>
            )}
            {!summary && !summaryLoading && (
              <p className="text-sm text-gray-500">
                已收集 {items.length} 条资讯（{items.filter(i => i.titleZh).length} 条已翻译，{items.filter(i => i.analysis).length} 条已分析）
              </p>
            )}
          </div>
        )}

        {/* News List */}
        {filteredItems.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map(item => (
                <article key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[item.source as DataSource] || 'bg-gray-100 text-gray-800'}`}>
                      {item.source === 'hackernews' ? 'HN' : item.source === 'producthunt' ? 'PH' : item.source.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
                  </div>

                  <h3 className="text-base font-medium mb-2 flex-1 line-clamp-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      {item.titleZh || item.title}
                    </a>
                  </h3>

                  {/* AI分析 */}
                  {item.analysis ? (
                    <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-800 leading-relaxed">
                        <span className="font-medium">💡 分析：</span>
                        {item.analysis}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => analyzeSingleProduct(item)}
                      className="mb-2 text-xs text-blue-600 hover:text-blue-800 hover:underline text-left"
                    >
                      + 生成AI分析
                    </button>
                  )}

                  {item.titleZh && item.titleZh !== item.title && (
                    <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                      原文：{item.title.length > 50 ? item.title.slice(0, 50) + '...' : item.title}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {(item.upvotes !== undefined || item.comments !== undefined) && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {item.upvotes !== undefined && <span>👍 {item.upvotes}</span>}
                        {item.comments !== undefined && <span>💬 {item.comments}</span>}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
