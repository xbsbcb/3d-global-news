/**
 * API 服务 - 与后端通信
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器 - 直接返回 data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// API 类型定义
export interface News {
  id: number
  title: string
  summary: string | null
  content: string | null
  source: string
  source_url: string | null
  category: string
  country: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  published_at: string | null
  fetched_at: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  color: string | null
}

export interface NewsQuery {
  category?: string
  country?: string
  keyword?: string
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
}

export interface Stats {
  total_news: number
  category_counts: Record<string, number>
}

// API 方法 - 返回类型是拦截器处理后的类型
export const newsApi = {
  // 获取新闻列表
  getNews: (query?: NewsQuery): Promise<ApiResponse<PaginatedResponse<News>>> =>
    api.get('/api/news', { params: query }),

  // 获取单条新闻
  getNewsById: (id: number): Promise<ApiResponse<News>> =>
    api.get(`/api/news/${id}`),

  // 创建新闻
  createNews: (news: Partial<News>): Promise<ApiResponse<News>> =>
    api.post('/api/news', news),

  // 获取分类列表
  getCategories: (): Promise<ApiResponse<Category[]>> =>
    api.get('/api/categories'),

  // 获取统计数据
  getStats: (): Promise<ApiResponse<Stats>> =>
    api.get('/api/stats'),

  // 触发新闻采集
  fetchNews: (): Promise<ApiResponse<{ fetched: number }>> =>
    api.post('/api/fetch'),

  // 健康检查
  healthCheck: (): Promise<string> =>
    api.get('/health'),
}

export default api
