export interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  source: string | null;
  sourceUrl: string | null;
  categoryId: string | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  publishedAt: Date | null;
  fetchedAt: Date;
  isTranslated: boolean;
  language: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface RSSSource {
  name: string;
  url: string;
  category: string;
  language: string;
  country: string;
  city?: string;
}

export interface ParsedNews {
  title: string;
  summary: string | null;
  content: string | null;
  source: string;
  sourceUrl: string;
  publishedAt: Date | null;
  country: string;
  city?: string;
  language: string;
  categorySlug: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
