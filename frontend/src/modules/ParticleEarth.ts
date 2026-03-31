/**
 * ParticleEarth - 粒子地球模块
 * 负责粒子的生成、材质（Shader）以及聚拢/散开动画
 */

import * as THREE from 'three'
import gsap from 'gsap'

export interface ParticleEarthConfig {
  scene: THREE.Scene
  radius: number
  particleCount: number
}

export class ParticleEarth {
  public earth: THREE.Points
  public particleMaterial: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry
  private config: ParticleEarthConfig

  constructor(config: ParticleEarthConfig) {
    this.config = config
    this.geometry = new THREE.BufferGeometry()
    this.particleMaterial = this.createMaterial()
    this.earth = this.createParticleEarth()

    config.scene.add(this.earth)
  }

  private createMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uZoom: { value: 1.0 }, // 1.0 = 正常，数值越大粒子越聚拢
        uColor: { value: new THREE.Color(0x3399ff) }
      },
      vertexShader: `
        attribute float aScale;
        uniform float uZoom;
        uniform float uTime;
        varying float vAlpha;

        void main() {
          // 聚拢逻辑：位置随 uZoom 向中心偏移
          vec3 targetPos = position * (1.0 / uZoom);
          vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);

          // 粒子大小随距离自动调整
          gl_PointSize = (2.0 + aScale * 2.0) * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          vAlpha = 1.0 / uZoom;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          // 绘制圆形粒子
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;

          gl_FragColor = vec4(uColor, vAlpha * (0.6 - r));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    })
  }

  private createParticleEarth(): THREE.Points {
    const positions = new Float32Array(this.config.particleCount * 3)
    const randomScales = new Float32Array(this.config.particleCount)

    for (let i = 0; i < this.config.particleCount; i++) {
      // 球面坐标系随机分布
      const phi = Math.acos(Math.random() * 2 - 1)
      const theta = Math.random() * Math.PI * 2

      positions[i * 3] = this.config.radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = this.config.radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = this.config.radius * Math.cos(phi)
      randomScales[i] = Math.random()
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(randomScales, 1))

    return new THREE.Points(this.geometry, this.particleMaterial)
  }

  public setProgress(progress: number): void {
    this.particleMaterial.uniforms.uZoom.value = progress
  }

  public animateProgress(target: number, duration: number = 0.5): void {
    gsap.to(this.particleMaterial.uniforms.uZoom, {
      value: target,
      duration,
      ease: 'power2.out'
    })
  }

  public update(time: number): void {
    this.particleMaterial.uniforms.uTime.value = time
  }

  public setColor(color: THREE.Color): void {
    this.particleMaterial.uniforms.uColor.value = color
  }

  public dispose(): void {
    this.geometry.dispose()
    this.particleMaterial.dispose()
  }
}
