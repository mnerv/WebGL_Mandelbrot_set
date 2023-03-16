export interface BufferElement {
  name: string,
  type: number
}

/* eslint-disable */
/**
 * Stride: 9 * sizeof(f32)
 * Position Offset: 0 * sizeof(f32)
 * Color Offset:    3 * sizeof(f32)
 * UV Offset:       7 * sizeof(f32)
 */
export const QUAD_VERTICES = [
// xyz,             COLORS: RGBA,        UV
  -1.0,  1.0, 0.0,  1.0, 0.0, 0.0, 1.0,  0.0, 1.0,
   1.0,  1.0, 0.0,  0.0, 1.0, 0.0, 1.0,  1.0, 1.0,
   1.0, -1.0, 0.0,  0.0, 0.0, 1.0, 1.0,  1.0, 0.0,
  -1.0, -1.0, 0.0,  1.0, 0.0, 1.0, 1.0,  0.0, 0.0
]

export const QUAD_INDICES = [
  0, 1, 2, // TOP RIGHT TRIANGLE
  0, 2, 3  // BOTTOM LEFT TRIANGLE
]

export const TRIANGLE_VERTICES = [
  -1.0, -1.0,  0.0,  1.0, 0.0, 0.0, 1.0,  0.0, 0.0,
   0.0,  1.0,  0.0,  0.0, 1.0, 0.0, 1.0,  0.5, 1.0,
   1.0, -1.0,  0.0,  0.0, 0.0, 1.0, 1.0,  1.0, 0.0,
]
export const TRIANGLE_INDICES = [0, 1, 2]
/* eslint-enable */

export function shaderCompile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!ok) throw new Error(`${gl.getShaderInfoLog(shader)}`)
  return shader
}

export function shaderProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram {
  const vertexShader = shaderCompile(gl, gl.VERTEX_SHADER, vertex)
  const fragmentShader = shaderCompile(gl, gl.FRAGMENT_SHADER, fragment)
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const ok = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!ok) throw new Error(`${gl.getProgramInfoLog(program)}`)
  return program
}

export class VertexBuffer {
  constructor(private gl: WebGL2RenderingContext, data: Float32Array, layout: BufferElement[]) {
  }
}
