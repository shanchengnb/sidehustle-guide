import { useState, useEffect, useCallback } from 'react';
import type { NewsItem } from '../types';
import { NewsService, deduplicateByTitle, sortByDate } from '../services';

const CACHE_KEY = 'ai-news-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CachedData {
  items: NewsItem[];
  timestamp: string;
}

export function useNewsData() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const newsService = new NewsService();

  const loadFromCache = useCallback((): boolean => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return false;

      const { items: cachedItems, timestamp } = JSON.parse(cached) as CachedData;
      const cacheAge = Date.now() - new Date(timestamp).getTime();

      // Use cache if it's fresh
      if (cacheAge < CACHE_DURATION) {
        setItems(cachedItems);
        setLastUpdated(new Date(timestamp));
        return true;
      }
    } catch {
      // Invalid cache, ignore
    }
    return false;
  }, []);

  const fetchData = useCallback(async (useCache = true) => {
    setLoading(true);
    setError(null);

    // Try cache first
    if (useCache && loadFromCache()) {
      setLoading(false);
    }

    try {
      const results = await newsService.fetchAllSources();

      // Merge all items
      const allItems = results.flatMap(r => r.items);

      // Deduplicate and sort
      const uniqueItems = deduplicateByTitle(allItems);
      const sortedItems = sortByDate(uniqueItems);

      setItems(sortedItems);
      setLastUpdated(new Date());

      // Cache results
      const cacheData: CachedData = {
        items: sortedItems,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '数据获取失败';
      setError(errorMsg);

      // If we don't have items yet, try to load from cache anyway
      if (items.length === 0) {
        loadFromCache();
      }
    } finally {
      setLoading(false);
    }
  }, [loadFromCache, newsService, items.length]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    loading,
    error,
    refresh: () => fetchData(false),
    lastUpdated
  };
}
