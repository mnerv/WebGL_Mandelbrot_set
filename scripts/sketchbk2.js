let running = true
let loopEl

let MAX_ITER = 10

function setup() {
  loopEl = select('#playpause')
  loopEl.mouseClicked(playpause)
  updateLoopEl(running)

  createCanvas(windowWidth, windowHeight)
  let c = complexNumber(-2, 1 / 2)
  let z = squaredComplex(0, 0)
}

function draw() {
  background(0)
  drawFrame()
  playpause()
}

function drawFrame() {
  pixelDensity(1)
  loadPixels()
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // c = start complex number
      // let a = map(x, 0, width, -2, 2)
      // let b = map(y, 0, height, -2, 2)

      // let z = complexNumber(0, 0)
      // let c = complexNumber(a, b)

      // let n = iterate(MAX_ITER, z, c)

      let pix = (x + y * width) * 4
      pixels[pix] = 0
      pixels[pix + 1] = round(255 * 1)
      pixels[pix + 2] = round(255 * 0.9)
      pixels[pix + 3] = 255
    }
  }
  updatePixels()
}

function iterate(max, _z, _c) {
  let iter = 0
  let z = _z
  let c = _c

  for (let i = 0; i < max; i++) {
    // z = squaredComplex(z.r, z.i)

    // if (complexLength(z) > 2.0) break

    iter++
  }

  return iter
}

// f(z) = z^2 + c
// z = current position
// c = start position
// both are complex numbers (a + bi)
function fz(z, c) {
  let r = z.r + c.r
  let i = z.i + c.r
  return { r, i }
}

function complexLength(c) {
  return abs((c.r + c.i) ** (1 / 2))
}

function complexNumber(a, b) {
  return { r: a, i: b }
}

function squaredComplex(a, b) {
  let r = a ** 2 - b ** 2
  let i = 2 * a * b

  return { r, i }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function keyPressed() {
  if (keyCode == 32) playpause()
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
