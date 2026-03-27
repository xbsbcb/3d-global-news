import { Database, RefreshCw, Clock } from 'lucide-react';
import { useNewsStore } from '@/stores/newsStore';

export default function Footer() {
  const { news } = useNewsStore();
  const lastUpdate = news.length > 0
    ? new Date().toLocaleTimeString()
    : 'Never';

  return (
    <footer className="bg-space-800 border-t border-space-700 px-4 py-2">
      <div className="flex items-center justify-between text-sm text-gray-400">
        {/* Data sources */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            <span>Data: RSSHub + GitHub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" />
            <span>Update: Daily</span>
          </div>
        </div>

        {/* Last update time */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>Last update: {lastUpdate}</span>
        </div>
      </div>
    </footer>
  );
}
