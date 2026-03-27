import SearchBar from '../Search/SearchBar';
import CategoryFilter from '../Filter/CategoryFilter';
import type { Category } from '@/types/news';
import { Globe } from 'lucide-react';

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  return (
    <header className="bg-space-800/95 backdrop-blur-sm border-b border-space-700 px-4 py-3 z-20">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Globe className="w-8 h-8 text-neon-blue" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
            GlobeNews
          </h1>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        {/* Category filter */}
        <div className="shrink-0">
          <CategoryFilter categories={categories} />
        </div>
      </div>
    </header>
  );
}
