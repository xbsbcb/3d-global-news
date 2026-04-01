/**
 * 新闻 Store - 状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { newsApi, type News } from '@/api'

export const useNewsStore = defineStore('news', () => {
  // 状态
  const news = ref<News[]>([])
  const categories = ref<{ id: number; name: string; slug: string; color: string | null }[]>([])
  const stats = ref<{ total_news: number; category_counts: Record<string, number> } | null>(null)
  const selectedNews = ref<News | null>(null)
  const selectedCategory = ref<string | null>(null)
  const searchKeyword = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const filteredNews = computed(() => {
    let result = news.value

    if (selectedCategory.value) {
      result = result.filter((n) => n.category === selectedCategory.value)
    }

    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      result = result.filter((n) =>
        n.title.toLowerCase().includes(kw) ||
        n.summary?.toLowerCase().includes(kw)
      )
    }

    return result
  })

  const newsWithCoordinates = computed(() => {
    return filteredNews.value.filter((n) => n.latitude && n.longitude)
  })

  // 方法
  async function fetchNews() {
    isLoading.value = true
    error.value = null
    try {
      const res = await newsApi.getNews({ limit: 100 })
      if (res.success && res.data) {
        news.value = res.data.items
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch news'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const res = await newsApi.getCategories()
      if (res.success && res.data) {
        categories.value = res.data
      }
    } catch (e: any) {
      console.error('Failed to fetch categories:', e)
    }
  }

  async function fetchStats() {
    try {
      const res = await newsApi.getStats()
      if (res.success && res.data) {
        stats.value = res.data
      }
    } catch (e: any) {
      console.error('Failed to fetch stats:', e)
    }
  }

  async function triggerFetch() {
    isLoading.value = true
    try {
      const res = await newsApi.fetchNews()
      if (res.success && res.data) {
        console.log(`Fetched ${res.data.fetched} news items`)
        await fetchNews()
        await fetchStats()
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to trigger fetch'
    } finally {
      isLoading.value = false
    }
  }

  function selectNews(newsItem: News | null) {
    selectedNews.value = newsItem
  }

  function setCategory(category: string | null) {
    selectedCategory.value = category
  }

  function setSearch(keyword: string) {
    searchKeyword.value = keyword
  }

  async function initialize() {
    await Promise.all([
      fetchNews(),
      fetchCategories(),
      fetchStats()
    ])
  }

  return {
    // 状态
    news,
    categories,
    stats,
    selectedNews,
    selectedCategory,
    searchKeyword,
    isLoading,
    error,
    // 计算属性
    filteredNews,
    newsWithCoordinates,
    // 方法
    fetchNews,
    fetchCategories,
    fetchStats,
    triggerFetch,
    selectNews,
    setCategory,
    setSearch,
    initialize,
  }
})
