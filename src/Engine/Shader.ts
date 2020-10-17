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
      throw new Error('Error compiling shaders: ' + this.gl.getShaderInfoLog(s))
    }

    return s
  }
}
