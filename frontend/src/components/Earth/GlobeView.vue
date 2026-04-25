<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobe } from '@/modules/useGlobe'
import { nameToCode } from '@/countries'

const globeContainer = ref<HTMLElement | null>(null)
const selectedCountry = ref<string | null>(null)
const countryNews = ref<any[]>([])
const isLoading = ref(false)
const showPanel = ref(false)

const totalNews = ref(0)

function handleRightClick() {
  showPanel.value = false
  selectedCountry.value = null
}

useGlobe({
  container: globeContainer,
  particleCount: 50000,
  radius: 100,
  onCountryClick: handleCountryClick,
  onRightClick: handleRightClick
})

async function handleCountryClick(countryName: string) {
  selectedCountry.value = countryName
  showPanel.value = true
  await triggerFetchAndLoad(countryName)
}

async function triggerFetchAndLoad(country: string) {
  isLoading.value = true
  try {
    const countryCode = nameToCode(country)

    // 请求后端（后端负责12h过期检测和数据抓取）
    const result = await triggerApiFetch(countryCode)
    console.log('triggerApiFetch result:', result)

    if (!result.ok) {
      // 获取失败：清空数据，不显示旧数据
      countryNews.value = []
      return
    }

    // 读取数据库中最新数据并展示
    await fetchCountryNews(countryCode)
  } finally {
    isLoading.value = false
  }
}

async function triggerApiFetch(countryCode: string): Promise<{ ok: boolean; fetched: number; already_fetched: boolean }> {
  try {
    const fetchRes = await fetch('/api/fetch-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryCode, language: 'en' })
    })
    if (!fetchRes.ok) {
      console.error('获取新闻失败，HTTP状态码:', fetchRes.status)
      return { ok: false, fetched: 0, already_fetched: false }
    }
    const fetchJson = await fetchRes.json()
    console.log('fetch-news response:', JSON.stringify(fetchJson))
    if (!fetchJson.success) {
      console.warn('fetch-news failed:', fetchJson.message)
      return { ok: false, fetched: 0, already_fetched: false }
    }
    const data = fetchJson.data ?? {}
    return {
      ok: true,
      fetched: data.fetched ?? 0,
      already_fetched: data.already_fetched ?? false
    }
  } catch (e) {
    console.error('触发获取新闻失败:', e)
    return { ok: false, fetched: 0, already_fetched: false }
  }
}

async function fetchCountryNews(country: string) {
  try {
    const res = await fetch(`/api/news?country=${encodeURIComponent(country)}&limit=1`)
    const json = await res.json()
    if (json.success && json.data.items) {
      countryNews.value = json.data.items
    }
  } catch (e) {
    console.error('获取新闻失败:', e)
    countryNews.value = []
  }
}

async function fetchStats() {
  try {
    const res = await fetch('/api/stats')
    const json = await res.json()
    if (json.success && json.data) {
      totalNews.value = json.data.total_news || 0
    }
  } catch (e) {
    console.error('获取统计失败:', e)
  }
}

function closePanel() {
  showPanel.value = false
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="globe-view">
    <div ref="globeContainer" class="globe-container"></div>

    <!-- 底部统计栏 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">新闻总数</span>
        <span class="stat-value">{{ totalNews }}</span>
      </div>
    </div>

    <!-- 底部面板：紧凑横条 -->
    <div class="news-bottom-panel" :class="{ open: showPanel }">
      <div class="panel-header">
        <div class="panel-title">
          <span class="country-flag">📍</span>
          <h3>{{ selectedCountry }}</h3>
          <span class="news-count" v-if="countryNews.length">{{ countryNews.length }} 条</span>
        </div>
        <button class="close-btn" @click="closePanel">×</button>
      </div>

      <div class="panel-content">
        <div v-if="isLoading" class="loading-row">
          <span class="loading-dot"></span>
          <span class="loading-text">加载中...</span>
        </div>
        <div v-else-if="countryNews.length === 0" class="loading-row">
          <span class="loading-text">暂无新闻</span>
        </div>
        <div v-else class="news-ticker">
          <a
            v-for="news in countryNews"
            :key="news.id"
            :href="news.source_url"
            target="_blank"
            class="news-item"
          >
            <span class="news-source">{{ news.source }}</span>
            <span class="news-title">{{ news.title }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.globe-view {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #0a0a0f;
  overflow: hidden;
}

.globe-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 底部统计栏 */
.stats-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 24px;
  padding: 10px 20px;
  background: linear-gradient(to top, rgba(10, 10, 15, 0.9) 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.stat-value {
  color: #00d4ff;
  font-size: 13px;
  font-weight: 600;
}

/* 底部面板 */
.news-bottom-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(12, 12, 22, 0.95);
  border-top: 1px solid rgba(0, 212, 255, 0.25);
  backdrop-filter: blur(16px);
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 20;
}

.news-bottom-panel.open {
  transform: translateY(0);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.country-flag {
  font-size: 14px;
}

.panel-title h3 {
  margin: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.news-count {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 8px;
  border-radius: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.panel-content {
  overflow: hidden;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
}

.loading-dot {
  width: 6px;
  height: 6px;
  background: #00d4ff;
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

.loading-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

/* 横条滚动 */
.news-ticker {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.3) transparent;
}

.news-ticker::-webkit-scrollbar {
  height: 3px;
}

.news-ticker::-webkit-scrollbar-track {
  background: transparent;
}

.news-ticker::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 2px;
}

.news-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 320px;
  padding: 12px 16px;
  text-decoration: none;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
  cursor: pointer;
}

.news-item:hover {
  background: rgba(0, 212, 255, 0.08);
}

.news-source {
  flex-shrink: 0;
  color: #00d4ff;
  font-size: 10px;
  font-weight: 500;
  background: rgba(0, 212, 255, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.news-title {
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
