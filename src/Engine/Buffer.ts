import { Shader, Texture } from 'Engine/Engine'

type BufferElement = {
  name: string
  type: number
  count: number
  normalized: boolean
  offset: number
}

/**
 * Buffer Layout
 *
 * The description of data buffer for Verticies
 */
export class BufferLayout {
  elements: BufferElement[]
  stride: number

  constructor() {
    this.stride = 0
    this.elements = []
  }

  /**
   * Create a description of memory layout
   *
   * @param count Size of the variable
   * @param name Name of the attribute location
   * @param type Attribute type
   * @param normalized
   * @param bytes byte size of the value
   */
  push(count: number, name: string, type: number, normalized: boolean) {
    this.elements.push({
      name,
      type,
      count,
      normalized,
      offset: this.stride,
    })

    this.stride += count * Float32Array.BYTES_PER_ELEMENT
  }

  getStride(): number {
    return this.stride
  }
}

/**
 * Vertex Buffer
 */
export class VertexBuffer {
  private bufferID: WebGLBuffer

  get id(): WebGLBuffer {
    return this.bufferID
  }

  constructor(private gl: WebGLRenderingContext, data: number[]) {
    this.bufferID = gl.createBuffer() as WebGLBuffer
    this.bind()
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

  bind(): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferID)
  }

  unbind(): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 0)
  }
}

/**
 * Index Buffer also known as Element Buffer
 */
export class IndexBuffer {
  private bufferID: WebGLBuffer

  constructor(private gl: WebGLRenderingContext, data: number[]) {
    this.bufferID = gl.createBuffer() as WebGLBuffer
    this.bind()
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      gl.STATIC_DRAW
    )
  }

  bind(): void {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferID)
  }

  unbind(): void {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, 0)
  }
}

/**
 * Array Buffer
 */
export class ArrayBuffer {
  constructor(private gl: WebGLRenderingContext) {}

  addBuffer(shader: Shader, vb: VertexBuffer, layout: BufferLayout) {
    shader.bind()
    vb.bind()

    let element, location
    for (let i = 0; i < layout.elements.length; i++) {
      element = layout.elements[i]

      location = this.gl.getAttribLocation(shader.id, element.name)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vb.id)
      this.gl.vertexAttribPointer(
        location,
        element.count,
        element.type,
        element.normalized,
        layout.getStride(),
        element.offset
      )
      this.gl.enableVertexAttribArray(location)
    }
  }
}

export class FrameBuffer {
  private bufferID: WebGLFramebuffer

  constructor(private gl: WebGLRenderingContext) {
    this.bufferID = gl.createFramebuffer()!
  }

  attach(texture: Texture) {
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture.Texture,
      texture.Level
    )
  }

  bind(): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.bufferID)
  }

  unbind(): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }
}
