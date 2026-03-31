/**
 * DataLayer - 数据图层模块
 * 负责管理热力图粒子、连接弧线（Fly Lines）
 */

import * as THREE from 'three'

export interface NewsPoint {
  id: string
  lat: number
  lng: number
  title: string
  category: string
  value?: number
}

export interface DataLayerConfig {
  scene: THREE.Scene
  radius: number
}

export class DataLayer {
  private scene: THREE.Scene
  private radius: number
  private group: THREE.Group
  private flyLines: THREE.Line[] = []
  private heatPointsMesh: THREE.InstancedMesh | null = null

  constructor(config: DataLayerConfig) {
    this.scene = config.scene
    this.radius = config.radius
    this.group = new THREE.Group()
    this.scene.add(this.group)
  }

  /**
   * 经纬度转 3D 坐标
   */
  private latLonToVector3(lat: number, lng: number, r?: number): THREE.Vector3 {
    const radius = r ?? this.radius
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )
  }

  /**
   * 创建热力图点
   */
  public createHeatmapPoints(dataArray: NewsPoint[]): void {
    if (this.heatPointsMesh) {
      this.scene.remove(this.heatPointsMesh)
      this.heatPointsMesh.geometry.dispose()
    }

    const count = dataArray.length
    const geometry = new THREE.CircleGeometry(0.5, 12)

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexColors: true
    })

    this.heatPointsMesh = new THREE.InstancedMesh(geometry, material, count)

    const dummyMatrix = new THREE.Object3D()
    const colors = new Float32Array(count * 3)
    const colorTool = new THREE.Color()

    dataArray.forEach((item, i) => {
      const pos = this.latLonToVector3(item.lat, item.lng, this.radius + 0.5)
      dummyMatrix.position.copy(pos)
      dummyMatrix.lookAt(new THREE.Vector3(0, 0, 0))

      const scale = 1.0 + (item.value ?? 1) * 3.0
      dummyMatrix.scale.set(scale, scale, 1)
      dummyMatrix.updateMatrix()

      this.heatPointsMesh!.setMatrixAt(i, dummyMatrix.matrix)

      // 颜色映射：蓝 -> 黄 -> 红
      const hue = 0.6 - (item.value ?? 0.5) * 0.6
      colorTool.setHSL(Math.max(0, hue), 1.0, 0.5)
      colors[i * 3] = colorTool.r
      colors[i * 3 + 1] = colorTool.g
      colors[i * 3 + 2] = colorTool.b
    })

    this.heatPointsMesh.geometry.setAttribute(
      'instanceColor',
      new THREE.InstancedBufferAttribute(colors, 3)
    )
    this.group.add(this.heatPointsMesh)
  }

  /**
   * 添加飞线
   */
  public addFlyLine(start: NewsPoint, end: NewsPoint, color: number = 0xffaa00): void {
    const vStart = this.latLonToVector3(start.lat, start.lng)
    const vEnd = this.latLonToVector3(end.lat, end.lng)

    // 贝塞尔曲线控制点
    const vCenter = vStart.clone()
      .add(vEnd)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(this.radius * 1.5)

    const curve = new THREE.QuadraticBezierCurve3(vStart, vCenter, vEnd)
    const points = curve.getPoints(100)

    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // 流动进度属性
    const percents = new Float32Array(points.length)
    for (let i = 0; i < points.length; i++) {
      percents[i] = i / points.length
    }
    geometry.setAttribute('aPercent', new THREE.BufferAttribute(percents, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uLength: { value: 0.15 }
      },
      vertexShader: `
        attribute float aPercent;
        varying float vPercent;
        void main() {
          vPercent = aPercent;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uLength;
        varying float vPercent;
        void main() {
          float head = fract(uTime * 0.3);
          float opacity = 0.0;

          if (vPercent > head - uLength && vPercent < head) {
            opacity = (vPercent - (head - uLength)) / uLength;
          }

          gl_FragColor = vec4(uColor, opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    })

    const line = new THREE.Line(geometry, material)
    this.group.add(line)
    this.flyLines.push(line)
  }

  /**
   * 清除所有飞线
   */
  public clearConnections(): void {
    this.flyLines.forEach(line => {
      line.geometry.dispose()
      if (line.material instanceof THREE.Material) {
        line.material.dispose()
      }
      this.group.remove(line)
    })
    this.flyLines = []
  }

  /**
   * 更新动画
   */
  public update(time: number): void {
    this.flyLines.forEach(line => {
      const mat = line.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = time
    })
  }

  /**
   * 显示/隐藏热力图
   */
  public showHeatmap(visible: boolean): void {
    if (this.heatPointsMesh) {
      this.heatPointsMesh.visible = visible
    }
  }

  public dispose(): void {
    this.clearConnections()
    if (this.heatPointsMesh) {
      this.heatPointsMesh.geometry.dispose()
      this.scene.remove(this.heatPointsMesh)
    }
    this.scene.remove(this.group)
  }
}
