import './styles/main.scss'

import VertexBuffer from './scripts/WebGL/VertexBuffer'
import IndexBuffer from './scripts/WebGL/IndexBuffer'
import Shader from './scripts/WebGL/Shader'

import { lerp } from './scripts/utils/math'
import { minibarHTMLText } from './scripts/htmltext'
import DebugLogger from './scripts/utils/DebugLogger'

import VertexShaderURL from './assets/shaders/basic.vert'
import FragShaderURL from './assets/shaders/mandelbrot.frag'

let settingsConfig = {
  debug: {
    overlay: false,
    graph: false,
    loopLog: true,
  },
  color: [
    0.3, // r
    0.4, // g
    0.65, // b
    50,
  ],
}

const DEBUG = new DebugLogger(
  { overlay: true, graph: true, loopStatusLog: true },
  stopStart
)

document.body.insertAdjacentHTML('beforeend', minibarHTMLText)

// Create canvas
const containerEl = document.getElementById('container')
const rendererEl = document.createElement('canvas')
rendererEl.className = 'pixelated'
rendererEl.id = 'renderer'
rendererEl.innerHTML = 'Your browser does not support HTML5'
rendererEl.style = `width: ${100}%; height: ${100}%;`
containerEl.appendChild(rendererEl)

// check for WebGL 2.0 support
const gl = rendererEl.getContext('webgl2')
  ? rendererEl.getContext('webgl2')
  : rendererEl.getContext('webgl')

if (!gl) alert('Your browser does not support WebGL')

let resolutionScale = 1
let displayWidth = gl.canvas.clientWidth
let displayHeight = gl.canvas.clientHeight

console.log(gl.getParameter(gl.VERSION))
console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
console.log(gl.getParameter(gl.VENDOR))

let animationID = null
let loopStatus = true
let autoStopStart = true
let frameCount = 0
let isMouseDwon = false

let vertShaderText, fragShaderText, shader

let vb
let ib
let vertices, indices, texCoords

const MAX_ITER = 30000

const navStartStep = 0.05
let navStep = navStartStep
let smoothStep = 0.1
let scaleStep = 0.01
let rotationStep = Math.PI / 180

let keysDown = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

let ongoingTouches = []
let minibarEl = {} // Object for storing settings element
let navKey = [
  0, // x: -1, 0, 1
  0, // y: -1, 0, 1
  0, // scale: -1, 0, 1
  0, // rotation: -1, 0, 1
]
let maxIter = 256
let maxRadius = 10
let symmetry = 0
let colorOffset = settingsConfig.color

// actual value
let navValue = [
  0, // x
  0, // y
  1.0, // x-scale
  1.0, // y-scale
  0, // rotation angle
]

// smoothed value
let navSmooth = [...navValue] // copy over the value

init()
getMiniBarDOM()

async function init() {
  vertShaderText = await getShader(VertexShaderURL)
  fragShaderText = await getShader(FragShaderURL)

  // prettier-ignore
  vertices = [
  // x,  y,  z
    -1, -1,  0, // 0
     1, -1,  0, // 1
     1,  1,  0, // 2
    -1,  1,  0  // 3
  ]

  // prettier-ignore
  texCoords = [
  // x,   y,   z
     0.0, 0.0, 0.0,
     1.0, 0.0, 0.0,
     1.0, 1.0, 0.0,
     0.0, 1.0, 0.0
  ]

  // prettier-ignore
  indices = [
    0, 1, 2,
    0, 2, 3
  ]

  vb = new VertexBuffer(gl, vertices)
  ib = new IndexBuffer(gl, indices)

  shader = new Shader(gl, vertShaderText, fragShaderText)

  let positionAttribLocation = gl.getAttribLocation(
    shader.rendererID,
    'a_VertPosition'
  )
  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // of elements
    false,
    3 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  )
  gl.enableVertexAttribArray(positionAttribLocation)

  let textcoordAttribLocation = gl.getAttribLocation(
    shader.rendererID,
    'a_TexCoord'
  )
  gl.vertexAttribPointer(
    textcoordAttribLocation,
    3,
    gl.FLOAT,
    false,
    3 * Float32Array.BYTES_PER_ELEMENT,
    0
  )
  gl.enableVertexAttribArray(textcoordAttribLocation)

  shader.Bind(gl)
  shader.SetUniform2fv(gl, 'u_resolution', [
    gl.drawingBufferWidth,
    gl.drawingBufferHeight,
  ])

  updateMandelbrotValue()

  if (loopStatus) animate()
  else render()

  DEBUG.loopStatus(loopStatus)
}

function getShader(url) {
  return new Promise((resolve, reject) => {
    resolve(
      fetch(url).then((res) => {
        return res.text()
      })
    )
  })
}

function render() {
  resize(gl)

  // Clear the color buffer with specified clear color
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

  // shader.Uniform1f(gl, 'u_time', performance.now() / 1000)
  shader.Bind(gl)

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
}

// Start game loop
function animate() {
  render()
  updateNavValues()
  updateMandelbrotValue()

  if (navKey[0] != 0 || navKey[1] != 0) {
    updateDOMEl()
  }

  DEBUG.update()

  animationID = requestAnimationFrame(animate)
}

function updateNavValues() {
  const s = Math.sin(navValue[4])
  const c = Math.cos(navValue[4])

  navValue[0] += navStep * navKey[0] * c - navStep * navKey[1] * s // x - account for rotation
  navValue[1] += navStep * navKey[0] * s + navStep * navKey[1] * c // y - account for rotation

  navValue[2] += scaleStep * navKey[2] // x-scale
  navValue[3] += scaleStep * navKey[2] // y-scale

  navValue[4] += rotationStep * navKey[3] // rotation

  // Smooth the value
  navSmooth[0] = lerp(navSmooth[0], navValue[0], smoothStep) // x
  navSmooth[1] = lerp(navSmooth[1], navValue[1], smoothStep) // y

  navSmooth[2] = lerp(navSmooth[2], navValue[2], smoothStep) // x-scale
  navSmooth[3] = lerp(navSmooth[3], navValue[3], smoothStep) // y-scale

  navSmooth[4] = lerp(navSmooth[4], navValue[4], smoothStep) // rotation

  navStep = navStartStep * Math.pow(10, navValue[2]) * 0.5
}

function loop() {
  animate()
}

function noLoop() {
  gl.flush()
  window.cancelAnimationFrame(animationID)
}

function stopStart() {
  if (loopStatus) noLoop()
  else loop()
  loopStatus = !loopStatus
  DEBUG.loopStatus(loopStatus)
}

function resize(gl) {
  displayWidth = Math.floor(
    gl.canvas.clientWidth * window.devicePixelRatio * resolutionScale
  )
  displayHeight = Math.floor(
    gl.canvas.clientHeight * window.devicePixelRatio * resolutionScale
  )

  // Check if the canvas is not the same size.
  if (gl.canvas.width != displayWidth || gl.canvas.height != displayHeight) {
    // Make the canvas the same size
    gl.canvas.width = displayWidth
    gl.canvas.height = displayHeight

    shader.SetUniform2fv(gl, 'u_resolution', [
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
    ])

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  }
}

function updateMandelbrotValue() {
  shader.SetUniform4f(
    gl,
    'u_area',
    navSmooth[0], // x
    navSmooth[1], // y
    navSmooth[2], // x-scale
    navSmooth[3] // y-scale
  )
  shader.SetUniform4f(
    gl,
    'u_coloOffset',
    colorOffset[0],
    colorOffset[1],
    colorOffset[2],
    colorOffset[3]
  )
  shader.SetUniform1f(gl, 'u_angle', navSmooth[4])
  shader.SetUniform1f(gl, 'u_radius', maxRadius)
  shader.SetUniform1f(gl, 'u_maxIter', maxIter)
  shader.SetUniform1f(gl, 'u_sym', symmetry)
  shader.SetUniform1f(gl, 'u_time', (performance.now() / 1000) * 1.5)
}

function updateDOMEl() {
  minibarEl.loc.x.value = navValue[0]
  minibarEl.loc.y.value = navValue[1]
}

function domInputEvent(event) {
  navValue[0] =
    parseFloat(minibarEl.loc.x.value) == NaN
      ? navKey[0]
      : parseFloat(minibarEl.loc.x.value)
  navValue[1] =
    parseFloat(minibarEl.loc.y.value) == NaN
      ? navKey[1]
      : parseFloat(minibarEl.loc.y.value)

  symmetry = minibarEl.sym.value / 100
  colorOffset[0] = minibarEl.color.r.value / 100
  colorOffset[1] = minibarEl.color.g.value / 100
  colorOffset[2] = minibarEl.color.b.value / 100
}

function getMiniBarDOM() {
  minibarEl.loc = {
    x: document.getElementById('locXInput'),
    y: document.getElementById('locYInput'),
  }

  minibarEl.loc.x.value = navValue[0]
  minibarEl.loc.y.value = navValue[1]

  minibarEl.loc.x.addEventListener('change', domInputEvent)
  minibarEl.loc.y.addEventListener('change', domInputEvent)

  minibarEl.maxIter = document.getElementById('maxiter')
  minibarEl.maxIter.addEventListener('change', setMaxIter)
  minibarEl.maxIter.addEventListener('wheel', setMaxIter)
  minibarEl.maxIter.value = maxIter
  minibarEl.maxRad = document.getElementById('maxrad')
  minibarEl.maxRad.addEventListener('change', setRadius)
  minibarEl.maxRad.addEventListener('wheel', setRadius)
  minibarEl.maxRad.value = maxRadius

  minibarEl.sym = document.getElementById('syminput')
  minibarEl.sym.addEventListener('input', domInputEvent)

  minibarEl.color = {
    r: document.getElementById('redinput'),
    g: document.getElementById('blueinput'),
    b: document.getElementById('greeninput'),
  }
  minibarEl.color.r.value = colorOffset[0] * 100
  minibarEl.color.g.value = colorOffset[1] * 100
  minibarEl.color.b.value = colorOffset[2] * 100

  minibarEl.color.r.addEventListener('input', domInputEvent)
  minibarEl.color.g.addEventListener('input', domInputEvent)
  minibarEl.color.b.addEventListener('input', domInputEvent)

  // Click events
  rendererEl.addEventListener('mousedown', mouseStart)
  rendererEl.addEventListener('mouseup', mouseEnd)
  rendererEl.addEventListener('mousemove', (e) => {
    handleMouse('mousemove', e)
  })

  // Touch events
  // rendererEl.addEventListener('touchstart', handleStart, false)
  // rendererEl.addEventListener('touchmove', handleMove, false)
  // rendererEl.addEventListener('touchend', handleEnd, false)
  // rendererEl.addEventListener('touchcancel', handleCancel, false)
}

function setRadius(event) {
  if (event.type == 'wheel') {
    maxRadius += event.deltaY
  } else if (event.type == 'change') {
    maxRadius =
      parseFloat(minibarEl.maxRad.value) == NaN ? 10 : minibarEl.maxRad.value
  }
  if (maxRadius < 0) maxRadius = 0
  minibarEl.maxRad.value = maxRadius
}

function setMaxIter(event) {
  if (event.type === 'wheel') {
    maxIter += event.deltaY
    if (maxIter < 1) maxIter = 1
    else if (maxIter > MAX_ITER) maxIter = MAX_ITER
  } else if (event.type === 'change') {
    maxIter =
      parseFloat(minibarEl.maxIter.value) == NaN ? 256 : minibarEl.maxIter.value

    if (maxIter > MAX_ITER) maxIter = MAX_ITER
  }
  minibarEl.maxIter.value = maxIter
}

// function copyTouch({ identifier, pageX, pageY }) {
//   return { identifier, pageX, pageY }
// }

// function ongoingTouchIndexById(idToFind) {
//   for (let i = 0; i < ongoingTouches.length; i++) {
//     let id = ongoingTouches[i].identifier

//     if (id == idToFind) {
//       return i
//     }
//   }
//   return -1 // not found
// }

// function handleStart(event) {
//   event.preventDefault()
//   console.log('touchStart')
//   let touches = event.changedTouches

//   for (let i = 0; i < touches.length; i++) {
//     ongoingTouches.push(copyTouch(touches[i]))

//     console.log('touchstart:' + i + '.')
//   }
// }

// function handleMove(event) {
//   event.preventDefault()
//   console.log('touchMove')
//   let touches = event.changedTouches

//   let idx
//   for (let i = 0; i < touches.length; i++) {
//     idx = ongoingTouchIndexById(touches[i].identifier)

//     if (idx >= 0) {
//       ongoingTouches.splice(idx, 1, copyTouch(touches[i])) // swap in the new touch record
//     } else {
//       console.log("can't figure out which touch to continue")
//     }
//   }
// }

// function handleEnd(event) {
//   event.preventDefault()
//   console.log('touchEnd')
//   let touches = event.changedTouches

//   let idx
//   for (let i = 0; i < touches.length; i++) {
//     idx = ongoingTouchIndexById(touches[i].identifier)
//     if (idx >= 0) {
//       ongoingTouches.splice(idx, 1) // remove it; we're done
//     } else {
//       console.log("can't figure out which touch to end")
//     }
//   }

//   console.log(ongoingTouches.length)
// }

// function handleCancel(event) {
//   event.preventDefault()
//   console.log('touchcancel.')
//   let touches = event.changedTouches

//   let idx
//   for (var i = 0; i < touches.length; i++) {
//     idx = ongoingTouchIndexById(touches[i].identifier)
//     ongoingTouches.splice(idx, 1) // remove it; we're done
//   }
// }

function controls(type, key) {
  if (type == 'keydown') {
    // Move in x-axis
    if (key == 'd' || key == 'ArrowRight') navKey[0] = 1
    else if (key == 'a' || key == 'ArrowLeft') navKey[0] = -1

    // Move in y-axis
    if (key == 'w' || key == 'ArrowUp') navKey[1] = 1
    else if (key == 's' || key == 'ArrowDown') navKey[1] = -1

    // Zoom
    if (key == 'Shift' || key == 'z') navKey[2] = -1
    else if (key == 'Control' || key == 'x') navKey[2] = 1

    // Rotate
    if (key == 'e') navKey[3] = -1
    else if (key == 'q') navKey[3] = 1
  } else if (type == 'keyup') {
    // Stop Moving in x-axis
    if ((key == 'd' || key == 'ArrowRight') && navKey[0] != -1) navKey[0] = 0
    else if ((key == 'a' || key == 'ArrowLeft') && navKey[0] != 1) navKey[0] = 0

    // Stop Moving in y-axis
    if ((key == 'w' || key == 'ArrowUp') && navKey[1] != -1) navKey[1] = 0
    else if ((key == 's' || key == 'ArrowDown') && navKey[1] != 1) navKey[1] = 0

    // Stop Zooming
    if ((key == 'Shift' || key == 'z') && navKey[2] != 1) navKey[2] = 0
    else if ((key == 'Control' || key == 'x') && navKey[2] != -1) navKey[2] = 0

    // Stop Rotating
    if (key == 'e' && navKey[3] != 1) navKey[3] = 0
    else if (key == 'q' && navKey[3] != -1) navKey[3] = 0
  }
}

function keyboardInput(type, event) {
  controls(type, event.key)

  if (event.code == 'Space' && type == 'keyup') stopStart()
}

function mouseEnd(event) {
  isMouseDwon = false
}

function mouseStart(event) {
  isMouseDwon = true
}

function handleMouse(type, event) {
  if (isMouseDwon) {
    console.log("it's working")
  }
}

window.addEventListener('resize', () => {
  if (!loopStatus) render()
})

window.addEventListener('keypress', (event) => {
  keyboardInput('keypress', event)
})

window.addEventListener('keydown', (event) => {
  keyboardInput('keydown', event)
})

window.addEventListener('keyup', (event) => {
  keyboardInput('keyup', event)
})

window.addEventListener('blur', (event) => {
  if (loopStatus && autoStopStart) stopStart()
})

window.addEventListener('focus', (event) => {
  if (!loopStatus && autoStopStart) stopStart()
})
