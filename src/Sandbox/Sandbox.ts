import { Application, Time } from 'Engine/Engine'

import FS_SOURCE from 'Assets/Shaders/basic.10.frag'
import VS_SOURCE from 'Assets/Shaders/basic.10.vert'

// prettier-ignore
const vertices = [
// POSITIONS: xyz,  COLORS: RGBA,        UV
  -1.0,  1.0, 0.0,  1.0, 0.0, 0.0, 1.0,  0.0, 1.0,
   1.0,  1.0, 0.0,  0.0, 1.0, 0.0, 1.0,  1.0, 1.0,
   1.0, -1.0, 0.0,  0.0, 0.0, 1.0, 1.0,  1.0, 0.0,
  -1.0, -1.0, 0.0,  1.0, 0.0, 1.0, 1.0,  0.0, 0.0
]

// prettier-ignore
const indices = [
  0, 1, 2, // TOP RIGHT TRIANGLE
  0, 2, 3  // BOTTOM LEFT TRIANGLE
]

export class Sandbox extends Application {
  private gl: WebGLRenderingContext

  constructor(parent?: HTMLDivElement) {
    super(parent)
    this.display.enableAutoResize()

    this.gl = this.display.getContext('webgl') as WebGLRenderingContext
    this.gl.clearColor(0.0, 195 / 255, 255 / 255, 1.0)

    const vs = this.gl.createShader(this.gl.VERTEX_SHADER) as WebGLShader
    this.gl.shaderSource(vs, VS_SOURCE)
    this.gl.compileShader(vs)
    if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(vs)
      throw new Error(
        'Error compiling shaders: ' + this.gl.getShaderInfoLog(vs)
      )
    }

    const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER) as WebGLShader
    this.gl.shaderSource(fs, FS_SOURCE)
    this.gl.compileShader(fs)
    if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(fs)
      throw new Error(
        'Error compiling shaders: ' + this.gl.getShaderInfoLog(fs)
      )
    }

    const sp = this.gl.createProgram() as WebGLProgram
    this.gl.attachShader(sp, vs)
    this.gl.attachShader(sp, fs)
    this.gl.linkProgram(sp)
    if (!this.gl.getProgramParameter(sp, this.gl.LINK_STATUS)) {
      throw new Error(
        'Unable to initialize the shader program: ' +
          this.gl.getProgramInfoLog(sp)
      )
    }

    const vb = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vb)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    )

    const pal = this.gl.getAttribLocation(sp, 'a_position') // Position Atttribute Location
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vb)
    this.gl.vertexAttribPointer(
      pal,
      3,
      this.gl.FLOAT,
      false,
      9 * Float32Array.BYTES_PER_ELEMENT,
      0 * Float32Array.BYTES_PER_ELEMENT
    )
    this.gl.enableVertexAttribArray(pal)

    const ib = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ib)
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    )

    const cal = this.gl.getAttribLocation(sp, 'a_color') // Color Attribute Location
    this.gl.vertexAttribPointer(
      cal,
      4,
      this.gl.FLOAT,
      false,
      9 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    )
    this.gl.enableVertexAttribArray(cal)

    const uval = this.gl.getAttribLocation(sp, 'a_uv') // UV Attribute Location
    this.gl.vertexAttribPointer(
      uval,
      2,
      this.gl.FLOAT,
      false,
      9 * Float32Array.BYTES_PER_ELEMENT,
      7 * Float32Array.BYTES_PER_ELEMENT
    )
    this.gl.enableVertexAttribArray(uval)

    this.gl.useProgram(sp)
  }

  update(time: Time): void {}

  render(time: Time): void {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

    this.gl.drawElements(
      this.gl.TRIANGLES,
      indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    )
  }
}
