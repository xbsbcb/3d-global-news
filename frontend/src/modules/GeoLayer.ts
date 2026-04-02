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

  // 保存所有边界线
  private allLines: Map<string, THREE.Line> = new Map()

  // 国家填充粒子
  private countryFillPoints: THREE.Points | null = null
  private countryFillMaterial: THREE.ShaderMaterial | null = null

  // 保存国家边界框
  private countryBounds: Map<string, CountryBounds> = new Map()

  // 保存所有国家的外环点（用于粒子填充）
  private countryPolygons: Map<string, number[][][]> = new Map()

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
      this.calculateBounds()
      this.drawBoundaries()
      this.createCountryFillParticles()
      console.log('GeoLayer: 加载了', data.features.length, '个国家边界')
    } catch (error) {
      console.warn('GeoJSON 加载失败:', error)
    }
  }

  /**
   * 计算每个国家的边界框，并存储多边形
   */
  private calculateBounds(): void {
    if (!this.geoData) return

    for (const feature of this.geoData.features) {
      const name = feature.properties?.ADMIN || feature.properties?.name
      if (!name) continue

      const geom = feature.geometry as any
      const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates

      // 存储外环多边形（用于粒子填充）
      const outerRing = polygons[0][0]  // 外环
      this.countryPolygons.set(name, outerRing)

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
    coordinates.forEach((ring: any, _ringIndex: number) => {
      // 收集外环点
      const ringPoints: THREE.Vector3[] = []
      ring.forEach((coord: any) => {
        if (coord && coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
          ringPoints.push(this.latLonToVector3(coord[1], coord[0], this.radius + this.OFFSET))
        }
      })

      if (ringPoints.length >= 3) {
        // 绘制边界线（直接贴合球面）
        const closedLinePoints = [...ringPoints, ringPoints[0].clone()]
        const geometry = new THREE.BufferGeometry().setFromPoints(closedLinePoints)
        const line = new THREE.Line(geometry, material)
        this.allLines.set(countryName + '_' + this.allLines.size, line)
        this.group.add(line)
      }
    })
  }

  /**
   * 创建国家填充粒子（差异化的稀疏、明暗、大小）
   */
  private createCountryFillParticles(): void {
    const particleCount = 30000  // 比主例子层稀疏
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    let index = 0
    const countries = Array.from(this.countryPolygons.entries())

    while (index < particleCount && countries.length > 0) {
      // 随机选择一个国家
      const [countryName, polygon] = countries[Math.floor(Math.random() * countries.length)]

      // 在该国家的边界框内生成随机点
      const bounds = this.countryBounds.get(countryName)
      if (!bounds) continue

      const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat)
      const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng)

      // 检查点是否在多边形内
      if (this.pointInPolygon(lat, lng, polygon as unknown as number[][])) {
        const pos = this.latLonToVector3(lat, lng, this.radius)
        positions[index * 3] = pos.x
        positions[index * 3 + 1] = pos.y
        positions[index * 3 + 2] = pos.z

        // 差异化颜色（明暗变化）
        const brightness = 0.4 + Math.random() * 0.3  // 0.4-0.7 的亮度
        colors[index * 3] = brightness * 0.2     // R - 蓝色调
        colors[index * 3 + 1] = brightness * 0.4  // G
        colors[index * 3 + 2] = brightness * 0.8  // B

        // 差异化大小（3-6像素）
        sizes[index] = 3 + Math.random() * 3

        index++
      }
    }

    // 创建着色器材质
    this.countryFillMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;

        void main() {
          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uPixelRatio;
        varying vec3 vColor;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float r = length(center) * 2.0;
          if (r > 1.0) discard;
          float alpha = smoothstep(1.0, 0.5, r) * 0.6;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    this.countryFillPoints = new THREE.Points(geometry, this.countryFillMaterial)
    this.group.add(this.countryFillPoints)
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

    if (this.countryFillPoints) {
      this.countryFillPoints.geometry.dispose()
      this.countryFillMaterial?.dispose()
      this.countryFillPoints = null
    }

    this.countryBounds.clear()
    this.countryPolygons.clear()
    this.scene.remove(this.group)
  }
}
