import * as THREE from 'three'
import earcut from 'earcut'

export interface GeoLayerConfig {
  scene: THREE.Object3D
  radius: number
}

interface GeoFeature {
  type: string
  properties: any
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: any[]
  }
}

interface CountryBounds {
  minLat: number; maxLat: number; minLng: number; maxLng: number;
  isCrossAntimeridian: boolean;
}

const BORDER_OFFSET = 0.5
const FILL_OFFSET = 0.35

export class GeoLayer {
  private scene: THREE.Object3D
  private radius: number
  private group: THREE.Group

  private borderMaterial: THREE.LineBasicMaterial
  private highlightBorderMaterial: THREE.LineBasicMaterial

  private fillMaterial: THREE.MeshBasicMaterial
  private fillHighlightMaterial: THREE.MeshBasicMaterial

  private countryData: Map<string, {
    bounds: CountryBounds,
    polygons: number[][][]
  }> = new Map()

  constructor(config: GeoLayerConfig) {
    this.scene = config.scene
    this.radius = config.radius

    this.group = new THREE.Group()
    this.scene.add(this.group)

    this.borderMaterial = new THREE.LineBasicMaterial({
      color: 0x0088cc,
      transparent: true,
      opacity: 0.55
    })

    this.highlightBorderMaterial = new THREE.LineBasicMaterial({
      color: 0xffcc00,
      linewidth: 2
    })

    this.fillMaterial = new THREE.MeshBasicMaterial({
      color: 0x003366,
      transparent: true,
      opacity: 0.25,
      side: THREE.FrontSide,
      depthWrite: false
    })

    this.fillHighlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 0.55,
      side: THREE.FrontSide,
      depthWrite: false
    })
  }

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

  public vector3ToLatLon(v: THREE.Vector3): [number, number] {
    const localV = this.group.worldToLocal(v.clone()).normalize()
    const phi = Math.acos(localV.y)
    const lat = 90 - (phi * 180 / Math.PI)
    let theta = Math.atan2(localV.z, -localV.x)
    let lon = (theta * 180 / Math.PI) - 180
    while (lon <= -180) lon += 360
    while (lon > 180) lon -= 360
    return [lat, lon]
  }

  public async load(): Promise<void> {
    const url = '/countries.geojson'
    try {
      const res = await fetch(url)
      const data = await res.json()
      this.parseAndDraw(data.features)
    } catch (e) {
      console.error('GeoData Load Failed', e)
    }
  }

  /**
   * 用 equirectangular 投影做 earcut 三角剖分，原 3D 坐标构建几何。
   * 对跨大纬度范围（>35°）的多边形按纬度带拆分，各自独立剖分。
   */
  private createFillMeshes(
    ringLatLng: number[][],  // [lng, lat][]
    fillR: number
  ): THREE.Mesh[] {
    const latSpan = this.latRange(ringLatLng)
    if (latSpan > 35) {
      // 按 30° 纬度带拆分
      const bands = this.splitByLatitude(ringLatLng, 30)
      return bands.flatMap(band => this.buildSingleFillMesh(band, fillR))
    }
    return [this.buildSingleFillMesh(ringLatLng, fillR)]
  }

  private latRange(ring: number[][]): number {
    let min = 90, max = -90
    for (const p of ring) { min = Math.min(min, p[1]); max = Math.max(max, p[1]) }
    return max - min
  }

  /** 沿纬度线切割多边形环 */
  private splitByLatitude(ring: number[][], bandSize: number): number[][][] {
    const minLat = Math.min(...ring.map(p => p[1]))
    const maxLat = Math.max(...ring.map(p => p[1]))
    const bands: number[][][] = []

    for (let lo = minLat; lo < maxLat; lo += bandSize) {
      const hi = lo + bandSize
      const clipped = this.clipRingToLatBand(ring, lo, hi)
      if (clipped && clipped.length >= 3) bands.push(clipped)
    }
    return bands.length > 0 ? bands : [ring]
  }

  /** Sutherland-Hodgman 裁剪到 [latLo, latHi] */
  private clipRingToLatBand(ring: number[][], latLo: number, latHi: number): number[][] | null {
    let result = ring
    result = this.clipEdge(result, true, latLo)   // 裁下界
    result = this.clipEdge(result, false, latHi)  // 裁上界
    if (result.length < 3) return null

    // 封闭多边形：确保首尾相连
    if (result[0][0] !== result[result.length - 1][0] ||
        result[0][1] !== result[result.length - 1][1]) {
      result.push([result[0][0], result[0][1]])
    }
    return result
  }

  /** 沿一条纬度线裁剪多边形，keepAbove=true 保留上方（lat > boundary） */
  private clipEdge(ring: number[][], keepAbove: boolean, boundary: number): number[][] {
    const out: number[][] = []
    for (let i = 0; i < ring.length; i++) {
      const curr = ring[i]
      const prev = ring[i === 0 ? ring.length - 1 : i - 1]
      const currInside = keepAbove ? curr[1] >= boundary : curr[1] <= boundary
      const prevInside = keepAbove ? prev[1] >= boundary : prev[1] <= boundary

      if (currInside) {
        if (!prevInside) {
          out.push(this.intersectLat(prev, curr, boundary))
        }
        out.push([curr[0], curr[1]])
      } else if (prevInside) {
        out.push(this.intersectLat(prev, curr, boundary))
      }
    }
    return out
  }

  /** 计算线段与纬度线的交点 */
  private intersectLat(a: number[], b: number[], targetLat: number): number[] {
    const t = (targetLat - a[1]) / (b[1] - a[1])
    return [a[0] + t * (b[0] - a[0]), targetLat]
  }

  /** 构建单个填充 Mesh */
  private buildSingleFillMesh(ringLatLng: number[][], fillR: number): THREE.Mesh {
    // 1. 处理跨 180° 经线：把负经度全部 +360
    const lngs = ringLatLng.map(p => p[0])
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
    const crossesAM = maxLng - minLng > 180

    const normalized = ringLatLng.map(p => {
      const lng = crossesAM && p[0] < 0 ? p[0] + 360 : p[0]
      return [lng, p[1]] as [number, number]
    })

    // 2. equirectangular 投影作为 earcut 2D 输入
    const avgLat = (Math.min(...ringLatLng.map(p => p[1])) + Math.max(...ringLatLng.map(p => p[1]))) / 2
    const cosLat = Math.cos(avgLat * Math.PI / 180)
    const verts2D: number[] = []
    for (const [lng, lat] of normalized) {
      verts2D.push(lng * cosLat, lat)
    }

    // 3. earcut 三角剖分
    const triangles = earcut(verts2D, undefined, 2)

    // 4. 3D 坐标（注意 ringLatLng 格式是 [lng, lat]）
    const ring3D = ringLatLng.map(([lng, lat]) =>
      this.latLonToVector3(lat, lng, fillR)
    )

    const positions = new Float32Array(ring3D.length * 3)
    for (let i = 0; i < ring3D.length; i++) {
      positions[i * 3] = ring3D[i].x
      positions[i * 3 + 1] = ring3D[i].y
      positions[i * 3 + 2] = ring3D[i].z
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setIndex(Array.from(triangles))
    geom.computeVertexNormals()

    return new THREE.Mesh(geom, this.fillMaterial.clone())
  }

  private parseAndDraw(features: GeoFeature[]) {
    features.forEach(feature => {
      const name = feature.properties?.ADMIN || feature.properties?.name || 'Unknown'
      const coords = feature.geometry.coordinates
      const type = feature.geometry.type

      const polygons = type === 'Polygon' ? [coords] : coords
      const allRings: number[][][] = []

      let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180

      polygons.forEach((poly: any) => {
        const externalRing = poly[0] as number[][]
        allRings.push(externalRing)

        // 收集边界包围盒
        externalRing.forEach((pt: any) => {
          const [lng, lat] = pt
          minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat)
          minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng)
        })

        // --- 填充面 ---
        const meshes = this.createFillMeshes(externalRing, this.radius + FILL_OFFSET)
        meshes.forEach(m => {
          m.userData = { country: name, isFill: true }
          this.group.add(m)
        })

        // --- 边界线 ---
        const linePoints = externalRing.map((pt: any) =>
          this.latLonToVector3(pt[1], pt[0], this.radius + BORDER_OFFSET)
        )
        const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints)
        const line = new THREE.Line(lineGeom, this.borderMaterial.clone())
        line.userData = { country: name, isBorder: true }
        this.group.add(line)
      })

      this.countryData.set(name, {
        bounds: {
          minLat, maxLat, minLng, maxLng,
          isCrossAntimeridian: (maxLng - minLng > 180)
        },
        polygons: allRings
      })
    })
  }

  public onGlobeClick(worldPoint: THREE.Vector3): string | null {
    const [lat, lon] = this.vector3ToLatLon(worldPoint)
    let foundCountry: string | null = null

    for (const [name, data] of this.countryData.entries()) {
      const { bounds, polygons } = data

      const inLat = lat >= bounds.minLat && lat <= bounds.maxLat
      let inLng = false
      if (bounds.isCrossAntimeridian) {
        inLng = lon >= bounds.minLng || lon <= bounds.maxLng
      } else {
        inLng = lon >= bounds.minLng && lon <= bounds.maxLng
      }

      if (inLat && inLng) {
        for (const ring of polygons) {
          if (this.isPointInPoly(lon, lat, ring)) {
            foundCountry = name
            break
          }
        }
      }
      if (foundCountry) break
    }

    if (foundCountry) {
      foundCountry = this.normalizeCountryName(foundCountry)
      this.highlightCountry(foundCountry)
    } else {
      this.clearHighlight()
    }
    return foundCountry
  }

  private normalizeCountryName(name: string): string {
    const taiwanNames = ['Taiwan', 'Republic of China', 'ROC', 'Taiwan Province', 'Taiwan, Province of China']
    if (taiwanNames.some(n => name.toLowerCase().includes(n.toLowerCase()))) {
      return 'China'
    }
    return name
  }

  private isPointInPoly(lng: number, lat: number, ring: number[][]): boolean {
    let inside = false
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1]
      const xj = ring[j][0], yj = ring[j][1]
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi + 0.000000001) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  public highlightCountry(name: string) {
    const chinaRelated = ['China', 'Taiwan', 'Hong Kong', 'Macau', 'Macao']

    this.group.children.forEach(child => {
      const country = child.userData.country as string
      const isTarget = country === name || (name === 'China' && chinaRelated.includes(country))

      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshBasicMaterial
        if (isTarget) {
          mat.color.copy(this.fillHighlightMaterial.color)
          mat.opacity = this.fillHighlightMaterial.opacity
        } else {
          mat.color.copy(this.fillMaterial.color)
          mat.opacity = 0.06
        }
      } else if (child instanceof THREE.Line) {
        const mat = child.material as THREE.LineBasicMaterial
        if (isTarget) {
          mat.color.copy(this.highlightBorderMaterial.color)
          mat.opacity = 1.0
        } else {
          mat.color.set(0x0088cc)
          mat.opacity = 0.08
        }
      }
    })
  }

  public clearHighlight() {
    this.group.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshBasicMaterial
        mat.color.copy(this.fillMaterial.color)
        mat.opacity = this.fillMaterial.opacity
      } else if (child instanceof THREE.Line) {
        const mat = child.material as THREE.LineBasicMaterial
        mat.color.set(0x0088cc)
        mat.opacity = 0.55
      }
    })
  }

  public dispose() {
    this.scene.remove(this.group)
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose())
        } else if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    })
  }
}
