let red = 51
let green = 51
let blue = 51
let alpha = 255

let xMinValue = -1.5
let xMaxValue = 1.5
let yMinValue = xMinValue
let yMaxValue = xMaxValue

let value = 2
let maxIterations = 200

let xOffset = 1
let yOffset = 1

function setup() {
  createCanvas(windowWidth, windowHeight)
  xOffset = width / height
  yOffset = xMaxValue / yMaxValue
}

function draw() {
  calculate()
  noLoop()
}

function newValue(value) {
  xMinValue = -value
  xMaxValue = value

  yMinValue = xMinValue
  yMaxValue = xMaxValue

  reCalcOff()
}

function reCalcOff() {
  yOffset = xMaxValue / yMaxValue
}

function calculate() {
  pixelDensity(1)
  loadPixels()
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(x, 0, width, xMinValue * xOffset, xMaxValue * xOffset)
      let b = map(y, 0, height, yMinValue * yOffset, yMaxValue * yOffset)

      // Start value c
      let ca = a
      let cb = b

      let n = 0
      while (n < maxIterations) {
        // Real componnent
        let aa = a ** 2 - b ** 2
        // Complex component
        let bb = 2 * a * b

        a = aa + ca
        b = bb + cb

        if (abs(a + b) > 26) {
          break
        }

        n++
      }

      let bright = n / maxIterations
      bright = map(sqrt(bright), 0, 1, 0, 255)
      // if (bright < 10) bright = 0
      // if (n == maxIterations) {
      //   bright = 0
      // }

      let p = (x + y * width) * 4
      pixels[p + 0] = bright
      pixels[p + 1] = bright
      pixels[p + 2] = bright
      pixels[p + 3] = alpha
    }
  }
  updatePixels()
}
