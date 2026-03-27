import { useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useNewsStore } from '@/stores/newsStore';

export default function Timeline() {
  const { dateRange, setDateRange } = useNewsStore();

  const handleDateChange = useCallback(
    (days: number) => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() - days);
      setDateRange({
        start: new Date(newDate.setHours(0, 0, 0, 0)),
        end: new Date(),
      });
    },
    [setDateRange]
  );

  const handleReset = useCallback(() => {
    setDateRange({ start: null, end: null });
  }, [setDateRange]);

  return (
    <div className="bg-space-800/80 backdrop-blur-sm border-t border-space-700 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Date display */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">
            {dateRange.start
              ? `${dateRange.start.toLocaleDateString()} - Today`
              : 'All time'}
          </span>
        </div>

        {/* Quick date buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDateChange(1)}
            className="px-3 py-1.5 text-xs bg-space-700 hover:bg-space-600 text-gray-300 rounded-lg transition-colors"
          >
            24h
          </button>
          <button
            onClick={() => handleDateChange(7)}
            className="px-3 py-1.5 text-xs bg-space-700 hover:bg-space-600 text-gray-300 rounded-lg transition-colors"
          >
            7d
          </button>
          <button
            onClick={() => handleDateChange(30)}
            className="px-3 py-1.5 text-xs bg-space-700 hover:bg-space-600 text-gray-300 rounded-lg transition-colors"
          >
            30d
          </button>
          <button
            onClick={() => handleDateChange(365)}
            className="px-3 py-1.5 text-xs bg-space-700 hover:bg-space-600 text-gray-300 rounded-lg transition-colors"
          >
            1y
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-neon-blue hover:bg-space-700 rounded-lg transition-colors"
          >
            All
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
