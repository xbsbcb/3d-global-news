/**
 * GeoLayer - 地理边界模块
 * 负责解析 GeoJSON，生成 3D 边界线
 */

import * as THREE from 'three'

export interface GeoLayerConfig {
  scene: THREE.Scene
  radius: number
  geoJsonUrl?: string
}

export interface GeoFeature {
  type: string
  geometry: {
    type: string
    coordinates: number[][][] | number[][][][]
  }
}

export interface GeoData {
  features: GeoFeature[]
}

export class GeoLayer {
  private scene: THREE.Scene
  private radius: number
  private group: THREE.Group
  private geoData: GeoData | null = null

  constructor(config: GeoLayerConfig) {
    this.scene = config.scene
    this.radius = config.radius
    this.group = new THREE.Group()
    this.scene.add(this.group)
  }

  /**
   * 经纬度转 3D 坐标
   */
  public latLonToVector3(lat: number, lon: number, r?: number): THREE.Vector3 {
    const radius = r ?? this.radius
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )
  }

  /**
   * 加载 GeoJSON 数据
   */
  public async load(url?: string): Promise<void> {
    const geoUrl = url ?? this.getDefaultGeoUrl()

    try {
      const response = await fetch(geoUrl)
      this.geoData = await response.json()
      this.drawBoundaries()
    } catch (error) {
      console.warn('GeoJSON 加载失败，使用默认数据:', error)
      this.createDefaultBoundaries()
    }
  }

  private getDefaultGeoUrl(): string {
    // 使用内置的世界 GeoJSON 数据源
    return 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
  }

  private drawBoundaries(): void {
    if (!this.geoData) return

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5
    })

    this.geoData.features.forEach((feature: GeoFeature) => {
      const geom = feature.geometry as any
      if (geom.type === 'Polygon') {
        this.drawPolygon(geom.coordinates, lineMaterial)
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((polygon: any) => {
          this.drawPolygon(polygon, lineMaterial)
        })
      }
    })
  }

  private drawPolygon(coordinates: any, material: THREE.LineBasicMaterial): void {
    coordinates.forEach((ring: any) => {
      const points: THREE.Vector3[] = []
      ring.forEach((coord: any) => {
        points.push(this.latLonToVector3(coord[1], coord[0], this.radius + 0.1))
      })

      // 闭合多边形
      if (points.length > 0) {
        points.push(points[0].clone())
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      this.group.add(line)
    })
  }

  private createDefaultBoundaries(): void {
    // 创建简单的经纬线作为默认边界
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3
    })

    // 纬度线
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = []
      for (let lon = -180; lon <= 180; lon += 10) {
        points.push(this.latLonToVector3(lat, lon))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, lineMaterial)
      this.group.add(line)
    }

    // 经度线
    for (let lon = -180; lon <= 180; lon += 30) {
      const points: THREE.Vector3[] = []
      for (let lat = -90; lat <= 90; lat += 10) {
        points.push(this.latLonToVector3(lat, lon))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, lineMaterial)
      this.group.add(line)
    }
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible
  }

  public getBoundaries(): THREE.Line[] {
    const lines: THREE.Line[] = []
    this.group.traverse((child) => {
      if (child instanceof THREE.Line) {
        lines.push(child)
      }
    })
    return lines
  }

  public dispose(): void {
    this.group.traverse((child) => {
      if (child instanceof THREE.Line) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
    this.scene.remove(this.group)
  }
}
