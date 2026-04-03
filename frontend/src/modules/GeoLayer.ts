/**
 * GeoLayer - 地理边界模块
 * 负责解析 GeoJSON，生成国家边界线
 * 支持点击国家高亮显示
 */

import * as THREE from 'three'

export interface GeoLayerConfig {
  scene: THREE.Object3D
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

  // 保存所有边界线
  private allLines: Map<string, THREE.Line> = new Map()

  // 保存国家边界框
  private countryBounds: Map<string, CountryBounds> = new Map()

  // 保存每个国家的多边形环（用于检测）
  private countryPolygons: Map<string, number[][][]> = new Map()

  // 高亮相关
  private highlightedCountry: string | null = null
  private highlightColor = new THREE.Color(0xff6600)  // 橙色高亮
  private normalColor = new THREE.Color(0x00aaff)    // 普通蓝色

  // 边界线高度偏移
  private readonly OFFSET = 0.2

  constructor(config: GeoLayerConfig) {
    this.scene = config.scene
    this.radius = config.radius

    this.countryMaterial = new THREE.LineBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.4
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
      this.parseCountryData()
      this.drawBoundaries()
      console.log('GeoLayer: 加载了', data.features.length, '个国家边界')
    } catch (error) {
      console.warn('GeoJSON 加载失败:', error)
    }
  }

  /**
   * 解析国家数据
   */
  private parseCountryData(): void {
    if (!this.geoData) return

    for (const feature of this.geoData.features) {
      const name = feature.properties?.ADMIN || feature.properties?.name
      if (!name) continue

      const geom = feature.geometry as any
      const polygons: number[][][][] = geom.type === 'Polygon'
        ? [geom.coordinates]
        : geom.coordinates

      // 收集所有环
      const allRings: number[][][] = []
      let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180

      for (const polygon of polygons) {
        for (const ring of polygon) {
          allRings.push(ring)
          for (const coord of ring) {
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

      this.countryBounds.set(name, { minLat, maxLat, minLng, maxLng })
      this.countryPolygons.set(name, allRings)
    }
  }

  /**
   * 获取国家的边界框
   */
  public getCountryBounds(countryName: string): CountryBounds | null {
    return this.countryBounds.get(countryName) || null
  }

  /**
   * 绘制所有边界线
   */
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

  /**
   * 绘制多边形边界线
   */
  private drawPolygon(coordinates: number[][][], material: THREE.LineBasicMaterial, countryName: string): void {
    for (const ring of coordinates) {
      const ringPoints: THREE.Vector3[] = []
      for (const coord of ring) {
        if (coord && coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
          ringPoints.push(this.latLonToVector3(coord[1], coord[0], this.radius + this.OFFSET))
        }
      }

      if (ringPoints.length >= 3) {
        const closedLinePoints = [...ringPoints, ringPoints[0].clone()]
        const geometry = new THREE.BufferGeometry().setFromPoints(closedLinePoints)
        const line = new THREE.Line(geometry, material)
        this.allLines.set(countryName + '_' + this.allLines.size, line)
        this.group.add(line)
      }
    }
  }

  /**
   * 点是否在多边形内 - ray casting
   * @param lng 经度
   * @param lat 纬度
   * @param ring GeoJSON格式 [lng, lat][]
   */
  private pointInPolygon(lng: number, lat: number, ring: number[][]): boolean {
    let inside = false
    const n = ring.length

    for (let i = 0, j = n - 1; i < n; j = i++) {
      // ring[i][0] = lng, ring[i][1] = lat (GeoJSON格式)
      const xi = ring[i][0], yi = ring[i][1]
      const xj = ring[j][0], yj = ring[j][1]

      // 标准 ray casting 算法
      if (((yi > lat) !== (yj > lat)) &&
          (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
        inside = !inside
      }
    }

    return inside
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
      const polygons: number[][][][] = geom.type === 'Polygon'
        ? [geom.coordinates]
        : geom.coordinates

      for (const polygon of polygons) {
        for (const ring of polygon) {
          // GeoJSON: ring[i] = [lng, lat]
          if (this.pointInPolygon(lon, lat, ring)) {
            return name
          }
        }
      }
    }
    return null
  }

  /**
   * 测试 pointInPolygon 算法
   */
  public testPointInPolygon(): void {
    // 测试1: 原点应该在的简单正方形内
    // 正方形: 0,0 到 10,10
    const square = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]

    const inside = this.pointInPolygon(5, 5, square)  // 注意: lng=5, lat=5
    const outside = this.pointInPolygon(15, 15, square)

    console.log('pointInPolygon test:')
    console.log('  (5, 5) inside square? ', inside, '(expected: true)')
    console.log('  (15, 15) inside square? ', outside, '(expected: false)')

    // 测试2: 中国大致范围
    const chinaApprox = [[73, 3], [135, 3], [135, 54], [73, 54], [73, 3]]
    const beijing = this.pointInPolygon(116, 40, chinaApprox)  // 北京
    const notChina = this.pointInPolygon(-50, -50, chinaApprox)  // 南美

    console.log('  Beijing (116, 40) in China approx? ', beijing, '(expected: true)')
    console.log('  South America (-50, -50) in China approx? ', notChina, '(expected: false)')
  }

  /**
   * 高亮显示国家 - 直接改变边界线颜色
   */
  public highlightCountry(countryName: string): void {
    // 点击同一国家取消高亮
    if (this.highlightedCountry === countryName) {
      this.clearHighlight()
      return
    }

    this.clearHighlight()
    this.highlightedCountry = countryName

    // 高亮目标国家边界线
    this.allLines.forEach((line, key) => {
      const isTarget = key.startsWith(countryName + '_')
      const mat = line.material as THREE.LineBasicMaterial

      if (isTarget) {
        mat.color.copy(this.highlightColor)
        mat.opacity = 1.0
      } else {
        mat.opacity = 0.15
      }
    })
  }

  /**
   * 清除高亮
   */
  public clearHighlight(): void {
    if (this.highlightedCountry === null) return

    this.allLines.forEach((line) => {
      const mat = line.material as THREE.LineBasicMaterial
      mat.color.copy(this.normalColor)
      mat.opacity = 0.4
    })

    this.highlightedCountry = null
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
    this.clearHighlight()

    this.allLines.forEach((line) => {
      line.geometry.dispose()
      ;(line.material as THREE.LineBasicMaterial).dispose()
    })
    this.allLines.clear()

    this.countryBounds.clear()
    this.countryPolygons.clear()
    this.scene.remove(this.group)
  }
}
