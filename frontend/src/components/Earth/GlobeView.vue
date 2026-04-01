<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGlobe } from '@/modules/useGlobe'
import { useNewsStore } from '@/stores/newsStore'
import type { News } from '@/api'

import SearchBar from '@/components/UI/SearchBar.vue'
import CategoryFilter from '@/components/UI/CategoryFilter.vue'
import StatsPanel from '@/components/UI/StatsPanel.vue'
import NewsPopup from '@/components/News/NewsPopup.vue'

const globeContainer = ref<HTMLElement | null>(null)

const newsStore = useNewsStore()

const {
  isReady,
  setNewsData,
  flyTo
} = useGlobe({
  container: globeContainer,
  particleCount: 50000,
  radius: 100
})

// 监听新闻数据变化，更新地球
watch(() => newsStore.newsWithCoordinates, (news) => {
  if (news.length > 0) {
    const newsPoints = news.map(n => ({
      id: String(n.id),
      lat: n.latitude!,
      lng: n.longitude!,
      title: n.title,
      category: n.category,
      value: 0.5
    }))
    setNewsData(newsPoints)
  }
}, { immediate: true })

// 初始化加载数据
onMounted(async () => {
  await newsStore.initialize()
})

function handleNewsClick(news: News) {
  newsStore.selectNews(news)
  if (news.latitude && news.longitude) {
    flyTo(news.latitude, news.longitude, 120)
  }
}

function handleFlyToBeijing() {
  flyTo(39.9, 116.4, 120)
}

function handleFlyToNewYork() {
  flyTo(40.7, -74.0, 120)
}
</script>

<template>
  <div class="globe-view">
    <!-- 3D 地球容器 -->
    <div ref="globeContainer" class="globe-container"></div>

    <!-- 顶部控制栏 -->
    <div class="top-bar">
      <div class="logo">
        <span class="logo-icon">🌍</span>
        <span class="logo-text">GlobeNews</span>
      </div>

      <div class="controls">
        <SearchBar
          v-model="newsStore.searchKeyword"
        />
        <CategoryFilter
          v-model="newsStore.selectedCategory"
          :categories="newsStore.categories"
        />
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="bottom-bar">
      <StatsPanel :stats="newsStore.stats" />

      <div class="actions">
        <button
          class="action-btn"
          @click="newsStore.triggerFetch"
          :disabled="newsStore.isLoading"
        >
          {{ newsStore.isLoading ? '采集中...' : '采集新闻' }}
        </button>
        <button class="action-btn secondary" @click="handleFlyToBeijing">北京</button>
        <button class="action-btn secondary" @click="handleFlyToNewYork">纽约</button>
      </div>
    </div>

    <!-- 新闻列表侧边栏 -->
    <div class="news-sidebar">
      <h3>新闻列表 ({{ newsStore.filteredNews.length }})</h3>
      <div class="news-list">
        <div
          v-for="news in newsStore.filteredNews"
          :key="news.id"
          class="news-item"
          @click="handleNewsClick(news)"
        >
          <span class="news-category" :style="{ background: getCategoryColor(news.category) }">
            {{ news.category }}
          </span>
          <span class="news-title">{{ news.title }}</span>
          <span class="news-source">{{ news.source }}</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="!isReady || newsStore.isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 新闻详情弹窗 -->
    <NewsPopup
      v-if="newsStore.selectedNews"
      :news="newsStore.selectedNews"
      @close="newsStore.selectNews(null)"
    />
  </div>
</template>

<script lang="ts">
// 辅助函数
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    politics: '#ff6b6b',
    finance: '#4ecdc4',
    technology: '#00d4ff',
    society: '#ffe66d',
    sports: '#95e1d3',
    entertainment: '#f38181',
    general: '#a0a0a0',
  }
  return colors[category.toLowerCase()] || colors.general
}
</script>

<style scoped>
.globe-view {
  width: 100%;
  height: 100vh;
  position: relative;
  background: #0a0a0f;
}

.globe-container {
  width: 100%;
  height: 100%;
}

/* 顶部控制栏 */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(to bottom, rgba(10, 10, 15, 0.9), transparent);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* 底部状态栏 */
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(to top, rgba(10, 10, 15, 0.9), transparent);
}

.actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid #00d4ff;
  color: #00d4ff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(0, 212, 255, 0.4);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 新闻列表侧边栏 */
.news-sidebar {
  position: absolute;
  top: 80px;
  right: 24px;
  width: 320px;
  max-height: calc(100vh - 160px);
  background: rgba(26, 26, 46, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.news-sidebar h3 {
  color: #fff;
  font-size: 14px;
  padding: 12px 16px;
  margin: 0;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.news-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.news-item {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
}

.news-item:hover {
  background: rgba(0, 212, 255, 0.1);
}

.news-category {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  color: #0a0a0f;
  font-weight: 600;
  margin-bottom: 6px;
}

.news-title {
  display: block;
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.news-source {
  color: #a0a0a0;
  font-size: 11px;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #00d4ff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 212, 255, 0.3);
  border-top-color: #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
