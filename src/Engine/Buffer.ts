import { Shader } from 'Engine/Engine'

interface BufferElement {
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
  private gl: WebGLRenderingContext

  get id(): WebGLBuffer {
    return this.bufferID
  }

  constructor(gl: WebGLRenderingContext, data: number[]) {
    this.gl = gl
    this.bufferID = this.gl.createBuffer() as WebGLBuffer
    this.bind()
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(data),
      this.gl.STATIC_DRAW
    )
  }

  bind(): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferID)
  }

  unBind(): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 0)
  }
}

/**
 * Index Buffer also known as Element Buffer
 */
export class IndexBuffer {
  private gl: WebGLRenderingContext
  private bufferID: WebGLBuffer

  constructor(gl: WebGLRenderingContext, data: number[]) {
    this.gl = gl
    this.bufferID = this.gl.createBuffer() as WebGLBuffer
    this.bind()
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      this.gl.STATIC_DRAW
    )
  }

  bind(): void {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferID)
  }

  unBind(): void {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, 0)
  }
}

/**
 * Array Buffer
 */
export class ArrayBuffer {
  private gl: WebGLRenderingContext

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
  }

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
