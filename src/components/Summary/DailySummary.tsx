import { useState, useCallback } from 'react';
import type { NewsItem } from '../../types';
import { SOURCE_LABELS } from '../../types';

interface DailySummaryProps {
  items: NewsItem[];
}

export function DailySummary({ items }: DailySummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('wq-api-key') || '';
  });

  const generateSummary = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('请先输入万晴平台API Key');
      return;
    }

    setLoading(true);
    setError('');

    // Group items by source
    const grouped = items.slice(0, 20).reduce((acc, item) => {
      const source = item.source;
      if (!acc[source]) acc[source] = [];
      acc[source].push(item);
      return acc;
    }, {} as Record<string, NewsItem[]>);

    // Build system prompt
    const systemPrompt = `你是AI产品经理的智能助手，负责从产品视角总结每日AI行业动态。
输出要求：
1. 语言简洁专业，突出产品价值和应用场景
2. 关注商业化潜力、用户价值、市场机会
3. 输出格式清晰，使用Markdown`;

    // Build user input
    const userInput = `请总结今日AI产品领域的重要动态。

数据来源：
${Object.entries(grouped).map(([source, sourceItems]) =>
  `## ${SOURCE_LABELS[source as keyof typeof SOURCE_LABELS]}
${sourceItems.slice(0, 5).map(i => `- ${i.title}`).join('\n')}`
).join('\n\n')}

请输出：
1. 今日重点（3-5个要点，每个不超过50字）
2. 趋势洞察（2-3句话产品视角分析）
3. 值得关注的产品（如有新产品，列出名称和简介）`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userInput,
          apiKey
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '生成总结失败');
      }

      setSummary(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成总结失败');
    } finally {
      setLoading(false);
    }
  }, [apiKey, items]);

  const saveApiKey = () => {
    localStorage.setItem('wq-api-key', apiKey);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI每日总结</h2>
        <button
          onClick={generateSummary}
          disabled={loading || items.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {loading ? '生成中...' : '生成总结'}
        </button>
      </div>

      {/* API Key Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onBlur={saveApiKey}
          placeholder="输入万晴平台API Key"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <a
          href="https://wanqing-api.corp.kuaishou.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline self-center whitespace-nowrap"
        >
          获取API Key
        </a>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Summary Content */}
      {summary && (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {summary}
          </pre>
        </div>
      )}

      {/* Source Stats */}
      {!summary && !loading && (
        <div className="text-sm text-gray-500">
          当前已收集 {items.length} 条资讯，点击"生成总结"获取AI视角的每日分析
        </div>
      )}
    </div>
  );
}
