/**
 * ParticleEarth 模块单元测试
 */

import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { ParticleEarth } from '@/modules/ParticleEarth'

describe('ParticleEarth', () => {
  let scene: THREE.Scene

  beforeEach(() => {
    scene = new THREE.Scene()
  })

  it('should create ParticleEarth successfully', () => {
    const particleEarth = new ParticleEarth({
      scene,
      radius: 100,
      particleCount: 1000
    })

    expect(particleEarth).toBeDefined()
    expect(particleEarth.earth).toBeDefined()
    expect(particleEarth.particleMaterial).toBeDefined()
  })

  it('should have correct particle count', () => {
    const particleCount = 5000
    const particleEarth = new ParticleEarth({
      scene,
      radius: 100,
      particleCount
    })

    const positionAttr = particleEarth.earth.geometry.getAttribute('position')
    expect(positionAttr.count).toBe(particleCount)
  })

  it('should update zoom correctly', () => {
    const particleEarth = new ParticleEarth({
      scene,
      radius: 100,
      particleCount: 1000
    })

    particleEarth.setProgress(1.5)
    expect(particleEarth.particleMaterial.uniforms.uZoom.value).toBe(1.5)
  })

  it('should set color correctly', () => {
    const particleEarth = new ParticleEarth({
      scene,
      radius: 100,
      particleCount: 1000
    })

    const newColor = new THREE.Color(0xff0000)
    particleEarth.setColor(newColor)
    expect(particleEarth.particleMaterial.uniforms.uColor.value.r).toBeCloseTo(1)
  })
})
