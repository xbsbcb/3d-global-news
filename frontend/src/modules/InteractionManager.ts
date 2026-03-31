/**
 * InteractionManager - 交互管理模块
 * 负责局部特写（Camera Fly-to）和缩放监听
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import type { ParticleEarth } from './ParticleEarth'

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
  private particleEarth: ParticleEarth | null = null
  private raycaster: THREE.Raycaster
  private mouse: THREE.Vector2

  constructor(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    particleEarth?: ParticleEarth | null
  ) {
    this.camera = camera
    this.controls = controls
    this.particleEarth = particleEarth ?? null
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.initListeners()
  }

  public setParticleEarth(particleEarth: ParticleEarth): void {
    this.particleEarth = particleEarth
  }

  private initListeners(): void {
    window.addEventListener('click', (e) => this.onMouseClick(e))

    // 缩放监听，联动粒子特效
    this.controls.addEventListener('change', () => {
      this.handleZoomSync()
    })
  }

  /**
   * 同步相机距离与粒子聚拢系数
   */
  private handleZoomSync(): void {
    if (!this.particleEarth) return

    const dist = this.camera.position.length()
    // 映射：距离越小(近)，uZoom 越大(聚拢)
    const zoomFactor = THREE.MathUtils.mapLinear(dist, 120, 400, 2.5, 1.0)
    const clampedZoom = THREE.MathUtils.clamp(zoomFactor, 1.0, 2.5)

    this.particleEarth.particleMaterial.uniforms.uZoom.value = clampedZoom
  }

  /**
   * 鼠标点击拾取
   */
  private onMouseClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)
  }

  /**
   * 拾取地球表面点
   */
  public pickPoint(targetObject: THREE.Object3D): THREE.Vector3 | null {
    const intersects = this.raycaster.intersectObject(targetObject)

    if (intersects.length > 0) {
      return intersects[0].point
    }
    return null
  }

  /**
   * 经纬度转 Vector3
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

      // 禁用控制器
      this.controls.enabled = false

      const tl = gsap.timeline({
        onComplete: () => {
          this.controls.enabled = true
          resolve()
        }
      })

      // 相机位置移动
      tl.to(this.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: config.duration ?? 1.5,
        ease: 'power2.inOut'
      }, 0)

      // 视点中心同步移动
      const lookTarget = this.latLngToVector3(config.lat, config.lng, 100)
      tl.to(this.controls.target, {
        x: lookTarget.x,
        y: lookTarget.y,
        z: lookTarget.z,
        duration: config.duration ?? 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.camera.lookAt(this.controls.target)
        }
      }, 0)
    })
  }

  /**
   * 设置缩放范围
   */
  public setZoomRange(min: number, max: number): void {
    this.controls.minDistance = min
    this.controls.maxDistance = max
  }

  public dispose(): void {
    window.removeEventListener('click', this.onMouseClick)
  }
}
