class Shader {
  /**
   * Shader class for creating new shader for WebGL
   * @param {Object} gl WebGL context
   * @param {String} vertexShader Vertex shader text
   * @param {String} fragmentShader Fragment shader text
   */
  constructor(gl, vertexShader, fragmentShader) {
    this.rendererID = this.CreateShader(gl, vertexShader, fragmentShader)
  }

  Bind(gl) {
    gl.useProgram(this.rendererID)
  }

  CreateShader(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram()
    let vs = this.CompileShader(gl, gl.VERTEX_SHADER, vertexShader)
    let fs = this.CompileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog())
      return
    }

    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error('ERROR validating program!', gl.getProgramInfoLog(program))
      return
    }

    gl.deleteShader(vs)
    gl.deleteShader(fs)

    return program
  }

  CompileShader(gl, type, source) {
    let id = gl.createShader(type)
    gl.shaderSource(id, source)
    gl.compileShader(id)

    if (!gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
      console.error(
        `ERROR compiling ${type == 35632 ? 'vertex' : 'fragment'} shader!`,
        gl.getShaderInfoLog(id)
      )
      return
    }

    return id
  }

  SetUniform1f(gl, name, value) {
    gl.uniform1f(gl.getUniformLocation(this.rendererID, name), value)
  }

  SetUniform2fv(gl, name, values) {
    gl.uniform2fv(gl.getUniformLocation(this.rendererID, name), values)
  }

  Uniform2f(gl, name, v0, v1) {
    gl.uniform2f(gl.getUniformLocation(this.rendererID, name), v0, v1)
  }

  SetUniform4fv(gl, name, values) {
    gl.uniform4f(
      gl.getUniformLocation(this.rendererID, name),
      new Float32Array(values)
    )
  }

  SetUniform4f(gl, name, v0, v1, v2, v3) {
    gl.uniform4f(gl.getUniformLocation(this.rendererID, name), v0, v1, v2, v3)
  }
}

export default Shader
