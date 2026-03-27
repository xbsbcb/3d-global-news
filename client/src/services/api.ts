/// <reference types="vite/client" />

import axios from 'axios';
import type { NewsApiResponse, CategoriesApiResponse, NewsSearchParams, NewsItem } from '@/types/news';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const newsApi = {
  async getNews(params: NewsSearchParams = {}): Promise<NewsApiResponse> {
    const response = await apiClient.get<NewsApiResponse>('/news', { params });
    return response.data;
  },

  async getNewsById(id: string): Promise<{ success: boolean; data: NewsItem }> {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  },

  async searchNews(params: NewsSearchParams): Promise<NewsApiResponse> {
    const response = await apiClient.get<NewsApiResponse>('/news/search', { params });
    return response.data;
  },

  async getCategories(): Promise<CategoriesApiResponse> {
    const response = await apiClient.get<CategoriesApiResponse>('/categories');
    return response.data;
  },

  async triggerFetch(): Promise<{ success: boolean; data: { message: string; estimatedCount: number } }> {
    const response = await apiClient.post('/news/fetch');
    return response.data;
  },
};

export const healthApi = {
  async check(): Promise<{ success: boolean; data: { status: string } }> {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;
