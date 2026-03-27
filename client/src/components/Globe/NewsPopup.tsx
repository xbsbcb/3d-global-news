import { X, ExternalLink, MapPin, Calendar } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { format } from 'date-fns';

interface NewsPopupProps {
  news: NewsItem;
  onClose: () => void;
}

export default function NewsPopup({ news, onClose }: NewsPopupProps) {
  const publishedDate = news.publishedAt
    ? format(new Date(news.publishedAt), 'yyyy-MM-dd HH:mm')
    : 'Unknown date';

  return (
    <div className="absolute bottom-24 left-4 w-96 bg-space-800/95 backdrop-blur-md rounded-xl border border-space-700 shadow-2xl animate-slide-up z-30 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-space-700">
        <div className="flex-1 min-w-0">
          {news.category && (
            <span
              className="inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2"
              style={{ backgroundColor: `${news.category.color}20`, color: news.category.color }}
            >
              {news.category.name}
            </span>
          )}
          <h3 className="text-lg font-semibold text-white line-clamp-2">{news.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white transition-colors ml-2 shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Summary */}
        {news.summary && (
          <p className="text-sm text-gray-300 line-clamp-3">{news.summary}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          {news.source && (
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-300">{news.source}</span>
            </span>
          )}

          {news.country && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {news.country}
              {news.city && ` - ${news.city}`}
            </span>
          )}

          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {publishedDate}
          </span>
        </div>

        {/* Source link */}
        {news.sourceUrl && (
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-neon-blue hover:text-neon-blue/80 transition-colors"
          >
            Read original article
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
