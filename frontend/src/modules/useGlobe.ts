/**
 * useGlobe - Vue Composables 封装
 * 方便在 Vue 组件中使用 3D 地球模块
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import {
  EarthScene,
  ParticleEarth,
  GeoLayer,
  DataLayer,
  InteractionManager,
  type NewsPoint
} from './'

export interface UseGlobeOptions {
  container: Ref<HTMLElement | null>
  particleCount?: number
  radius?: number
}

export function useGlobe(options: UseGlobeOptions) {
  const { container, particleCount = 50000, radius = 100 } = options

  let earthScene: EarthScene | null = null
  let particleEarth: ParticleEarth | null = null
  let geoLayer: GeoLayer | null = null
  let dataLayer: DataLayer | null = null
  let interactionManager: InteractionManager | null = null
  let animationId: number | null = null

  const isReady = ref(false)

  const init = async () => {
    if (!container.value) return

    // 1. 初始化场景
    earthScene = new EarthScene({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight
    })

    // 2. 初始化粒子地球
    particleEarth = new ParticleEarth({
      scene: earthScene.scene,
      radius,
      particleCount
    })

    // 3. 初始化地理边界
    geoLayer = new GeoLayer({
      scene: earthScene.scene,
      radius
    })
    await geoLayer.load()

    // 4. 初始化数据层
    dataLayer = new DataLayer({
      scene: earthScene.scene,
      radius
    })

    // 5. 初始化交互管理
    interactionManager = new InteractionManager(
      earthScene.camera,
      earthScene.controls,
      particleEarth
    )

    isReady.value = true
    animate()
  }

  const animate = () => {
    const time = performance.now() * 0.001

    if (particleEarth) {
      particleEarth.update(time)
    }
    if (dataLayer) {
      dataLayer.update(time)
    }
    if (earthScene) {
      earthScene.render()
    }

    animationId = requestAnimationFrame(animate)
  }

  const flyTo = (lat: number, lng: number, zoom?: number) => {
    if (interactionManager) {
      interactionManager.flyTo({ lat, lng, zoom })
    }
  }

  const setNewsData = (news: NewsPoint[]) => {
    if (dataLayer) {
      dataLayer.createHeatmapPoints(news)
    }
  }

  const addConnection = (start: NewsPoint, end: NewsPoint) => {
    if (dataLayer) {
      dataLayer.addFlyLine(start, end)
    }
  }

  const clearConnections = () => {
    if (dataLayer) {
      dataLayer.clearConnections()
    }
  }

  const showHeatmap = (visible: boolean) => {
    if (dataLayer) {
      dataLayer.showHeatmap(visible)
    }
  }

  const dispose = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (particleEarth) {
      particleEarth.dispose()
    }
    if (geoLayer) {
      geoLayer.dispose()
    }
    if (dataLayer) {
      dataLayer.dispose()
    }
    if (interactionManager) {
      interactionManager.dispose()
    }
    if (earthScene) {
      earthScene.dispose()
    }
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    dispose()
  })

  return {
    isReady,
    flyTo,
    setNewsData,
    addConnection,
    clearConnections,
    showHeatmap,
    dispose
  }
}
