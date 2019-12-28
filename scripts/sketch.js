let running = true

// html elements
let cnv
let loopEl
let locationEl
let setBtnEl
let maxiterEl, maxradEl
let symEl
let cRangeEl

// a shader variable
let theShader

let navValue
let navSmooth
let activeNav
let coffset

let smoothStep = 0.1
let baseStep = 0.05
let navStep = baseStep
let scaleStep = 0.01
let rotationStep

const MAX_ITER = 30000
let maxIteration = 255
let maxRadius = 10
let symmetry = 0

let interfaceSelected = false
let enableControl = false

let totalKeyPress = 0

function preload() {
  // load the shader
  theShader = loadShader('./shaders/basic.vert', './shaders/mandelbrot.frag')
}

function setup() {
  // Assign values
  navValue = {
    x: 0,
    y: 0,
    z: 2.35,
    w: 2.35,
    a: 0
  }
  navSmooth = Object.assign({}, navValue)
  activeNav = {
    x: 0,
    y: 0,
    z: 0,
    w: 0,
    a: 0
  }
  coffset = {
    r: 0.3,
    g: 0.4,
    b: 0.65,
    w: 50
  }
  initElements()
  rotationStep = PI / 180

  updateLocationEl()
  // shaders require WEBGL mode to work
  cnv = createCanvas(windowWidth, windowHeight, WEBGL)
  cnv.mouseWheel(zoomScroll)
  cnv.mouseOver(() => {
    enableControl = true
  })
  cnv.mouseOut(() => {
    enableControl = false
    // resetValues()
    // hardResetValue()
  })
  // cnv.keyPressed(cnvKeyPre)
  // cnv.keyReleased(cnvKeyRel)

  noStroke()

  shader(theShader)
  theShader.setUniform('u_resolution', [width, height])
  rect(0, 0, width, height)
  updateShader()
}

function draw() {
  rect(-width / 2, -height / 2, width, height)
  updateShader()

  updateValues()
  if (totalKeyPress == 0) hardResetValue()
}

function updateShader() {
  shader(theShader)

  theShader.setUniform('u_cOffset', [
    coffset.r,
    coffset.g,
    coffset.b,
    coffset.w
  ])
  theShader.setUniform('u_symmetry', symmetry)
  theShader.setUniform('u_maxIter', maxIteration)
  theShader.setUniform('u_radius', maxRadius)
  theShader.setUniform('u_time', millis() / 1000)

  theShader.setUniform('u_area', [
    navSmooth.x,
    navSmooth.y,
    navSmooth.z,
    navSmooth.w
  ]) // xy:location and zw:zoom
  theShader.setUniform('u_angle', navSmooth.a) // rect gives us some geometry on the screen
}

function updateValues() {
  let dir = { x: activeNav.x, y: activeNav.y }
  let s = sin(navValue.a)
  let c = cos(navValue.a)

  navValue.x += dir.x * c - dir.y * s
  navValue.y += dir.x * s + dir.y * c
  navValue.z += activeNav.z
  navValue.w += activeNav.w
  navValue.a += activeNav.a

  navSmooth.x = lerp(navSmooth.x, navValue.x, smoothStep)
  navSmooth.y = lerp(navSmooth.y, navValue.y, smoothStep)

  navSmooth.z = lerp(navSmooth.z, navValue.z, smoothStep)
  navSmooth.w = lerp(navSmooth.w, navValue.w, smoothStep)

  navSmooth.a = lerp(navSmooth.a, navValue.a, smoothStep)

  if (activeNav.x != 0 || activeNav.y != 0) {
    updateLocationEl()
  }
  navStep = 1 / exp(2 * navValue.w)
}

function resetValues() {
  if (key === 'w' || key === 'ArrowUp') {
    activeNav.y = 0
  } else if (key === 's' || key === 'ArrowDown') {
    activeNav.y = 0
  } else if (key === 'a' || key === 'ArrowLeft') {
    activeNav.x = 0
  } else if (key === 'd' || key === 'ArrowRight') {
    activeNav.x = 0
  }

  if (key === 'Shift') {
    activeNav.z = 0
    activeNav.w = 0
  } else if (key === 'Control') {
    activeNav.z = 0
    activeNav.w = 0
  }

  if (key === 'q') {
    activeNav.a = 0
  } else if (key === 'e') {
    activeNav.a = 0
  }
}

function hardResetValue() {
  activeNav.y = 0
  activeNav.x = 0
  activeNav.z = 0
  activeNav.w = 0
  activeNav.a = 0

  totalKeyPress = 0
}

function navigate(key) {
  if (key === 'w' || key === 'ArrowUp') {
    activeNav.y = navStep
  } else if (key === 's' || key === 'ArrowDown') {
    activeNav.y = -navStep
  } else if (key === 'a' || key === 'ArrowLeft') {
    activeNav.x = -navStep
  } else if (key === 'd' || key === 'ArrowRight') {
    activeNav.x = navStep
  }

  if (key === 'q') {
    activeNav.a = rotationStep
  } else if (key === 'e') {
    activeNav.a = -rotationStep
  }

  if (key === 'Shift') {
    activeNav.z = scaleStep
    activeNav.w = scaleStep
  } else if (key === 'Control') {
    activeNav.z = -scaleStep
    activeNav.w = -scaleStep
  }
}

function zoomScroll(event) {
  if (running) {
    navValue.z += event.deltaY / 1000
    navValue.w += event.deltaY / 1000
  }
}

function setMaxIter(event) {
  if (event.type === 'wheel') {
    maxIteration += event.deltaY
    if (maxIteration < 1) maxIteration = 1
    else if (maxIteration > MAX_ITER) maxIteration = MAX_ITER
  } else if (event === 'changed') {
  }

  maxiterEl.value(maxIteration)
}

function setMaxRad(event) {
  if (event.type === 'wheel') {
    maxRadius += event.deltaY
    if (maxRadius < 1) maxRadius = 1
  } else if (event === 'changed') {
  }

  maxradEl.value(maxRadius)
}

function setNavValue() {
  if (!isNaN(locationEl.x.value() && !isNaN(locationEl.y.value()))) {
    navValue.x = float(locationEl.x.value())
    navValue.y = float(locationEl.y.value())
  }
}

function setColorGradient() {
  coffset.r = cRangeEl.r.value() / 100
  coffset.g = cRangeEl.g.value() / 100
  coffset.b = cRangeEl.b.value() / 100
}

function setSymmetry() {
  symmetry = symEl.value() / 100
}

function initElements() {
  loopEl = select('#playpause')
  loopEl.mouseClicked(playpause)
  updateLoopEl(running)

  locationEl = {
    x: select('#xInput'),
    y: select('#yInput')
  }
  setBtnEl = select('#updateLocation')
  setBtnEl.mousePressed(setNavValue)

  maxiterEl = select('#maxiter')
  maxiterEl.mouseWheel(setMaxIter)
  maxiterEl.changed(setMaxIter)

  maxradEl = select('#maxrad')
  maxradEl.mouseWheel(setMaxRad)
  maxradEl.changed(setMaxRad)

  symEl = select('#syminput')
  symEl.mouseMoved(setSymmetry)
  symEl.changed(setSymmetry)

  cRangeEl = {
    r: select('#redinput'),
    g: select('#greeninput'),
    b: select('#blueinput')
  }
  cRangeEl.r.value(coffset.r * 100)
  cRangeEl.g.value(coffset.g * 100)
  cRangeEl.b.value(coffset.b * 100)

  cRangeEl.r.mouseMoved(setColorGradient)
  cRangeEl.g.mouseMoved(setColorGradient)
  cRangeEl.b.mouseMoved(setColorGradient)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  theShader.setUniform('u_resolution', [width, height])
}

function keyPressed() {
  if (keyCode == 32) playpause()
  if (enableControl) navigate(key)
  totalKeyPress++
}

function keyReleased() {
  if (enableControl) navigate(key)
  resetValues()
  totalKeyPress--
}

function playpause() {
  running = !running
  if (running) {
    loop()
  } else {
    noLoop()
  }

  updateLoopEl(running)
}

function updateLoopEl(tof) {
  loopEl.html(tof)
  if (tof) {
    loopEl.removeClass('redColor')
    loopEl.addClass('blueColor')
  } else {
    loopEl.removeClass('blueColor')
    loopEl.addClass('redColor')
  }
}

function updateLocationEl() {
  locationEl.x.value(navValue.x)
  locationEl.y.value(navValue.y)
}

function getLocationEl() {
  interfaceSelected = true
}

function getOS() {
  let userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'macOS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  return os
}

window.addEventListener('blur', () => {
  if (running) playpause()
  hardResetValue()
})

window.addEventListener('focus', () => {
  if (!running) playpause()
})
