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

export class FrameBuffer {
  constructor(private gl: WebGL2RenderingContext, width: number, height: number) {
    this.buffer = gl.createFramebuffer()
    this.target = gl.createTexture()

    this.bindTarget()
    // Texture parameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    this.bind()
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.target, 0)
    this.resize(width, height)
  }

  getSize() { return [this.width, this.height] }
  getWidth() { return this.width }
  getHeight() { return this.height }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.bindTarget()
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null)
    this.unbindTarget()
  }

  bind() {
    this.unbindTarget()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer)
  }

  unbind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  bindTarget(slot = 0) {
    this.gl.activeTexture(this.gl.TEXTURE0 + slot)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.target)
  }
  unbindTarget() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  private buffer: WebGLFramebuffer
  private target: WebGLTexture
  private width: number
  private height: number
}
