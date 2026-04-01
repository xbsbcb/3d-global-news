/**
 * ParticleEarth - 粒子地球模块
 *
 * 设计：
 * - 作为 earthGroup 的子节点
 * - 普通状态跟随 earthGroup 旋转/缩放
 * - 聚焦状态：只执行散开/聚拢动画，不做独立缩放
 *
 * 散开原理：
 * - 粒子沿球面法线向外扩散
 * - 透明度二次衰减实现快速消失
 */

import * as THREE from 'three'
import gsap from 'gsap'

export interface ParticleEarthConfig {
  scene: THREE.Object3D
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
        uScatter: { value: 0.0 },   // 扩散程度：0=正常，1=扩散消失
        uPixelRatio: { value: window.devicePixelRatio },
        uCameraDist: { value: 400.0 },  // 相机距离，用于计算散射
        uColor: { value: new THREE.Color(0x2266aa) }  // 调暗
      },
      vertexShader: `
        precision highp float;

        uniform float uScatter;
        uniform float uPixelRatio;
        uniform float uCameraDist;  // 相机距离

        varying float vAlpha;

        void main() {
          // ============================================
          // 粒子扩散：沿球面法线向外扩散消失
          // 散射距离需要足够大，确保粒子在相机缩近时仍在视野外
          // ============================================
          vec3 normal = normalize(position);

          // 散射距离 = 相机距离 * 2 + 200，确保在任何缩放级别都视野外
          float scatterDist = uScatter * (uCameraDist * 2.0 + 200.0);
          vec3 scattered = position + normal * scatterDist;

          vec4 mvPosition = modelViewMatrix * vec4(scattered, 1.0);

          // 粒子大小保持恒定
          gl_PointSize = 2.0 * uPixelRatio;

          gl_Position = projectionMatrix * mvPosition;

          // 透明度：二次衰减，快速消失
          float alpha = 1.0 - uScatter * uScatter;
          vAlpha = alpha;
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float r = length(center) * 2.0;

          if (r > 1.0) discard;

          float edge = smoothstep(1.0, 0.7, r);
          float alpha = vAlpha * edge * 0.5;  // 降低透明度

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    })
  }

  private createParticleEarth(): THREE.Points {
    const positions = new Float32Array(this.config.particleCount * 3)

    // 斐波那契螺旋分布
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < this.config.particleCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / this.config.particleCount)
      const theta = goldenAngle * i

      positions[i * 3] = this.config.radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = this.config.radius * Math.cos(phi)
      positions[i * 3 + 2] = this.config.radius * Math.sin(phi) * Math.sin(theta)
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    return new THREE.Points(this.geometry, this.particleMaterial)
  }

  /**
   * 聚焦时：粒子扩散消失
   * 使用 power2.out：开始快，逐渐减速，更自然的散开效果
   */
  public scatterForFocus(duration: number = 0.5): void {
    gsap.to(this.particleMaterial.uniforms.uScatter, {
      value: 1.0,
      duration,
      ease: 'power2.out'
    })
  }

  /**
   * 取消聚焦时：粒子回归
   * 使用 power2.out：减速到达，更有控制感
   */
  public gatherAndReturn(duration: number = 0.5): void {
    gsap.to(this.particleMaterial.uniforms.uScatter, {
      value: 0.0,
      duration,
      ease: 'power2.out'
    })
  }

  /**
   * 通用散开/聚拢方法
   * @param value 0=聚拢, 1=完全散开
   * @param duration 动画时长
   */
  public setScatter(value: number, duration: number = 0.5): void {
    gsap.to(this.particleMaterial.uniforms.uScatter, {
      value,
      duration,
      ease: 'power2.out'
    })
  }

  public update(time: number): void {
    this.particleMaterial.uniforms.uTime.value = time
  }

  /**
   * 更新相机距离（用于计算散射范围）
   */
  public setCameraDistance(dist: number): void {
    this.particleMaterial.uniforms.uCameraDist.value = dist
  }

  public setColor(color: THREE.Color): void {
    this.particleMaterial.uniforms.uColor.value = color
  }

  public dispose(): void {
    this.geometry.dispose()
    this.particleMaterial.dispose()
  }
}
