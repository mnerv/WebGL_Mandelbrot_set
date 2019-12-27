let running = true
let loopEl

// a shader variable
let theShader

let navValue
let activeNav

let navStep = 0.0001

function preload() {
  // load the shader
  theShader = loadShader('./shaders/basic.vert', './shaders/mandelbrot.frag')
}

function setup() {
  loopEl = select('#playpause')
  loopEl.mouseClicked(playpause)
  updateLoopEl(running)
  navValue = {
    x: 0,
    y: 0,
    z: 0,
    w: 0,
    a: 0
  }
  activeNav = {
    x: 0,
    y: 0,
    z: 0,
    w: 0,
    a: 0
  }

  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL)
  noStroke()

  shader(theShader)
  theShader.setUniform('u_resolution', [width, height])

  navValue.x = -1.25066
  navValue.y = 0.02012

  updateShader()
}

function draw() {
  updateShader()

  updateValues()
}

function updateShader() {
  rect(0, 0, width, height)
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
  navValue.x += activeNav.x
  navValue.y += activeNav.y
  navValue.z += activeNav.z
  navValue.w += activeNav.w
  navValue.a += activeNav.a
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

  console.log(activeNav)

  if (key === 'q') {
    navValue.a -= PI / 180
  } else if (key === 'e') {
    navValue.a += PI / 180
  }

  if (key === 'Shift') {
    navValue.z -= navStep
    navValue.w -= navStep
  } else if (key === 'Control') {
    navValue.z += navStep
    navValue.w += navStep
  }
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

window.addEventListener('blur', () => {
  if (running) playpause()
})

window.addEventListener('focus', () => {
  if (!running) playpause()
})
