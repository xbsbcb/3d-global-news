/**
 * GeoLayer - 地理边界模块
 * 负责解析 GeoJSON，生成国家边界线
 * 支持聚焦时只显示目标国家
 */

import * as THREE from 'three'

export interface GeoLayerConfig {
  scene: THREE.Object3D  // 可以是 Scene 或 Group
  radius: number
}

interface GeoFeature {
  type: string
  properties: {
    ADMIN?: string
    name?: string
    ISO_A3?: string
  }
  geometry: {
    type: string
    coordinates: number[][][] | number[][][][]
  }
}

export interface GeoData {
  type: string
  features: GeoFeature[]
}

export interface CountryBounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

export class GeoLayer {
  private scene: THREE.Object3D
  private radius: number
  private group: THREE.Group
  private geoData: GeoData | null = null

  // 普通国家边界材质
  private countryMaterial: THREE.LineBasicMaterial
  // 填充材质 - 外表面显示
  private fillMaterial: THREE.MeshBasicMaterial

  // 保存所有边界线
  private allLines: Map<string, THREE.Line> = new Map()
  // 保存所有填充
  private allFills: Map<string, THREE.Mesh> = new Map()

  // 保存国家边界框
  private countryBounds: Map<string, CountryBounds> = new Map()

  // 边界线和填充高度偏移（都贴合球面）
  private readonly OFFSET = 0.2

  constructor(config: GeoLayerConfig) {
    this.scene = config.scene
    this.radius = config.radius

    this.countryMaterial = new THREE.LineBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.4
    })

    // 填充材质 - 使用 FrontSide 只显示外表面
    this.fillMaterial = new THREE.MeshBasicMaterial({
      color: 0x2266aa,
      transparent: true,
      opacity: 0.3,
      side: THREE.FrontSide
    })

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
  public async load(): Promise<void> {
    const countryUrl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'

    try {
      const response = await fetch(countryUrl)
      const data: GeoData = await response.json()
      this.geoData = data
      this.calculateBounds()
      this.drawBoundaries()
      console.log('GeoLayer: 加载了', data.features.length, '个国家边界')
    } catch (error) {
      console.warn('GeoJSON 加载失败:', error)
    }
  }

  /**
   * 计算每个国家的边界框
   */
  private calculateBounds(): void {
    if (!this.geoData) return

    for (const feature of this.geoData.features) {
      const name = feature.properties?.ADMIN || feature.properties?.name
      if (!name) continue

      const geom = feature.geometry as any
      const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates

      let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180

      for (const polygon of polygons) {
        for (const ring of polygon) {
          for (const coord of ring) {
            if (coord && coord.length >= 2) {
              const lng = coord[0]
              const lat = coord[1]
              if (!isNaN(lat) && !isNaN(lng)) {
                minLat = Math.min(minLat, lat)
                maxLat = Math.max(maxLat, lat)
                minLng = Math.min(minLng, lng)
                maxLng = Math.max(maxLng, lng)
              }
            }
          }
        }
      }

      this.countryBounds.set(name, { minLat, maxLat, minLng, maxLng })
    }
  }

  /**
   * 获取国家的边界框
   */
  public getCountryBounds(countryName: string): CountryBounds | null {
    return this.countryBounds.get(countryName) || null
  }

  private drawBoundaries(): void {
    if (!this.geoData) return

    this.geoData.features.forEach((feature: GeoFeature) => {
      const geom = feature.geometry as any
      const name = feature.properties?.ADMIN || feature.properties?.name || 'Unknown'

      const lineMaterial = this.countryMaterial.clone()

      if (geom.type === 'Polygon') {
        this.drawPolygon(geom.coordinates, lineMaterial, name)
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((polygon: any) => {
          this.drawPolygon(polygon, lineMaterial, name)
        })
      }
    })
  }

  private drawPolygon(coordinates: any, material: THREE.LineBasicMaterial, countryName: string): void {
    coordinates.forEach((ring: any, ringIndex: number) => {
      // 收集外环点
      const ringPoints: THREE.Vector3[] = []
      ring.forEach((coord: any) => {
        if (coord && coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
          ringPoints.push(this.latLonToVector3(coord[1], coord[0], this.radius + this.OFFSET))
        }
      })

      if (ringPoints.length >= 3) {
        // 1. 绘制填充（使用扇形三角剖分）
        if (ringIndex === 0) {
          const fillMesh = this.createFillPolygonFromRing(ringPoints)
          if (fillMesh) {
            this.allFills.set(countryName + '_fill_' + this.allFills.size, fillMesh)
            this.group.add(fillMesh)
          }
        }

        // 2. 绘制边界线（直接贴合球面）
        const closedLinePoints = [...ringPoints, ringPoints[0].clone()]
        const geometry = new THREE.BufferGeometry().setFromPoints(closedLinePoints)
        const line = new THREE.Line(geometry, material)
        this.allLines.set(countryName + '_' + this.allLines.size, line)
        this.group.add(line)
      }
    })
  }

  /**
   * 创建扇形填充多边形（简单扇形三角剖分）
   */
  private createFillPolygonFromRing(ringPoints: THREE.Vector3[]): THREE.Mesh | null {
    if (ringPoints.length < 3) return null

    // 计算质心
    const centroid = new THREE.Vector3()
    ringPoints.forEach(p => centroid.add(p))
    centroid.divideScalar(ringPoints.length)

    // 简单的扇形三角剖分：从质心到每个顶点
    const vertices: number[] = []
    const indices: number[] = []

    // 质心点
    vertices.push(centroid.x, centroid.y, centroid.z)

    // 外环点
    ringPoints.forEach(p => {
      vertices.push(p.x, p.y, p.z)
    })

    // 创建扇形三角形
    for (let i = 1; i <= ringPoints.length; i++) {
      indices.push(0, i, i === ringPoints.length ? 1 : i + 1)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    return new THREE.Mesh(geometry, this.fillMaterial.clone())
  }

  /**
   * 聚焦到某国家 - 只显示该国边界
   */
  public focusCountry(countryName: string): void {
    this.allLines.forEach((line, key) => {
      const isTarget = key.startsWith(countryName + '_')
      ;(line.material as THREE.LineBasicMaterial).opacity = isTarget ? 0.9 : 0.0
    })
  }

  /**
   * 取消聚焦，显示所有边界
   */
  public unfocus(): void {
    this.allLines.forEach((line) => {
      ;(line.material as THREE.LineBasicMaterial).opacity = 0.4
    })
  }

  /**
   * 根据经纬度查找所在国家
   */
  public findCountryAtPoint(lat: number, lon: number): string | null {
    if (!this.geoData) return null

    for (const feature of this.geoData.features) {
      const name = feature.properties?.ADMIN || feature.properties?.name
      if (!name) continue

      const geom = feature.geometry as any
      const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates

      for (const polygon of polygons) {
        for (const ring of polygon) {
          if (this.pointInPolygon(lat, lon, ring)) {
            return name
          }
        }
      }
    }
    return null
  }

  private pointInPolygon(lat: number, lon: number, ring: number[][]): boolean {
    let inside = false
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1]
      const xj = ring[j][0], yj = ring[j][1]

      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    return inside
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
    this.allLines.forEach((line) => {
      line.geometry.dispose()
      ;(line.material as THREE.LineBasicMaterial).dispose()
    })
    this.allLines.clear()

    this.allFills.forEach((mesh) => {
      mesh.geometry.dispose()
      ;(mesh.material as THREE.MeshBasicMaterial).dispose()
    })
    this.allFills.clear()

    this.countryBounds.clear()
    this.scene.remove(this.group)
  }
}
