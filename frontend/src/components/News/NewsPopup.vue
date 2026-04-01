<script setup lang="ts">
import type { News } from '@/api'

defineProps<{
  news: News
}>()

const emit = defineEmits<{
  close: []
}>()

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="news-popup-overlay" @click.self="emit('close')">
    <div class="news-popup">
      <button class="close-btn" @click="emit('close')">&times;</button>

      <div class="news-header">
        <span class="category-tag">{{ news.category }}</span>
        <span class="source">{{ news.source }}</span>
      </div>

      <h2 class="news-title">{{ news.title }}</h2>

      <div class="news-meta">
        <span v-if="news.country">{{ news.country }}</span>
        <span v-if="news.city">{{ news.city }}</span>
        <span class="date">{{ formatDate(news.published_at) }}</span>
      </div>

      <div v-if="news.summary" class="news-summary">
        <p>{{ news.summary }}</p>
      </div>

      <div v-if="news.content" class="news-content">
        <p>{{ news.content }}</p>
      </div>

      <div v-if="news.latitude && news.longitude" class="news-location">
        <span>📍 {{ news.latitude.toFixed(4) }}, {{ news.longitude.toFixed(4) }}</span>
      </div>

      <a v-if="news.source_url" :href="news.source_url" target="_blank" class="source-link">
        查看原文 →
      </a>
    </div>
  </div>
</template>

<style scoped>
.news-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.news-popup {
  background: #1a1a2e;
  border: 1px solid #00d4ff;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
}

.close-btn:hover {
  color: #fff;
}

.news-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.category-tag {
  background: #00d4ff;
  color: #0a0a0f;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.source {
  color: #a0a0a0;
  font-size: 12px;
}

.news-title {
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.news-meta {
  display: flex;
  gap: 12px;
  color: #a0a0a0;
  font-size: 12px;
  margin-bottom: 16px;
}

.news-summary {
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 16px;
}

.news-content {
  color: #c0c0c0;
  font-size: 14px;
  line-height: 1.6;
  max-height: 200px;
  overflow-y: auto;
}

.news-location {
  margin-top: 16px;
  color: #00d4ff;
  font-size: 12px;
}

.source-link {
  display: inline-block;
  margin-top: 16px;
  color: #00d4ff;
  text-decoration: none;
  font-size: 14px;
}

.source-link:hover {
  text-decoration: underline;
}
</style>
