<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { vec2 } from 'gl-matrix'
  import {
    shaderProgram,
    QUAD_VERTICES,
    QUAD_INDICES,
    TRIANGLE_INDICES,
    TRIANGLE_VERTICES,
    FrameBuffer
  } from './Rin'

  import VertexShader from './shaders/basic.10.vert'
  import FragmentShader from './shaders/basic.10.frag'
  import TextureShader from './shaders/texture.10.frag'
  import MandelbrotShader from './shaders/mandelbrot.10.frag'

  let tick = 0

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

  let output: FrameBuffer

  let currentPointer = vec2.create()
  let previousPointer = vec2.create()

  let width = 0
  let height = 0

  function resize() {
    const displayWidth = Math.round(canvas.clientWidth * devicePixelRatio)
    const displayHeight = Math.round(canvas.clientHeight * devicePixelRatio)

    if (width != displayWidth || height != displayHeight) {
      canvas.width = displayWidth
      canvas.height = displayHeight
      output.resize(canvas.width, canvas.height)
    }
  }


  function loop(now: number) {
    tick += 1

    resize()
    // First pass
    gl.useProgram(shader)
    gl.uniform2fv(gl.getUniformLocation(shader, 'u_resolution'), output.getSize())
    gl.uniform1f(gl.getUniformLocation(shader, 'u_time'), tick / 60)

    // gl.bindVertexArray(triangleArray)
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertex)
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndex)
    gl.bindVertexArray(quadArray)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertex)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndex)

    // Render to framebuffer
    output.bind()
    gl.viewport(0, 0, output.getWidth(), output.getHeight())
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, QUAD_INDICES.length, gl.UNSIGNED_SHORT, 0)
    // gl.drawElements(gl.TRIANGLES, TRIANGLE_INDICES.length, gl.UNSIGNED_SHORT, 0)
    output.unbind()

    // Second pass
    gl.useProgram(textureShader)
    output.bindTarget(0)
    gl.uniform1i(gl.getUniformLocation(textureShader, 'u_texture'), 0)

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

  function startLoop() {
    loop(0)
  }
  function stopLoop() {
    cancelAnimationFrame(animationID)
    animationID = 0
  }

  type BinaryState<T> = {
    A: boolean,
    B: boolean,
    e: T
  }
  const keyboardStatusMap: Map<string, BinaryState<KeyboardEvent>> = new Map()

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
    if (!keyboardStatusMap.has(e.code)) {
      keyboardStatusMap.set(e.code, { A: true, B: false, e })
      onKeyTyped(e)
    }
    const status = keyboardStatusMap.get(e.code)
    status.B = status.A
    status.A = true
    status.e = e
    if (status.A != status.B) onKeyTyped(e)
  }
  function onKeyUp(e: KeyboardEvent) {
    if (!keyboardStatusMap.has(e.code))
      keyboardStatusMap.set(e.code, { A: true, B: false, e })
    const status = keyboardStatusMap.get(e.code)
    status.B = status.A
    status.A = false
    status.e = e
  }
  function onKeyTyped(e: KeyboardEvent) {
    if (e.code === 'Space') {
      if (animationID === 0)
        startLoop()
      else
        stopLoop()
    }

    if (e.code === 'KeyQ')
      stopLoop()
  }
  function onFocus(e: FocusEvent) {
    if (animationID !== 0) return
    startLoop()
  }
  function onBlur(e: FocusEvent) {
    if (animationID === 0) return
    stopLoop()
  }


  onMount(async () => {
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

    output = new FrameBuffer(gl, 8, 8)
    resize()

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchcancel', onTouchCancel)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)

    startLoop()
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
    window.removeEventListener('focus', onFocus)
    window.removeEventListener('blur', onBlur)

    stopLoop()
    gl = null
  })
</script>

<canvas bind:this={canvas} class="w-full h-full" id="renderer"></canvas>
