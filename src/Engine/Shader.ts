export class Shader {
  private gl: WebGLRenderingContext
  private rendererID: WebGLProgram

  get id(): WebGLProgram {
    return this.rendererID
  }

  constructor(gl: WebGLRenderingContext, vertex: string, fragment: string) {
    this.gl = gl
    this.rendererID = this.createShader(vertex, fragment)
  }

  bind(): void {
    this.gl.useProgram(this.rendererID)
  }

  setUniform1f(location: string, x: number) {
    this.gl.uniform1f(this.gl.getUniformLocation(this.rendererID, location), x)
  }

  setUniform2f(location: string, x: number, y: number) {
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.rendererID, location),
      x,
      y
    )
  }

  setUniform2fv(location: string, vector: [number, number]) {
    this.gl.uniform2fv(
      this.gl.getUniformLocation(this.rendererID, location),
      vector
    )
  }

  createShader(vertex: string, fragment: string): WebGLProgram {
    const program = this.gl.createProgram() as WebGLProgram
    const vs = this.compileShader(this.gl.VERTEX_SHADER, vertex)
    const fs = this.compileShader(this.gl.FRAGMENT_SHADER, fragment)

    this.gl.attachShader(program, vs)
    this.gl.attachShader(program, fs)
    this.gl.linkProgram(program)
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(
        'ERROR linking program!',
        this.gl.getProgramInfoLog(program)
      )
    }

    this.gl.deleteShader(vs)
    this.gl.deleteShader(fs)

    return program
  }

  compileShader(type: number, source: string): WebGLShader {
    const s = this.gl.createShader(type) as WebGLShader
    this.gl.shaderSource(s, source)
    this.gl.compileShader(s)
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(s)
      console.error('ERROR compiling shaders', this.gl.getShaderInfoLog(s))
    }

    return s
  }
}
