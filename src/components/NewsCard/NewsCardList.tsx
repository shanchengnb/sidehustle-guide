import type { NewsItem } from '../../types';
import { NewsCard } from './NewsCard';

interface NewsCardListProps {
  items: NewsItem[];
}

export function NewsCardList({ items }: NewsCardListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无数据，请点击刷新按钮获取最新资讯
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
