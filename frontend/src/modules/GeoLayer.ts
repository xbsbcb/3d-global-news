import * as THREE from 'three'

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
  isCrossAntimeridian: boolean; // 是否跨越180度经线
}

export class GeoLayer {
  private scene: THREE.Object3D
  private radius: number
  private group: THREE.Group

  private countryMaterial: THREE.LineBasicMaterial
  private highlightMaterial: THREE.LineBasicMaterial

  private countryData: Map<string, {
    bounds: CountryBounds,
    polygons: number[][][] // 简化为 [环][坐标点]
  }> = new Map()

  private highlightedCountry: string | null = null
  private readonly OFFSET = 0.5 // 边界线略高于球面

  constructor(config: GeoLayerConfig) {
    this.scene = config.scene
    this.radius = config.radius

    this.group = new THREE.Group()
    this.scene.add(this.group)

    this.countryMaterial = new THREE.LineBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.5
    })

    this.highlightMaterial = new THREE.LineBasicMaterial({
      color: 0xffcc00,
      linewidth: 2
    })
  }

  /**
   * 核心：经纬度转 3D (保持你原来的投影逻辑)
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
   * 核心：3D 向量转经纬度 (适配自转与偏移)
   */
  public vector3ToLatLon(v: THREE.Vector3): [number, number] {
    // 1. 将世界坐标转为本地坐标，抵消 group 的旋转影响
    const localV = this.group.worldToLocal(v.clone()).normalize()

    // 2. 反算纬度: y = cos(phi)
    const phi = Math.acos(localV.y)
    const lat = 90 - (phi * 180 / Math.PI)

    // 3. 反算经度: x = -sin(phi)cos(theta), z = sin(phi)sin(theta)
    // 根据 atan2(z, -x) 得到 theta
    let theta = Math.atan2(localV.z, -localV.x)
    let lon = (theta * 180 / Math.PI) - 180

    // 4. 标准化经度范围 [-180, 180]
    while (lon <= -180) lon += 360
    while (lon > 180) lon -= 360

    return [lat, lon]
  }

  public async load(): Promise<void> {
    const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
    try {
      const res = await fetch(url)
      const data = await res.json()
      this.parseAndDraw(data.features)
    } catch (e) {
      console.error('GeoData Load Failed', e)
    }
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
        // poly[0] 是外环
        const externalRing = poly[0]
        allRings.push(externalRing)

        externalRing.forEach((pt: any) => {
          const [lng, lat] = pt
          minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat)
          minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng)
        })

        // 绘制边界
        const points = externalRing.map((pt: any) => this.latLonToVector3(pt[1], pt[0], this.radius + this.OFFSET))
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, this.countryMaterial.clone())

        // 将国家名称存入 userData 方便后续遍历
        line.userData = { country: name }
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

  /**
   * 点击检测触发
   * @param worldPoint Raycaster 碰撞得到的交点 (Vector3)
   */
  public onGlobeClick(worldPoint: THREE.Vector3): string | null {
    const [lat, lon] = this.vector3ToLatLon(worldPoint)

    let foundCountry: string | null = null

    for (const [name, data] of this.countryData.entries()) {
      const { bounds, polygons } = data

      // 1. 粗筛 (Bounding Box)
      const inLat = lat >= bounds.minLat && lat <= bounds.maxLat
      let inLng = false
      if (bounds.isCrossAntimeridian) {
        inLng = lon >= bounds.minLng || lon <= bounds.maxLng
      } else {
        inLng = lon >= bounds.minLng && lon <= bounds.maxLng
      }

      if (inLat && inLng) {
        // 2. 精筛 (Point-in-Polygon)
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
      this.highlightCountry(foundCountry)
    } else {
      this.clearHighlight()
    }

    return foundCountry
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
    this.highlightedCountry = name
    this.group.children.forEach(child => {
      if (child instanceof THREE.Line) {
        const isTarget = child.userData.country === name
        const mat = child.material as THREE.LineBasicMaterial
        if (isTarget) {
          mat.color.copy(this.highlightMaterial.color)
          mat.opacity = 1.0
        } else {
          mat.color.set(0x00aaff)
          mat.opacity = 0.1
        }
      }
    })
  }

  public clearHighlight() {
    this.highlightedCountry = null
    this.group.children.forEach(child => {
      if (child instanceof THREE.Line) {
        const mat = child.material as THREE.LineBasicMaterial
        mat.color.set(0x00aaff)
        mat.opacity = 0.5
      }
    })
  }
}