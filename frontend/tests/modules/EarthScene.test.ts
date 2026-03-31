/**
 * EarthScene 模块单元测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EarthScene } from '@/modules/EarthScene'

describe('EarthScene', () => {
  let container: HTMLElement
  let earthScene: EarthScene

  beforeEach(() => {
    container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (earthScene) {
      earthScene.dispose()
    }
    document.body.removeChild(container)
  })

  it('should create EarthScene successfully', () => {
    earthScene = new EarthScene({
      container,
      width: 800,
      height: 600
    })

    expect(earthScene).toBeDefined()
    expect(earthScene.scene).toBeDefined()
    expect(earthScene.camera).toBeDefined()
    expect(earthScene.renderer).toBeDefined()
    expect(earthScene.controls).toBeDefined()
  })

  it('should have scene with lights', () => {
    earthScene = new EarthScene({
      container,
      width: 800,
      height: 600
    })

    expect(earthScene.scene.children.length).toBeGreaterThan(0)
  })

  it('should resize correctly', () => {
    earthScene = new EarthScene({
      container,
      width: 800,
      height: 600
    })

    earthScene.resize(1024, 768)
    expect(earthScene.camera.aspect).toBe(1024 / 768)
  })
})
