import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '@/services/api';
import { useNewsStore } from '@/stores/newsStore';
import type { NewsSearchParams } from '@/types/news';

export function useNews(params: NewsSearchParams = {}) {
  const { selectedCategories, searchQuery, dateRange } = useNewsStore();

  const queryParams: NewsSearchParams = {
    ...params,
    category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    q: searchQuery || undefined,
    startDate: dateRange.start?.toISOString(),
    endDate: dateRange.end?.toISOString(),
  };

  return useQuery({
    queryKey: ['news', queryParams],
    queryFn: () => newsApi.getNews(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => newsApi.getCategories(),
    staleTime: Infinity, // Categories rarely change
  });
}

export function useSearchNews(page = 1) {
  const { searchQuery, selectedCategories, dateRange } = useNewsStore();

  return useQuery({
    queryKey: ['news', 'search', searchQuery, selectedCategories, dateRange, page],
    queryFn: () =>
      newsApi.searchNews({
        q: searchQuery,
        category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        startDate: dateRange.start?.toISOString(),
        endDate: dateRange.end?.toISOString(),
        page,
      }),
    enabled: !!searchQuery,
  });
}

export function useFetchNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => newsApi.triggerFetch(),
    onSuccess: () => {
      // Refetch news after triggering fetch
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}
