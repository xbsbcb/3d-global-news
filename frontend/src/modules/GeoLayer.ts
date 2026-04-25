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
   * 切平面（gnomonic）投影做 earcut 三角剖分。
   * 用多边形 3D 质心法向建切平面，对所有尺寸国家有效。
   */
  private createFillMesh(ring3D: THREE.Vector3[], countryName: string): THREE.Mesh {
    // 1. 计算球面质心（归一化 = 向外法向）
    const centroid = new THREE.Vector3()
    ring3D.forEach(v => centroid.add(v))
    centroid.divideScalar(ring3D.length)
    centroid.normalize()

    // 2. 建立切平面局部坐标系
    const forward = centroid
    const worldUp = new THREE.Vector3(0, 1, 0)
    let right = new THREE.Vector3().crossVectors(worldUp, forward)
    if (right.length() < 0.001) right.set(1, 0, 0)
    right.normalize()
    const up = new THREE.Vector3().crossVectors(forward, right)

    // 3. 3D 点投影到切平面 2D 坐标
    const verts2D: number[] = []
    for (const v of ring3D) {
      verts2D.push(v.dot(right), v.dot(up))
    }

    // 4. earcut 三角剖分
    const rawTriangles = earcut(verts2D, undefined, 2)

    // 5. 南极洲的切平面在极点退化，earcut winding 反向，需要翻转
    const needsFlip = countryName === 'Antarctica'
    const triangles = needsFlip
      ? this.flipWinding(rawTriangles)
      : Array.from(rawTriangles)

    // 6. 构建 BufferGeometry
    const positions = new Float32Array(ring3D.length * 3)
    for (let i = 0; i < ring3D.length; i++) {
      positions[i * 3] = ring3D[i].x
      positions[i * 3 + 1] = ring3D[i].y
      positions[i * 3 + 2] = ring3D[i].z
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setIndex(triangles)
    geom.computeVertexNormals()

    return new THREE.Mesh(geom, this.fillMaterial.clone())
  }

  /** 翻转三角形 winding order (a,b,c) → (a,c,b) */
  private flipWinding(indices: Uint32Array | number[]): number[] {
    const out: number[] = []
    for (let i = 0; i < indices.length; i += 3) {
      out.push(indices[i], indices[i + 2], indices[i + 1])
    }
    return out
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
        const fillPoints3D = externalRing.map((pt: any) =>
          this.latLonToVector3(pt[1], pt[0], this.radius + FILL_OFFSET)
        )
        const fillMesh = this.createFillMesh(fillPoints3D, name)
        fillMesh.userData = { country: name, isFill: true }
        this.group.add(fillMesh)

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
