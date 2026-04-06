import type { NewsItem } from '../../types';
import { Badge } from '../common/Badge';
import { SOURCE_COLORS } from '../../types';

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN');
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <Badge className={SOURCE_COLORS[item.source]}>
          {item.source === 'hackernews' ? 'HN' :
            item.source === 'producthunt' ? 'PH' :
              item.source === 'futuretools' ? 'FT' :
                item.source.toUpperCase()}
        </Badge>
        <span className="text-xs text-gray-400">
          {formatDate(item.publishedAt)}
        </span>
      </div>

      <h3 className="text-lg font-medium mb-2 leading-snug">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors line-clamp-2"
        >
          {truncateText(item.title, 100)}
        </a>
      </h3>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {truncateText(item.summary, 120)}
      </p>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        {(item.upvotes !== undefined || item.comments !== undefined) && (
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {item.upvotes !== undefined && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zm6-1a1.5 1.5 0 00-3 0v7a1.5 1.5 0 003 0v-7zm6-3a1.5 1.5 0 00-3 0v10a1.5 1.5 0 003 0V6.5zm6-3a1.5 1.5 0 00-3 0v13a1.5 1.5 0 003 0v-13z" />
                </svg>
                {item.upvotes}
              </span>
            )}
            {item.comments !== undefined && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                {item.comments}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
