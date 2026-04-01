<script setup lang="ts">
import type { Stats } from '@/api'

defineProps<{
  stats: Stats | null
}>()
</script>

<template>
  <div class="stats-panel">
    <div class="stat-item">
      <span class="stat-value">{{ stats?.total_news || 0 }}</span>
      <span class="stat-label">新闻总数</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-value">{{ Object.keys(stats?.category_counts || {}).length }}</span>
      <span class="stat-label">分类数</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-value">
        {{ stats?.category_counts?.[Object.keys(stats?.category_counts || {})[0] || ''] || 0 }}
      </span>
      <span class="stat-label">最多分类</span>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  color: #00d4ff;
  font-size: 20px;
  font-weight: 600;
}

.stat-label {
  color: #a0a0a0;
  font-size: 11px;
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(0, 212, 255, 0.3);
}
</style>
