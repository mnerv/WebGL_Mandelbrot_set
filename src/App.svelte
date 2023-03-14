<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import VertexShader from './shaders/basic.10.vert'
  import FragmentShader from './shaders/basic.10.frag'

  function shaderCompile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!ok) throw new Error(`${gl.getShaderInfoLog(shader)}`)
    return shader
  }

  function shaderProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram {
    const vertexShader = shaderCompile(gl, gl.VERTEX_SHADER, vertex)
    const fragmentShader = shaderCompile(gl, gl.FRAGMENT_SHADER, fragment)
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    const ok = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!ok) throw new Error(`${gl.getProgramInfoLog(program)}`)
    return program
  }

  // type BufferElement = {
  //   name: string,
  //   type: number,
  //   count: number,
  //   normalized: boolean,
  //   offset: number
  // }

  const app = document.querySelector('#app')
  let canvas: HTMLCanvasElement
  let gl: WebGL2RenderingContext
  let animationID = 0

  let shader: WebGLProgram
  let vertexID: WebGLBuffer
  let indexID: WebGLBuffer
  let arrayID: WebGLBuffer

  const vertices = [
  // xyz,  COLORS: RGBA,        UV
    -1.0,  1.0, 0.0,  1.0, 0.0, 0.0, 1.0,  0.0, 1.0,
    1.0,  1.0, 0.0,  0.0, 1.0, 0.0, 1.0,  1.0, 1.0,
    1.0, -1.0, 0.0,  0.0, 0.0, 1.0, 1.0,  1.0, 0.0,
    -1.0, -1.0, 0.0,  1.0, 0.0, 1.0, 1.0,  0.0, 0.0
  ]
  const indices = [
    0, 1, 2, // TOP RIGHT TRIANGLE
    0, 2, 3  // BOTTOM LEFT TRIANGLE
  ]

  function loop(now: number) {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    gl.useProgram(shader)
    gl.uniform2f(gl.getUniformLocation(shader, 'u_resolution'), gl.canvas.width, gl.canvas.height)
    gl.uniform1f(gl.getUniformLocation(shader, 'u_time'), now / 1000)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexID)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexID)

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    animationID = requestAnimationFrame(loop)
  }

  onMount(async () => {
    canvas.width  = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    gl = canvas.getContext('webgl2')

    const vertexSource = await fetch(VertexShader).then(res => res.text())
    const fragmentSource = await fetch(FragmentShader).then(res => res.text())
    shader = shaderProgram(gl, vertexSource, fragmentSource)

    // Create WebGL buffers
    vertexID = gl.createBuffer()
    indexID = gl.createBuffer()
    arrayID = gl.createBuffer()

    // Vertex Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexID)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    // Index Buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexID)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    // Bind the vertex buffer
    gl.useProgram(shader)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexID)
    const stride = 9 * Float32Array.BYTES_PER_ELEMENT
    gl.enableVertexAttribArray(gl.getAttribLocation(shader, 'a_position'))
    gl.vertexAttribPointer(gl.getAttribLocation(shader, 'a_position'), 3, gl.FLOAT, false, stride, 0)
    gl.enableVertexAttribArray(gl.getAttribLocation(shader, 'a_color'))
    gl.vertexAttribPointer(gl.getAttribLocation(shader, 'a_color'), 4, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(gl.getAttribLocation(shader, 'a_color'))
    gl.vertexAttribPointer(gl.getAttribLocation(shader, 'a_uv'), 2, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    loop(0)
  })

  onDestroy(async () => {
    cancelAnimationFrame(animationID)
    gl = null
  })
</script>

<canvas bind:this={canvas} class="w-full h-full" id="renderer"></canvas>
