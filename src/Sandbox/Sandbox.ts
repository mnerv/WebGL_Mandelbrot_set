import { Application, Time, Shader } from 'Engine/Engine'
import {
  VertexBuffer,
  IndexBuffer,
  BufferLayout,
  ArrayBuffer,
} from 'Engine/Buffer'

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

  shader: Shader

  constructor(parent: HTMLDivElement) {
    super(parent)
    this.display.enableAutoResize()

    this.gl = this.display.getContext('webgl') as WebGLRenderingContext
    this.gl.clearColor(0.0, 195 / 255, 255 / 255, 1.0)

    this.shader = new Shader(this.gl, VS_SOURCE, FS_SOURCE)
    this.shader.bind()
    const vb = new VertexBuffer(this.gl, vertices)
    const ib = new IndexBuffer(this.gl, indices)

    const layout = new BufferLayout()
    layout.push(
      3,
      'a_position',
      this.gl.FLOAT,
      false,
      Float32Array.BYTES_PER_ELEMENT
    )
    layout.push(
      4,
      'a_color',
      this.gl.FLOAT,
      false,
      Float32Array.BYTES_PER_ELEMENT
    )
    layout.push(2, 'a_uv', this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT)

    const ab = new ArrayBuffer(this.gl)
    ab.addBuffer(this.shader, vb, ib, layout)

    this.shader.bind()
  }

  update(time: Time): void {}

  render(time: Time): void {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

    this.shader.bind()

    this.gl.drawElements(
      this.gl.TRIANGLES,
      indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    )
  }
}
