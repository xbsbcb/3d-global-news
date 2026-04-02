/**
 * InteractionManager - 交互管理模块
 *
 * 状态机：
 * - Normal: 相机绑定 earthGroup 旋转/缩放，粒子跟随
 * - Focused: 相机飞向目标，粒子散开/聚拢动画
 *
 * 关键设计：
 * - 普通状态：所有变换通过 earthGroup 完成
 * - 聚焦状态：粒子散开消失，相机飞向目标
 * - 不做任何边界线隔离
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
// import type { ParticleEarth } from './ParticleEarth'  // 暂时禁用散射
import type { GeoLayer } from './GeoLayer'

export interface FlyToConfig {
  lat: number
  lng: number
  zoom?: number
  duration?: number
}

export interface NewsPoint {
  id: string
  lat: number
  lng: number
  title: string
  category: string
}

// 状态
export const FocusState = {
  Normal: 'normal',
  Focused: 'focused'
} as const

export type FocusStateType = typeof FocusState[keyof typeof FocusState]

export class InteractionManager {
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private earthGroup: THREE.Group
  // private particleEarth: ParticleEarth | null = null  // 暂时禁用散射
  private geoLayer: GeoLayer | null = null
  private raycaster: THREE.Raycaster
  private mouse: THREE.Vector2

  // 当前状态
  private state: FocusStateType = 'normal'

  // 原始 earthGroup 状态（用于回归）
  private originalGroupRotation = new THREE.Euler()
  private originalGroupScale = 1.0

  // 聚焦阈值
  private clickThreshold = 5
  private mouseDownPos = { x: 0, y: 0 }
  private hasDragged = false

  // 自动回正定时器
  private autoCorrectTimer: number | null = null
  private readonly AUTO_CORRECT_DELAY = 2000  // 2秒后自动回正
  private readonly AUTO_CORRECT_DURATION = 0.5  // 回正动画时长

  constructor(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    earthGroup: THREE.Group
    // particleEarth?: ParticleEarth | null  // 暂时禁用散射
  ) {
    this.camera = camera
    this.controls = controls
    this.earthGroup = earthGroup
    // this.particleEarth = particleEarth ?? null  // 暂时禁用散射
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // 记录初始状态
    this.originalGroupRotation.copy(earthGroup.rotation)
    this.originalGroupScale = earthGroup.scale.x

    this.initListeners()
  }

  // public setParticleEarth(particleEarth: ParticleEarth): void {
  //   this.particleEarth = particleEarth
  // }

  public setGeoLayer(geoLayer: GeoLayer): void {
    this.geoLayer = geoLayer
  }

  private initListeners(): void {
    const canvas = window.document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('mousedown', (e) => this.onMouseDown(e))
      canvas.addEventListener('mouseup', (e) => this.onMouseUp(e))
      canvas.addEventListener('click', (e) => this.onCanvasClick(e))
      canvas.addEventListener('contextmenu', (e) => this.onRightClick(e))
    }

    // 监听 controls 变化用于自动回正
    this.controls.addEventListener('change', () => this.onControlsChange())
  }

  /**
   * Controls 变化时，重置自动回正定时器
   */
  private onControlsChange(): void {
    if (this.state !== 'normal') return

    // 清除之前的定时器
    if (this.autoCorrectTimer !== null) {
      clearTimeout(this.autoCorrectTimer)
      this.autoCorrectTimer = null
    }

    // 检查是否有明显的旋转偏移（上下旋转，即 x 轴旋转）
    const rotX = this.earthGroup.rotation.x
    if (Math.abs(rotX) > 0.05) {  // 超过约3度
      // 启动自动回正定时器
      this.autoCorrectTimer = window.setTimeout(() => {
        this.autoCorrectRotation()
      }, this.AUTO_CORRECT_DELAY)
    }
  }

  /**
   * 自动回正旋转
   */
  private autoCorrectRotation(): void {
    if (this.state !== 'normal') return
    if (gsap.isTweening(this.earthGroup.rotation)) return

    gsap.to(this.earthGroup.rotation, {
      x: 0,
      z: 0,
      duration: this.AUTO_CORRECT_DURATION,
      ease: 'power2.out'
    })
  }

  private onMouseDown(event: MouseEvent): void {
    this.mouseDownPos = { x: event.clientX, y: event.clientY }
    this.hasDragged = false
  }

  private onMouseUp(event: MouseEvent): void {
    const dx = event.clientX - this.mouseDownPos.x
    const dy = event.clientY - this.mouseDownPos.y
    if (Math.sqrt(dx * dx + dy * dy) > this.clickThreshold) {
      this.hasDragged = true
    }
  }

  private onCanvasClick(event: MouseEvent): void {
    if (this.hasDragged) return
    if (!this.controls.enabled) return
    if (gsap.isTweening(this.camera.position)) return
    if (this.state === 'focused') return  // 已是聚焦状态，忽略点击

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)

    const intersects = this.raycaster.intersectObject(this.earthGroup, true)
    if (intersects.length > 0) {
      const point = intersects[0].point
      const latLng = this.vector3ToLatLng(point)
      this.focusTo({
        lat: latLng.lat,
        lng: latLng.lng,
        duration: 1.5
      })
    }
  }

  /**
   * 右键取消聚焦
   */
  private onRightClick(event: MouseEvent): void {
    event.preventDefault()
    if (this.state === 'focused') {
      this.cancelFocus()
    }
  }

  /**
   * 聚焦到某区域
   * 使用点击点的法线方向计算相机位置
   */
  public focusToPoint(point: THREE.Vector3, config: FlyToConfig): void {
    if (this.state === 'focused') return
    this.state = 'focused'

    // 1. 记录当前 earthGroup 状态
    this.originalGroupRotation.copy(this.earthGroup.rotation)
    this.originalGroupScale = this.earthGroup.scale.x

    // 2. 计算聚焦距离
    const distance = this.calculateFocusDistance(config.lat, config.lng)

    // 3. 使用点击点的法线方向计算相机位置
    // point 已经是在 earthGroup 空间中的点，直接使用其方向
    const direction = point.clone().normalize()

    // 相机位置：沿法线方向 * distance
    const cameraPos = direction.clone().multiplyScalar(distance)

    // target 指向地球表面点
    const targetPos = direction.clone().multiplyScalar(100)

    this.controls.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        this.controls.enabled = true
      }
    })

    // 相机飞向目标 - 先慢后快
    tl.to(this.camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: config.duration ?? 1.5,
      ease: 'power2.in'
    }, 0)

    // target 指向目标点
    tl.to(this.controls.target, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: config.duration ?? 1.5,
      ease: 'power2.in',
      onUpdate: () => {
        this.camera.lookAt(this.controls.target)
      }
    }, 0)
  }

  /**
   * 聚焦到某区域（使用经纬度）
   */
  public focusTo(config: FlyToConfig): void {
    if (this.state === 'focused') return
    this.state = 'focused'

    // 1. 记录当前 earthGroup 状态
    this.originalGroupRotation.copy(this.earthGroup.rotation)
    this.originalGroupScale = this.earthGroup.scale.x

    // 2. 计算聚焦距离
    const distance = this.calculateFocusDistance(config.lat, config.lng)

    // 3. 使用点击点的法线方向
    const direction = this.latLngToVector3(config.lat, config.lng, 1).normalize()
    const cameraPos = direction.clone().multiplyScalar(distance)
    const surfacePoint = direction.clone().multiplyScalar(100)

    this.controls.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        this.controls.enabled = true
      }
    })

    // 相机飞向目标 - 先慢后快
    tl.to(this.camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: config.duration ?? 1.5,
      ease: 'power2.in',
      onUpdate: () => {
        // 持续更新相机朝向，指向目标点
        this.camera.lookAt(surfacePoint)
      }
    }, 0)
  }

  /**
   * 取消聚焦，回归普通状态
   */
  public cancelFocus(): void {
    if (this.state === 'normal') return
    this.state = 'normal'

    const duration = 0.8

    // 1. 粒子散开 (暂时取消)
    // if (this.particleEarth) {
    //   this.particleEarth.setScatter(1.0, 0.3)
    // }

    // 2. 重置 earthGroup
    gsap.to(this.earthGroup.rotation, {
      x: this.originalGroupRotation.x,
      y: this.originalGroupRotation.y,
      z: this.originalGroupRotation.z,
      duration,
      ease: 'power2.out'
    })

    gsap.to(this.earthGroup.scale, {
      x: this.originalGroupScale,
      y: this.originalGroupScale,
      z: this.originalGroupScale,
      duration,
      ease: 'power2.out'
    })

    // 3. 相机回归
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 400,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        this.camera.lookAt(0, 0, 0)
      },
      onComplete: () => {
        this.controls.enabled = true
        // 4. 粒子聚拢回来 (暂时取消)
        // if (this.particleEarth) {
        //   this.particleEarth.setScatter(0.0, 0.4)
        // }
      }
    })
  }

  /**
   * 计算聚焦距离 - 基于地理范围，使国家占屏幕比例一致
   */
  private calculateFocusDistance(lat: number, lng: number): number {
    if (!this.geoLayer) return 150

    const countryName = this.geoLayer.findCountryAtPoint(lat, lng)
    if (!countryName) return 150

    const bounds = this.geoLayer.getCountryBounds(countryName)
    if (!bounds) return 150

    const latSpan = bounds.maxLat - bounds.minLat
    const lngSpan = bounds.maxLng - bounds.minLng
    const span = Math.max(latSpan, lngSpan, 5)  // 最小跨度5度

    // 基于地理范围计算距离：跨度越大，距离越远
    const distance = Math.max(100, Math.min(250, 400 / span))
    return distance
  }

  /**
   * 3D 坐标转经纬度
   */
  private vector3ToLatLng(point: THREE.Vector3): { lat: number; lng: number } {
    const radius = point.length()
    const lat = 90 - Math.acos(point.y / radius) * (180 / Math.PI)
    const lng = Math.atan2(point.z, -point.x) * (180 / Math.PI) - 180
    return { lat, lng: lng < -180 ? lng + 360 : lng }
  }

  /**
   * 经纬度转 3D 坐标
   */
  public latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )
  }

  /**
   * 飞行到指定位置（外部调用）
   */
  public flyTo(config: FlyToConfig): Promise<void> {
    return new Promise((resolve) => {
      const targetPos = this.latLngToVector3(
        config.lat,
        config.lng,
        config.zoom ?? 150
      )
      this.controls.enabled = false

      const tl = gsap.timeline({
        onComplete: () => {
          this.controls.enabled = true
          resolve()
        }
      })

      tl.to(this.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: config.duration ?? 1.5,
        ease: 'power2.inOut'
      }, 0)

      tl.to(this.controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: config.duration ?? 1.5,
        ease: 'power2.inOut'
      }, 0)
    })
  }

  public setZoomRange(min: number, max: number): void {
    this.controls.minDistance = min
    this.controls.maxDistance = max
  }

  public getState(): FocusStateType {
    return this.state
  }

  public dispose(): void {
    if (this.autoCorrectTimer !== null) {
      clearTimeout(this.autoCorrectTimer)
      this.autoCorrectTimer = null
    }
    this.controls.removeEventListener('change', () => this.onControlsChange())
  }
}
