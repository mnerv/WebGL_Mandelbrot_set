<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { vec2 } from 'gl-matrix'
  import {
    shaderProgram,
    QUAD_VERTICES,
    QUAD_INDICES,
    TRIANGLE_INDICES,
    TRIANGLE_VERTICES
  } from './Rin'

  import VertexShader from './shaders/basic.10.vert'
  import FragmentShader from './shaders/basic.10.frag'
  import TextureShader from './shaders/texture.10.frag'
  import MandelbrotShader from './shaders/mandelbrot.10.frag'

  let canvas: HTMLCanvasElement
  let gl: WebGL2RenderingContext
  let animationID = 0

  let mandelbrotShader: WebGLProgram
  let textureShader: WebGLProgram

  let shader: WebGLProgram
  let triangleVertex: WebGLBuffer
  let triangleIndex: WebGLBuffer
  let triangleArray: WebGLVertexArrayObject

  let quadVertex: WebGLBuffer
  let quadIndex: WebGLBuffer
  let quadArray: WebGLVertexArrayObject

  let frameBufferSize: vec2 = [64, 64]
  let frameBufferTexture: WebGLTexture
  let frameBuffer: WebGLFramebuffer

  let currentPointer = vec2.create()
  let previousPointer = vec2.create()

  function loop(now: number) {
    // First pass
    gl.useProgram(shader)
    gl.uniform2f(gl.getUniformLocation(shader, 'u_resolution'), frameBufferSize[0], frameBufferSize[1])
    gl.uniform1f(gl.getUniformLocation(shader, 'u_time'), now / 1000)

    gl.bindVertexArray(triangleArray)
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertex)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndex)

    // Render to framebuffer
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    gl.viewport(0, 0, frameBufferSize[0], frameBufferSize[1])
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, TRIANGLE_INDICES.length, gl.UNSIGNED_SHORT, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // Second pass

    gl.bindTexture(gl.TEXTURE_2D, frameBufferTexture)
    gl.useProgram(textureShader)
    gl.activeTexture(gl.TEXTURE0)

    gl.bindVertexArray(quadArray)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertex)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndex)

    // Render to canvas
    gl.viewport(0, 0, canvas.width, canvas.height)  // Framebuffer
    gl.clearColor(1.0, 0.0, 1.0, 1.0)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, QUAD_INDICES.length, gl.UNSIGNED_SHORT, 0)

    animationID = requestAnimationFrame(loop)
  }

  function onMouseDown(e: MouseEvent) {
    //
  }
  function onMouseMove(e: MouseEvent) {
    vec2.copy(previousPointer, currentPointer)
    currentPointer = [e.clientX, e.clientY]
  }
  function onMouseUp(e: MouseEvent) {
    //
  }
  function onTouchStart(e: TouchEvent) {
    //
  }
  function onTouchMove(e: TouchEvent) {
    //
  }
  function onTouchCancel(e: TouchEvent) {
    //
  }
  function onTouchEnd(e: TouchEvent) {
    //
  }
  function onKeyDown(e: KeyboardEvent) {
    //
  }
  function onKeyUp(e: KeyboardEvent) {
    //
  }

  onMount(async () => {
    canvas.width  = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    gl = canvas.getContext('webgl2')

    const vertexSource = await fetch(VertexShader).then(res => res.text())
    const fragmentSource = await fetch(FragmentShader).then(res => res.text())
    shader = shaderProgram(gl, vertexSource, fragmentSource)

    const mandelbrotSource = await fetch(MandelbrotShader).then(res => res.text())
    const textureSource = await fetch(TextureShader).then(res => res.text())
    mandelbrotShader = shaderProgram(gl, vertexSource, mandelbrotSource)
    textureShader = shaderProgram(gl, vertexSource, textureSource)
    gl.useProgram(null)
    const stride = 9 * Float32Array.BYTES_PER_ELEMENT

    // Triangle
    triangleVertex = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertex)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TRIANGLE_VERTICES), gl.STATIC_DRAW)

    triangleIndex = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndex)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(TRIANGLE_INDICES), gl.STATIC_DRAW)

    triangleArray = gl.createVertexArray()
    gl.bindVertexArray(triangleArray)
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertex)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndex)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(2)

    // Quad
    quadVertex = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertex)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(QUAD_VERTICES), gl.STATIC_DRAW)
    quadIndex = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndex)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(QUAD_INDICES), gl.STATIC_DRAW)

    quadArray = gl.createVertexArray()
    gl.bindVertexArray(quadArray)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertex)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndex)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(2)

    // Render buffer
    frameBufferTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, frameBufferTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBufferSize[0], frameBufferSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexture, 0)

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchcancel', onTouchCancel)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    loop(0)
  })

  onDestroy(async () => {
    window.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchcancel', onTouchCancel)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)

    cancelAnimationFrame(animationID)
    gl = null
  })
</script>

<canvas bind:this={canvas} class="w-full h-full" id="renderer"></canvas>
