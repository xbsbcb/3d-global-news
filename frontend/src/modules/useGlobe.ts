/**
 * useGlobe - Vue Composables 封装
 * 方便在 Vue 组件中使用 3D 地球模块
 *
 * 架构：
 * - earthGroup 包含 particleEarth 和 geoLayer
 * - 所有子层跟随 earthGroup 旋转/缩放
 * - 聚焦动画独立于 earthGroup
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

    // 1. 初始化场景（包含 earthGroup）
    earthScene = new EarthScene({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight
    })

    // 2. 初始化粒子地球（添加到 earthGroup）
    particleEarth = new ParticleEarth({
      scene: earthScene.earthGroup,  // 直接添加到 earthGroup
      radius,
      particleCount
    })

    // 3. 初始化地理边界（也添加到同一个 earthGroup）
    geoLayer = new GeoLayer({
      scene: earthScene.earthGroup,  // 和粒子共享同一个父容器
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
      earthScene.earthGroup
    )
    interactionManager.setGeoLayer(geoLayer)

    isReady.value = true
    animate()
  }

  const animate = () => {
    const time = performance.now() * 0.001

    if (particleEarth && earthScene) {
      particleEarth.update(time)
      // 更新相机距离用于散射计算
      particleEarth.setCameraDistance(earthScene.camera.position.length())
    }

    // 普通状态缓慢自转
    if (earthScene && interactionManager && interactionManager.getState() === 'normal') {
      earthScene.earthGroup.rotation.y += 0.0005  // 缓慢自转
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
