import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';

const app = express();

// 启用CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Reddit代理
app.get('/api/reddit/:subreddit', async (req: Request, res: Response) => {
  const { subreddit } = req.params;
  const sort = req.query.sort || 'hot';
  const limit = req.query.limit || '25';

  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`,
      {
        headers: {
          'User-Agent': 'AI-Daily-News/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Reddit proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch Reddit data' });
  }
});

// HackerNews代理 (Algolia API)
app.get('/api/hn/search', async (req: Request, res: Response) => {
  const query = req.query.query || 'AI';
  const hitsPerPage = req.query.hitsPerPage || '30';

  try {
    const response = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query as string)}&tags=story&hitsPerPage=${hitsPerPage}`,
      {
        headers: {
          'User-Agent': 'AI-Daily-News/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HackerNews API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('HackerNews proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch HackerNews data' });
  }
});

// Product Hunt RSS代理
app.get('/api/producthunt', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://www.producthunt.com/feed', {
      headers: {
        'User-Agent': 'AI-Daily-News/1.0',
        'Accept': 'application/rss+xml'
      }
    });

    if (!response.ok) {
      throw new Error(`Product Hunt RSS error: ${response.status}`);
    }

    const text = await response.text();
    res.type('application/xml').send(text);
  } catch (error) {
    console.error('Product Hunt proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch Product Hunt feed' });
  }
});

// FutureTools爬虫
app.get('/api/futuretools', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://www.futuretools.io/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`FutureTools error: ${response.status}`);
    }

    const html = await response.text();
    res.type('text/html').send(html);
  } catch (error) {
    console.error('FutureTools proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch FutureTools data' });
  }
});

// AI Summary代理
app.post('/api/summary', async (req: Request, res: Response) => {
  const { prompt, apiKey, provider = 'siliconflow' } = req.body;

  if (!apiKey) {
    res.status(400).json({ error: 'API key required' });
    return;
  }

  const endpoints: Record<string, string> = {
    siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
    openai: 'https://api.openai.com/v1/chat/completions',
  };

  try {
    const response = await fetch(endpoints[provider], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: provider === 'siliconflow' ? 'Qwen/Qwen2.5-7B-Instruct' : 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AI Summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
