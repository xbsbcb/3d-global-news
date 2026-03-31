<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobe } from '../../modules/useGlobe'

const globeContainer = ref<HTMLElement | null>(null)

const { isReady, setNewsData, flyTo } = useGlobe({
  container: globeContainer,
  particleCount: 50000,
  radius: 100
})

onMounted(() => {
  // 示例：添加测试数据
  setTimeout(() => {
    setNewsData([
      { id: '1', lat: 39.9, lng: 116.4, title: '北京', category: '科技', value: 0.8 },
      { id: '2', lat: 31.2, lng: 121.5, title: '上海', category: '财经', value: 0.6 },
      { id: '3', lat: 40.7, lng: -74.0, title: '纽约', category: '政治', value: 0.9 },
      { id: '4', lat: 51.5, lng: -0.1, title: '伦敦', category: '社会', value: 0.5 },
      { id: '5', lat: 35.7, lng: 139.7, title: '东京', category: '科技', value: 0.7 }
    ])
  }, 1000)
})

const handleFlyTo = () => {
  flyTo(39.9, 116.4, 120) // 飞向北京
}
</script>

<template>
  <div class="globe-view">
    <div ref="globeContainer" class="globe-container"></div>
    <div v-if="!isReady" class="loading">
      <span>加载中...</span>
    </div>
    <div class="controls">
      <button @click="handleFlyTo">飞向北京</button>
    </div>
  </div>
</template>

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

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #00d4ff;
  font-size: 1.5rem;
}

.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 10px 20px;
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid #00d4ff;
  color: #00d4ff;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.controls button:hover {
  background: rgba(0, 212, 255, 0.4);
}
</style>
