export interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  source: string | null;
  sourceUrl: string | null;
  category: Category | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  publishedAt: string | null;
  language: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface NewsApiResponse {
  success: boolean;
  data: {
    items: NewsItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CategoriesApiResponse {
  success: boolean;
  data: Category[];
}

export interface NewsSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  q?: string;
}

export interface FetchParams {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  startDate?: string;
  endDate?: string;
}
