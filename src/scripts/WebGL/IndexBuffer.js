class IndexBuffer {
  /**
   * Index buffer
   * @param {Object} gl WebGL context
   * @param {Array} data Index data, Integer Array
   */
  constructor(gl, data) {
    this.rendererID = gl.createBuffer()
    this.Bind(gl)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      gl.STATIC_DRAW
    )
  }

  Bind(gl) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rendererID)
  }
}

export default IndexBuffer
