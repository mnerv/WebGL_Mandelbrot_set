class VertexBuffer {
  constructor(gl, data) {
    this.rendererID = gl.createBuffer()
    this.Bind(gl)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

  Bind(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rendererID)
  }
}

export default VertexBuffer
