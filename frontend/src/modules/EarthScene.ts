/**
 * EarthScene - 主场景控制模块
 * 负责初始化 Three.js 场景、相机、渲染器、控制器
 *
 * 架构：
 * - EarthGroup: 包含粒子层和边界层的父容器
 * - 相机始终看向地球中心 (0,0,0)
 * - OrbitControls 的 target 固定为地球中心
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface EarthSceneConfig {
  container: HTMLElement
  width: number
  height: number
}

export class EarthScene {
  public scene!: THREE.Scene
  public camera!: THREE.PerspectiveCamera
  public renderer!: THREE.WebGLRenderer
  public controls!: OrbitControls
  public container!: HTMLElement

  // 地球容器组 - 粒子和边界都添加到这里
  public earthGroup!: THREE.Group

  // 相机默认位置（用于回归）
  private defaultCameraDistance = 400

  constructor(config: EarthSceneConfig) {
    this.container = config.container
    this.scene = new THREE.Scene()

    // 初始化地球容器组
    this.earthGroup = new THREE.Group()
    this.scene.add(this.earthGroup)

    this.initCamera(config.width, config.height)
    this.initRenderer(config.width, config.height)
    this.initControls()
    this.initLights()

    window.addEventListener('resize', () => this.onResize())
  }

  private initCamera(width: number, height: number): void {
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
    this.camera.position.z = this.defaultCameraDistance
  }

  private initRenderer(width: number, height: number): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.container.appendChild(this.renderer.domElement)
  }

  private initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05

    // 关键：相机始终看向地球中心
    this.controls.target.set(0, 0, 0)
    this.controls.minDistance = 150
    this.controls.maxDistance = 600
  }

  private initLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 3, 5)
    this.scene.add(directionalLight)
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  private onResize(): void {
    const width = window.innerWidth
    const height = window.innerHeight
    this.resize(width, height)
  }

  public render(): void {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 重置相机到默认位置，看向地球中心
   */
  public resetCamera(): void {
    this.camera.position.set(0, 0, this.defaultCameraDistance)
    this.controls.target.set(0, 0, 0)
    this.camera.lookAt(0, 0, 0)
  }

  /**
   * 获取当前相机距离
   */
  public getCameraDistance(): number {
    return this.camera.position.length()
  }

  public dispose(): void {
    window.removeEventListener('resize', () => this.onResize())
    this.renderer.dispose()
    this.controls.dispose()
  }
}
