/**
 * GeoLayer 模块单元测试
 */

import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { GeoLayer } from '@/modules/GeoLayer'

describe('GeoLayer', () => {
  let scene: THREE.Scene
  let geoLayer: GeoLayer

  beforeEach(() => {
    scene = new THREE.Scene()
    geoLayer = new GeoLayer({
      scene,
      radius: 100
    })
  })

  it('should create GeoLayer successfully', () => {
    expect(geoLayer).toBeDefined()
    expect(geoLayer.latLonToVector3).toBeDefined()
  })

  it('should convert lat/lon to Vector3 correctly', () => {
    // 北京: 39.9°N, 116.4°E
    const result = geoLayer.latLonToVector3(39.9, 116.4, 100)

    expect(result.x).toBeDefined()
    expect(result.y).toBeDefined()
    expect(result.z).toBeDefined()
    // 验证结果在球面上
    expect(result.length()).toBeCloseTo(100, 1)
  })

  it('should handle equator correctly', () => {
    // 赤道上的点 (0°, 0°)
    const result = geoLayer.latLonToVector3(0, 0, 100)

    expect(result.length()).toBeCloseTo(100, 1)
  })

  it('should set visibility correctly', () => {
    geoLayer.setVisible(false)
    expect(geoLayer.getBoundaries()).toBeDefined()
  })
})
