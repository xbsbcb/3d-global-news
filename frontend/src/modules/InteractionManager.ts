/**
 * InteractionManager - 交互管理模块
 *
 * 功能：
 * - 相机绑定 earthGroup 旋转/缩放
 * - 点击国家显示高亮粒子
 * - 自动回正
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
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

export class InteractionManager {
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private earthGroup: THREE.Group
  private geoLayer: GeoLayer | null = null
  private raycaster: THREE.Raycaster
  private mouse: THREE.Vector2

  // 点击回调
  public onCountryClick: ((countryName: string) => void) | null = null

  // 右键取消聚焦回调
  public onRightClick: (() => void) | null = null

  // 点击阈值
  private clickThreshold = 5
  private mouseDownPos = { x: 0, y: 0 }
  private hasDragged = false

  // 自动回正定时器
  private autoCorrectTimer: number | null = null
  private readonly AUTO_CORRECT_DELAY = 1000  // 1秒后自动回正
  private readonly AUTO_CORRECT_DURATION = 0.5  // 回正动画时长
  private readonly TILT_THRESHOLD = 0.15  // 约8.5度阈值

  // 是否允许自动旋转
  private autoRotateEnabled = true

  constructor(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    earthGroup: THREE.Group
  ) {
    this.camera = camera
    this.controls = controls
    this.earthGroup = earthGroup
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.initListeners()
  }

  public setGeoLayer(geoLayer: GeoLayer): void {
    this.geoLayer = geoLayer
  }

  private initListeners(): void {
    const canvas = window.document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('mousedown', (e) => this.onMouseDown(e))
      canvas.addEventListener('mouseup', (e) => this.onMouseUp(e))
      canvas.addEventListener('click', (e) => this.onCanvasClick(e))
      canvas.addEventListener('contextmenu', (e) => this.onContextMenu(e))
    }

    // 监听 controls 变化用于自动回正
    this.controls.addEventListener('change', () => this.onControlsChange())
  }

  /**
   * Controls 变化时，重置自动回正定时器
   */
  private onControlsChange(): void {
    this.scheduleAutoCorrect()
  }

  /**
   * 调度自动回正
   */
  private scheduleAutoCorrect(): void {
    // 清除之前的定时器
    if (this.autoCorrectTimer !== null) {
      clearTimeout(this.autoCorrectTimer)
      this.autoCorrectTimer = null
    }

    // 从相机位置计算 phi
    const cameraRadius = this.camera.position.length()
    const phi = Math.acos(Math.abs(this.camera.position.y) / cameraRadius)

    // 如果 phi 偏离赤道位置超过阈值，启动定时器
    const phiDiff = Math.abs(phi - Math.PI / 2)
    if (phiDiff > this.TILT_THRESHOLD) {
      this.autoCorrectTimer = window.setTimeout(() => {
        this.autoCorrectRotation()
      }, this.AUTO_CORRECT_DELAY)
    }
  }

  /**
   * 自动回正旋转 - 基于相机位置的 phi 计算
   */
  private autoCorrectRotation(): void {
    if (!this.controls.enabled) return

    // 从相机位置计算当前的 phi（上下倾斜角度）
    const cameraRadius = this.camera.position.length()
    const phi = Math.acos(Math.abs(this.camera.position.y) / cameraRadius)

    // 只有当 phi 偏离赤道位置(PI/2)时才回正
    const phiDiff = Math.abs(phi - Math.PI / 2)
    if (phiDiff < this.TILT_THRESHOLD) return

    // 计算目标相机位置（保持当前距离和方位角，只调整 phi 到 PI/2）
    const theta = Math.atan2(this.camera.position.x, this.camera.position.z)  // 方位角
    const radius = cameraRadius
    const targetPhi = Math.PI / 2

    const targetX = radius * Math.sin(targetPhi) * Math.sin(theta)
    const targetY = radius * Math.cos(targetPhi)
    const targetZ = radius * Math.sin(targetPhi) * Math.cos(theta)

    gsap.to(this.camera.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
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
    // 用户停止交互后，调度自动回正
    this.scheduleAutoCorrect()
  }

  private onCanvasClick(event: MouseEvent): void {
    if (this.hasDragged) return
    if (!this.controls.enabled) return
    if (gsap.isTweening(this.camera.position)) return

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)

    const intersects = this.raycaster.intersectObject(this.earthGroup, true)
    if (intersects.length > 0) {
      const worldPoint = intersects[0].point.clone()
      let localPoint = worldPoint.clone()

      // 逆旋转（只有 Y 轴自转）
      // 逆旋转矩阵（绕 Y 轴旋转 -θ）:
      // [cos(θ)  0  -sin(θ)] [x]
      // [0        1   0     ] [y]
      // [sin(θ)  0   cos(θ)] [z]
      if (Math.abs(this.earthGroup.rotation.y) > 0.001) {
        const theta = this.earthGroup.rotation.y
        const cos = Math.cos(theta)
        const sin = Math.sin(theta)
        localPoint = new THREE.Vector3(
          worldPoint.x * cos - worldPoint.z * sin,
          worldPoint.y,
          worldPoint.x * sin + worldPoint.z * cos
        )
      }

      const latLng = this.vector3ToLatLng(localPoint)

      // 调试日志
      console.log('Click:', {
        world: { x: worldPoint.x.toFixed(1), y: worldPoint.y.toFixed(1), z: worldPoint.z.toFixed(1) },
        local: { x: localPoint.x.toFixed(1), y: localPoint.y.toFixed(1), z: localPoint.z.toFixed(1) },
        rotation: { y: (this.earthGroup.rotation.y * 180 / Math.PI).toFixed(1) },
        latLng
      })

      // 点击国家，显示高亮并触发回调
      if (this.geoLayer) {
        const countryName = this.geoLayer.onGlobeClick(worldPoint)
        if (countryName && this.onCountryClick) {
          this.onCountryClick(countryName)
        }
      }
    }
  }

  /**
   * 3D 坐标转经纬度
   */
  private vector3ToLatLng(point: THREE.Vector3): { lat: number; lng: number } {
    const radius = point.length()
    const lat = 90 - Math.acos(point.y / radius) * (180 / Math.PI)

    // atan2(z, x) 反算经度
    let theta = Math.atan2(point.z, point.x)
    // theta 范围 [-PI, PI]，转换到 [0, 2PI]
    if (theta < 0) theta += 2 * Math.PI
    // 再转换到 [-180, 180]
    let lng = theta * (180 / Math.PI) - 180
    if (lng > 180) lng -= 360

    return { lat, lng }
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
   * 飞行到指定位置
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

  /** 右键：取消聚焦，重置视角 */
  private onContextMenu(event: MouseEvent): void {
    event.preventDefault()
    // 终止正在进行的飞行动画
    gsap.killTweensOf(this.camera.position)
    gsap.killTweensOf(this.controls.target)
    this.controls.enabled = true
    // 清除高亮
    if (this.geoLayer) {
      this.geoLayer.clearHighlight()
    }
    // 通知父组件
    if (this.onRightClick) {
      this.onRightClick()
    }
  }

  public setZoomRange(min: number, max: number): void {
    this.controls.minDistance = min
    this.controls.maxDistance = max
  }

  public isAutoRotateEnabled(): boolean {
    return this.autoRotateEnabled
  }

  public dispose(): void {
    if (this.autoCorrectTimer !== null) {
      clearTimeout(this.autoCorrectTimer)
      this.autoCorrectTimer = null
    }
    this.controls.removeEventListener('change', () => this.onControlsChange())
  }
}
