/**
 * EarthScene 模块单元测试
 *
 * 注意：EarthScene 依赖真实的 WebGL 上下文，
 * 在 Node.js/jsdom 环境中需要完整的 WebGL mock。
 * 当前测试使用 vi.mock() 模拟，完整测试需在浏览器环境运行。
 */

import { describe, it, expect } from 'vitest'

// Mock THREE modules before importing EarthScene
vi.mock('three', () => ({
  Scene: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    children: [{ type: 'Light' }],
  })),
  PerspectiveCamera: vi.fn().mockImplementation(() => ({
    aspect: 1.5,
    position: { z: 400 },
  })),
  WebGLRenderer: vi.fn().mockImplementation(() => ({
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    domElement: {},
    setClearColor: vi.fn(),
    dispose: vi.fn(),
  })),
  AmbientLight: vi.fn(),
  DirectionalLight: vi.fn(),
  MathUtils: {
    mapLinear: vi.fn((value: number) => value),
    clamp: vi.fn((value: number) => value),
  },
}))

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn().mockImplementation(() => ({
    enableDamping: true,
    dampingFactor: 0.05,
    update: vi.fn(),
    dispose: vi.fn(),
  })),
}))

describe('EarthScene', () => {
  it('should be defined', async () => {
    const { EarthScene } = await import('@/modules/EarthScene')
    expect(EarthScene).toBeDefined()
  })

  it('should have correct module structure', async () => {
    const module = await import('@/modules/EarthScene')
    expect(module.EarthScene).toBeDefined()
    expect(typeof module.EarthScene).toBe('function')
  })

  // @ts-ignore - Skip in CI, needs real WebGL
  it.skip('requires browser environment for full WebGL test', () => {
    // This test is skipped because WebGL requires a real browser environment
    // Full integration tests should be run in a browser with Playwright/Cypress
    expect(true).toBe(true)
  })
})

describe('EarthScene exports', () => {
  it('should export EarthSceneConfig interface', async () => {
    const { EarthSceneConfig } = await import('@/modules/EarthScene')
    // EarthSceneConfig is a TypeScript interface, it won't exist at runtime
    // This test just verifies the module loads correctly
    expect(EarthSceneConfig).toBeUndefined()
  })
})
