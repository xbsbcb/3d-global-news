/**
 * Canvas Mock Setup for Vitest
 * Provides WebGL context mock for Three.js testing
 */

// Create a mock WebGL context
function createMockWebGLContext(): WebGLRenderingContext {
  return {
    canvas: null as any,
    drawingBufferWidth: 800,
    drawingBufferHeight: 600,
    clear: () => {},
    clearColor: () => {},
    clearDepth: () => {},
    clearStencil: () => {},
    enable: () => {},
    disable: () => {},
    depthFunc: () => {},
    viewport: () => {},
    createShader: () => ({ type: 0, source: '', deleteShader: () => {}, getShaderParameter: () => 0 }),
    createProgram: () => ({
      attachShader: () => {},
      link: () => {},
      useProgram: () => {},
      deleteProgram: () => {},
      getProgramParameter: () => 0,
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
    }),
    getShaderParameter: () => 0,
    getProgramParameter: () => 0,
    getAttribLocation: () => 0,
    getUniformLocation: () => ({}),
    uniform1f: () => {},
    uniform1i: () => {},
    uniform2f: () => {},
    uniform3f: () => {},
    uniform4f: () => {},
    uniformMatrix4fv: () => {},
    vertexAttribPointer: () => {},
    enableVertexAttribArray: () => {},
    disableVertexAttribArray: () => {},
    createBuffer: () => ({}),
    bindBuffer: () => {},
    bufferData: () => {},
    createFramebuffer: () => ({}),
    bindFramebuffer: () => {},
    createRenderbuffer: () => ({}),
    bindRenderbuffer: () => {},
    renderbufferStorage: () => {},
    framebufferRenderbuffer: () => {},
    createTexture: () => ({}),
    bindTexture: () => {},
    texImage2D: () => {},
    texParameteri: () => {},
    drawArrays: () => {},
    drawElements: () => {},
    flush: () => {},
    finish: () => {},
    deleteShader: () => {},
    deleteProgram: () => {},
    deleteBuffer: () => {},
    deleteFramebuffer: () => {},
    deleteRenderbuffer: () => {},
    deleteTexture: () => {},
    getExtension: () => null,
    getContextAttributes: () => null,
    isContextLost: () => false,
    getSupportedExtensions: () => [],
    // Required for Three.js
    getShaderPrecisionFormat: () => ({ precision: 1, rangeMin: 1, rangeMax: 1 }),
  } as unknown as WebGLRenderingContext
}

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = function(contextType: string, ...args: any[]) {
  if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl') {
    return createMockWebGLContext()
  }
  return null
}

// Mock WebGLRenderingContext constants
const WebGLRenderingContext = {
  POINTS: 0x0000,
  LINES: 0x0001,
  LINE_LOOP: 0x0002,
  LINE_STRIP: 0x0003,
  TRIANGLES: 0x0004,
  TRIANGLE_STRIP: 0x0005,
  TRIANGLE_FAN: 0x0006,
  ZERO: 0,
  ONE: 1,
  SRC_ALPHA: 0x0302,
  ONE_MINUS_SRC_ALPHA: 0x0303,
  DST_ALPHA: 0x0304,
  ONE_MINUS_DST_ALPHA: 0x0305,
  CONSTANT_COLOR: 0x8001,
  ONE_MINUS_CONSTANT_COLOR: 0x8002,
  CONSTANT_ALPHA: 0x8003,
  ONE_MINUS_CONSTANT_ALPHA: 0x8004,
  DEPTH_TEST: 0x0B71,
  BLEND: 0x0BE2,
  VERTEX_SHADER: 0x8B31,
  FRAGMENT_SHADER: 0x8B30,
  COMPILE_STATUS: 0x8B81,
  LINK_STATUS: 0x8B82,
  ARRAY_BUFFER: 0x8892,
  ELEMENT_ARRAY_BUFFER: 0x8893,
  STATIC_DRAW: 0x88E4,
  DYNAMIC_DRAW: 0x88E8,
  FLOAT: 0x1406,
} as const

// Make it available globally for Three.js
;(globalThis as any).WebGLRenderingContext = WebGLRenderingContext
