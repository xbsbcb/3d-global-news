/**
 * EarthScene - 主场景控制模块
 * 负责初始化 Three.js 场景、相机、渲染器、控制器
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

  constructor(config: EarthSceneConfig) {
    this.container = config.container
    this.scene = new THREE.Scene()

    this.initCamera(config.width, config.height)
    this.initRenderer(config.width, config.height)
    this.initControls()
    this.initLights()

    window.addEventListener('resize', () => this.onResize())
  }

  private initCamera(width: number, height: number): void {
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
    this.camera.position.z = 400
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

  public dispose(): void {
    window.removeEventListener('resize', () => this.onResize())
    this.renderer.dispose()
    this.controls.dispose()
  }
}
