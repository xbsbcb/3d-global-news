import { create } from 'zustand';
import type { NewsItem, Category } from '@/types/news';

interface NewsState {
  // Data
  news: NewsItem[];
  categories: Category[];
  selectedNews: NewsItem | null;

  // Filter state
  selectedCategories: string[];
  searchQuery: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };

  // UI state
  isLoading: boolean;
  error: string | null;
  globeState: {
    zoom: number;
    rotation: { x: number; y: number };
  };

  // Actions
  setNews: (news: NewsItem[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedNews: (news: NewsItem | null) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  setGlobeState: (state: Partial<{ zoom: number; rotation: { x: number; y: number } }>) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetFilters: () => void;
}

export const useNewsStore = create<NewsState>((set) => ({
  // Initial state
  news: [],
  categories: [],
  selectedNews: null,
  selectedCategories: [],
  searchQuery: '',
  dateRange: {
    start: null,
    end: null,
  },
  isLoading: false,
  error: null,
  globeState: {
    zoom: 1,
    rotation: { x: 0, y: 0 },
  },

  // Actions
  setNews: (news) => set({ news }),
  setCategories: (categories) => set({ categories }),
  setSelectedNews: (selectedNews) => set({ selectedNews }),
  setSelectedCategories: (selectedCategories) => set({ selectedCategories }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDateRange: (dateRange) => set({ dateRange }),
  setGlobeState: (state) =>
    set((prev) => ({
      globeState: { ...prev.globeState, ...state },
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetFilters: () =>
    set({
      selectedCategories: [],
      searchQuery: '',
      dateRange: { start: null, end: null },
    }),
}));
