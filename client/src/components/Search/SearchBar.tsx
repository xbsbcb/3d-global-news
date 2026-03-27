import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useNewsStore } from '@/stores/newsStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useNewsStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(localQuery);
    },
    [localQuery, setSearchQuery]
  );

  const handleClear = useCallback(() => {
    setLocalQuery('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search news..."
          className="w-full pl-10 pr-10 py-2 bg-space-900 border border-space-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-0.5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
