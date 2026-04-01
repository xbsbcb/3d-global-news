<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)

watch(localValue, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
  localValue.value = val
})
</script>

<template>
  <div class="search-bar">
    <span class="search-icon">🔍</span>
    <input
      v-model="localValue"
      type="text"
      placeholder="搜索新闻..."
      class="search-input"
    />
    <button
      v-if="localValue"
      class="clear-btn"
      @click="localValue = ''"
    >
      &times;
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;
}

.search-icon {
  font-size: 14px;
  opacity: 0.6;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  width: 180px;
}

.search-input::placeholder {
  color: #a0a0a0;
}

.clear-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.clear-btn:hover {
  color: #fff;
}
</style>
