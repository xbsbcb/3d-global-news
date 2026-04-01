<script setup lang="ts">
import type { Category } from '@/api'

defineProps<{
  categories: Category[]
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

function selectCategory(slug: string | null) {
  emit('update:modelValue', slug)
}

function getCategoryColor(color: string | null): string {
  return color || '#00d4ff'
}
</script>

<template>
  <div class="category-filter">
    <button
      class="category-btn"
      :class="{ active: modelValue === null }"
      @click="selectCategory(null)"
    >
      全部
    </button>
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="category-btn"
      :class="{ active: modelValue === cat.slug }"
      :style="{
        '--cat-color': getCategoryColor(cat.color)
      }"
      @click="selectCategory(cat.slug)"
    >
      {{ cat.name }}
    </button>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-btn {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 20px;
  padding: 6px 16px;
  color: #a0a0a0;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: var(--cat-color, #00d4ff);
  color: #fff;
}

.category-btn.active {
  background: var(--cat-color, #00d4ff);
  border-color: var(--cat-color, #00d4ff);
  color: #0a0a0f;
  font-weight: 600;
}
</style>
