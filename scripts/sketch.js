let running = true

// html elements
let loopEl
let locationEl
let setBtnEl

// a shader variable
let theShader

let navValue
let activeNav

let baseStep = 0.05
let navStep = baseStep
let scaleStep = 0.01
let rotationStep

let interfaceSelected = false

function preload() {
  // load the shader
  theShader = loadShader('./shaders/basic.vert', './shaders/mandelbrot.frag')
}

function setup() {
  initElements()

  // Assign values
  navValue = {
    x: 0,
    y: 0,
    z: 2.35,
    w: 2.35,
    a: 0
  }
  activeNav = {
    x: 0,
    y: 0,
    z: 0,
    w: 0,
    a: 0
  }
  rotationStep = PI / 180

  updateLocationEl()

  // navValue.x = -1.25066
  // navValue.y = 0.02012

  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL)
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
}

function updateShader() {
  shader(theShader)

  theShader.setUniform('u_Area', [
    navValue.x,
    navValue.y,
    navValue.z,
    navValue.w
  ]) // xy:location and zw:zoom
  theShader.setUniform('u_Angle', navValue.a) // rect gives us some geometry on the screen
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

function setNavValue() {
  navValue.x = locationEl.x.value()
  navValue.y = locationEl.y.value()
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
}

function mouseWheel(event) {
  navValue.z += event.delta / 1000
  navValue.w += event.delta / 1000
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  theShader.setUniform('u_resolution', [width, height])
}

function keyPressed() {
  if (keyCode == 32) playpause()
  navigate(key)
}

function keyReleased() {
  resetValues()
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
