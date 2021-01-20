/**
 * Texture
 */
export class Texture {
  private width: number
  private height: number
  private texture: WebGLTexture

  private level: number
  private internalFormat: number
  private border: number
  private srcFormat: number
  private srcType: number
  private data!: Uint8Array | null

  get Texture(): WebGLTexture {
    return this.texture
  }

  get Width(): number {
    return this.width
  }

  set Width(value: number) {
    this.width = value
  }

  get Height(): number {
    return this.height
  }

  set Height(value: number) {
    this.height = value
  }

  get Level(): number {
    return this.level
  }

  constructor(
    private gl: WebGLRenderingContext,
    width: number = 1,
    height: number = 1
  ) {
    this.texture = gl.createTexture()!

    this.level = 0
    this.internalFormat = gl.RGBA
    this.width = width
    this.height = height
    this.border = 0
    this.srcFormat = gl.RGBA
    this.srcType = gl.UNSIGNED_BYTE
    this.loadData()

    // TEMPORARY
    // TODO: Abstract this away
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    )
  }

  loadData(data?: Uint8Array) {
    this.data = data ? data : null

    this.bind()
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      this.level,
      this.internalFormat,
      this.width,
      this.height,
      this.border,
      this.srcFormat,
      this.srcType,
      this.data
    )
  }

  loadImage(image: HTMLImageElement) {
    this.bind()
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      this.level,
      this.internalFormat,
      this.srcFormat,
      this.srcType,
      image
    )

    // Check if the image is power of 2
    if (
      image.width % (image.width - 1) == 0 &&
      image.height % (image.height - 1) == 0
    )
      this.gl.generateMipmap(this.gl.TEXTURE_2D)
    else {
      // TODO: Abstract this away later
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      )
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      )
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR
      )
    }
  }

  bind(slot: number = 0): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + slot)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
  }

  unbind(): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }
}
