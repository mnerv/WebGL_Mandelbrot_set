import { MandelbrotProps } from 'Sandbox/Props'
import {
  Application,
  Time,
  Shader,
  VertexBuffer,
  IndexBuffer,
  BufferLayout,
  ArrayBuffer,
} from 'Engine/Engine'

import VS_Source from 'Assets/Shaders/basic.10.vert'
import Mandelbrot_Source from 'Assets/Shaders/mandelbrot.10.frag'

import { Input } from 'Sandbox/Input'

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

  input: Input

  scaleSpeed: number = 1

  resetTimer: number = 0
  private ResetTime: number = 2000 // ms

  private mandelbrotProp: MandelbrotProps

  constructor(parent: HTMLDivElement) {
    super(parent)
    this.display.setResolution(0.25)

    this.input = new Input()
    this.input.registerKeyEvents()
    this.input.registerMouseEvents()

    this.gl = this.display.getContext('webgl') as WebGLRenderingContext
    this.gl.clearColor(0.0, 195 / 255, 255 / 255, 1.0)

    this.shader = new Shader(this.gl, VS_Source, Mandelbrot_Source)
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

    this.mandelbrotProp = new MandelbrotProps()

    this.shader.setUniform1f('u_radius', this.mandelbrotProp.radius)
    // this.shader.setUniform1i('u_julia', 1)
    // this.shader.setUniform2f('u_c')
    this.shader.bind()
  }

  update(time: Time): void {
    if (this.input.Left) this.mandelbrotProp.moveLeft()
    else if (this.input.Right) this.mandelbrotProp.moveRight()
    else {
      this.mandelbrotProp.stopLeftRight()
    }

    if (this.input.Up) this.mandelbrotProp.moveUp()
    else if (this.input.Down) this.mandelbrotProp.moveDown()
    else {
      this.mandelbrotProp.stopUpDown()
    }

    if (this.input.ZoomIn) {
      this.mandelbrotProp.scale[0] -= this.scaleSpeed * time.SElapsed
      this.mandelbrotProp.scale[1] -= this.scaleSpeed * time.SElapsed
    } else if (this.input.ZoomOut) {
      this.mandelbrotProp.scale[0] += this.scaleSpeed * time.SElapsed
      this.mandelbrotProp.scale[1] += this.scaleSpeed * time.SElapsed
    } else if (this.input.IsRolling) {
      this.mandelbrotProp.scale[0] +=
        this.scaleSpeed * -this.input.WheelDY * 0.25 * time.SElapsed
      this.mandelbrotProp.scale[1] +=
        this.scaleSpeed * -this.input.WheelDY * 0.25 * time.SElapsed

      this.input.IsRolling = !this.input.IsRolling
    }

    if (this.input.RotateAnti) {
      this.mandelbrotProp.rotation -= Math.PI / 60
    } else if (this.input.RotateClock) {
      this.mandelbrotProp.rotation += Math.PI / 60
    }

    if (this.input.Reset) {
      this.resetTimer += time.Elapsed
      if (this.resetTimer >= this.ResetTime) {
        if (this.input.ResetPosition) this.mandelbrotProp.resetPosition()
        if (this.input.ResetRotation) this.mandelbrotProp.resetRotation()
        if (this.input.ResetScale) this.mandelbrotProp.resetZoom()
        if (this.input.ResetAll) this.mandelbrotProp.reset()
      }
    } else {
      this.resetTimer = 0
    }

    if (this.input.LeftButton) {
    }

    this.mandelbrotProp.update(time)

    this.shader.setUniform2fv('u_scale', this.mandelbrotProp.realScale)
    this.shader.setUniform2fv('u_position', this.mandelbrotProp.realPosition)
    // this.shader.setUniform2fv('u_c', this.mandelbrotProp.realPosition)
    this.shader.setUniform1f('u_rotation', this.mandelbrotProp.realRotation)
  }

  render(time: Time): void {
    this.gl.viewport(0, 0, this.display.width, this.display.height)

    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

    this.shader.setUniform2f(
      'u_resolution',
      this.display.width,
      this.display.height
    )
    this.shader.setUniform1f('u_time', time.STotal)
    this.shader.bind()

    this.gl.drawElements(
      this.gl.TRIANGLES,
      indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    )
  }
}
