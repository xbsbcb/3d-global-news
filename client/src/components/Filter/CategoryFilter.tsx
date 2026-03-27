import { useCallback } from 'react';
import { X } from 'lucide-react';
import { useNewsStore } from '@/stores/newsStore';
import type { Category } from '@/types/news';
import clsx from 'clsx';

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const { selectedCategories, setSelectedCategories } = useNewsStore();

  const handleToggle = useCallback(
    (slug: string) => {
      if (selectedCategories.includes(slug)) {
        setSelectedCategories(selectedCategories.filter((s) => s !== slug));
      } else {
        setSelectedCategories([...selectedCategories, slug]);
      }
    },
    [selectedCategories, setSelectedCategories]
  );

  const handleClearAll = useCallback(() => {
    setSelectedCategories([]);
  }, [setSelectedCategories]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleToggle(category.slug)}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
              selectedCategories.includes(category.slug)
                ? 'text-white'
                : 'bg-space-700 text-gray-300 hover:bg-space-600'
            )}
            style={{
              backgroundColor: selectedCategories.includes(category.slug)
                ? category.color
                : undefined,
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <button
          onClick={handleClearAll}
          className="p-1.5 text-gray-400 hover:text-white transition-colors"
          title="Clear all filters"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
