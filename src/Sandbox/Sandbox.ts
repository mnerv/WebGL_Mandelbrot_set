import { InputModel } from 'Sandbox/InputModel'
import {
  Application,
  Time,
  Shader,
  VertexBuffer,
  IndexBuffer,
  BufferLayout,
  ArrayBuffer,
  Texture,
  FrameBuffer,
} from 'Engine/Engine'

import VS_Source from 'Assets/Shaders/basic.10.vert'
import Mandelbrot_Source from 'Assets/Shaders/mandelbrot.10.frag'
// import Color_Source from 'Assets/Shaders/color.10.frag'
import Texture_Source from 'Assets/Shaders/texture.10.frag'

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
  textureShader: Shader

  input: Input

  scaleSpeed: number = 1

  resetTimer: number = 0
  private RESET_TIME: number = 1500 // ms
  private inputModel: InputModel

  private targetTexture: Texture
  private frameBuffer: FrameBuffer

  constructor(parent: HTMLDivElement) {
    super(parent)

    this.input = new Input()

    this.inputModel = new InputModel()

    this.display.setResolution(this.inputModel.resolution)

    this.input.registerKeyEvents()
    this.input.registerTouchEvents(this.display.canvas)
    this.input.registerMouseEvents(this.display.canvas)

    this.gl = this.display.getWebGLContext()
    this.gl.clearColor(0.0, 195 / 255, 255 / 255, 1.0)

    this.textureShader = new Shader(this.gl, VS_Source, Texture_Source)
    this.shader = new Shader(this.gl, VS_Source, Mandelbrot_Source)
    this.shader.bind()
    const vb = new VertexBuffer(this.gl, vertices)
    const ib = new IndexBuffer(this.gl, indices)

    const layout = new BufferLayout()
    layout.push(3, 'a_position', this.gl.FLOAT, false)
    layout.push(4, 'a_color', this.gl.FLOAT, false)
    layout.push(2, 'a_uv', this.gl.FLOAT, false)

    const ab = new ArrayBuffer(this.gl)
    ab.addBuffer(this.shader, vb, layout)

    this.inputModel.radius = 2
    this.shader.setUniform1f('u_radius', this.inputModel.radius)
    this.shader.setUniform1i('u_frac', 0)
    // this.shader.setUniform1i('u_julia', 1)
    // this.shader.setUniform2fv('u_c', [-0.4, 0.6])
    this.shader.bind()

    this.targetTexture = new Texture(
      this.gl,
      this.display.width,
      this.display.height
    )
    this.frameBuffer = new FrameBuffer(this.gl)
    this.frameBuffer.bind()
    this.frameBuffer.attach(this.targetTexture)
    this.frameBuffer.unbind()
  }

  update(time: Time): void {
    if (this.input.Left) this.inputModel.moveLeft()
    else if (this.input.Right) this.inputModel.moveRight()
    else {
      this.inputModel.stopLeftRight()
    }

    if (this.input.Up) this.inputModel.moveUp()
    else if (this.input.Down) this.inputModel.moveDown()
    else this.inputModel.stopUpDown()

    if (this.input.ZoomIn) this.inputModel.zoom(-time.SElapsed)
    else if (this.input.ZoomOut) this.inputModel.zoom(time.SElapsed)
    else if (this.input.IsRolling) {
      this.inputModel.zoom(-time.SElapsed * this.input.WheelDY * 0.25)
      this.input.IsRolling = !this.input.IsRolling
    }

    if (this.input.RotateAnti) this.inputModel.rotate(-1)
    else if (this.input.RotateClock) this.inputModel.rotate(1)

    if (this.input.Reset) {
      this.resetTimer += time.Elapsed
      if (this.resetTimer >= this.RESET_TIME) {
        if (this.input.ResetPosition) this.inputModel.resetPosition()
        if (this.input.ResetRotation) this.inputModel.resetRotation()
        if (this.input.ResetScale) this.inputModel.resetZoom()
        if (this.input.ResetAll) this.inputModel.reset()
      }
    } else {
      this.resetTimer = 0
    }

    if (this.input.IsDragging) {
      this.inputModel.drag(
        (this.input.dX / this.display.displayWidthPixelRatio) *
          this.display.ratio,
        this.input.dY / this.display.displayHeightPixelRatio
      )
    }

    this.input.update()
    this.inputModel.update(time)

    this.shader.bind()
    this.shader.setUniform1f('u_scale', this.inputModel.realScale)
    this.shader.setUniform2fv('u_position', this.inputModel.realPosition)
    // this.shader.setUniform2fv('u_c', this.mandelbrotProp.realPosition)
    this.shader.setUniform1f('u_rotation', this.inputModel.realRotation)
    this.shader.unbind()

    this.targetTexture.Width = this.display.width * this.inputModel.resolution
    this.targetTexture.Height = this.display.height * this.inputModel.resolution
    this.targetTexture.loadData()
    this.frameBuffer.bind()
    this.frameBuffer.attach(this.targetTexture)
    this.frameBuffer.unbind()
  }

  render(time: Time): void {
    // Render to target texture
    this.targetTexture.unbind()
    this.frameBuffer.bind()

    this.gl.viewport(0, 0, this.targetTexture.Width, this.targetTexture.Height)
    this.gl.clearColor(0, 0, 0, 1)
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

    this.shader.bind()
    this.shader.setUniform2f(
      'u_resolution',
      this.targetTexture.Width,
      this.targetTexture.Height
    )
    this.shader.setUniform1f('u_time', time.STotal)
    this.gl.drawElements(
      this.gl.TRIANGLES,
      indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    )
    this.shader.unbind()

    // Render to canvas
    this.frameBuffer.unbind()
    this.targetTexture.bind()
    this.gl.viewport(0, 0, this.display.width, this.display.height)
    this.gl.clearColor(1, 1, 1, 1)
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

    this.textureShader.bind()
    this.gl.drawElements(
      this.gl.TRIANGLES,
      indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    )
  }
}
