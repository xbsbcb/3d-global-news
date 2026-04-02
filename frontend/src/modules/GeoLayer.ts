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

  // 边界线高度偏移
  private readonly LINE_OFFSET = 2.0
  // 填充高度偏移（边界线略高于填充）
  private readonly FILL_OFFSET = 0.5

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
      // 外环用于绘制填充和边界线
      const points: THREE.Vector3[] = []
      ring.forEach((coord: any) => {
        if (coord && coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
          points.push(this.latLonToVector3(coord[1], coord[0], this.radius + this.FILL_OFFSET))
        }
      })

      if (points.length >= 3) {
        // 1. 绘制填充（使用三角剖分）
        if (ringIndex === 0) {  // 只在外环绘制填充
          const fillMesh = this.createFillPolygon(points)
          if (fillMesh) {
            this.allFills.set(countryName + '_fill_' + this.allFills.size, fillMesh)
            this.group.add(fillMesh)
          }
        }

        // 2. 绘制边界线（稍高）
        const linePoints = points.map(p => {
          const dir = p.clone().normalize()
          return p.clone().add(dir.multiplyScalar(this.LINE_OFFSET))
        })
        // 闭合线条
        const closedLinePoints = [...linePoints, linePoints[0].clone()]
        const geometry = new THREE.BufferGeometry().setFromPoints(closedLinePoints)
        const line = new THREE.Line(geometry, material)
        this.allLines.set(countryName + '_' + this.allLines.size, line)
        this.group.add(line)
      }
    })
  }

  /**
   * 创建填充多边形（贴合球面的三角剖分）
   */
  private createFillPolygon(points: THREE.Vector3[]): THREE.Mesh | null {
    if (points.length < 3) return null

    // 计算几何中心
    const centroid = new THREE.Vector3()
    points.forEach(p => centroid.add(p))
    centroid.divideScalar(points.length)

    // 计算法线方向（指向球心外侧）
    const normal = centroid.clone().normalize()

    // 计算局部坐标系（用于将3D点转换到2D平面）
    const up = new THREE.Vector3(0, 1, 0)
    const tangent = new THREE.Vector3().crossVectors(up, normal).normalize()
    const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize()

    // 将 3D 球面点转换到 2D 平面坐标
    const shapePoints: THREE.Vector2[] = points.map(p => {
      const rel = p.clone().sub(centroid)
      const x = rel.dot(tangent)
      const y = rel.dot(bitangent)
      return new THREE.Vector2(x, y)
    })

    // 使用 ShapeGeometry 进行三角化
    const shape = new THREE.Shape(shapePoints)
    const geometry2D = new THREE.ShapeGeometry(shape)

    // 获取三角化后的顶点索引
    const indices = geometry2D.index ? Array.from(geometry2D.index.array) : []
    const vertices2D = geometry2D.attributes.position.array

    // 创建贴合球面的 3D 顶点
    const vertices3D: number[] = []
    const meshCentroid = centroid.clone().normalize().multiplyScalar(this.radius + this.FILL_OFFSET)

    for (let i = 0; i < vertices2D.length; i += 3) {
      const x = vertices2D[i]
      const y = vertices2D[i + 1]
      // 计算 2D 点对应的 3D 球面点
      // 从质心出发，在切平面上偏移 (x, y)，然后投影到球面
      const dir = meshCentroid.clone()
        .add(tangent.clone().multiplyScalar(x))
        .add(bitangent.clone().multiplyScalar(y))
        .normalize()
        .multiplyScalar(this.radius + this.FILL_OFFSET)
      vertices3D.push(dir.x, dir.y, dir.z)
    }

    // 创建 3D 几何体
    const geometry3D = new THREE.BufferGeometry()
    geometry3D.setAttribute('position', new THREE.Float32BufferAttribute(vertices3D, 3))
    if (indices.length > 0) {
      geometry3D.setIndex(indices)
    }

    const mesh = new THREE.Mesh(geometry3D, this.fillMaterial.clone())
    return mesh
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
