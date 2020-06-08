class DebugLogger {
  /**
   * DebugLogger for displaying status and fps into the DOM element.
   * The DOM element will be append in the body with absolute position.
   * @param {Object} config {loopStatusLog: boolean, overlay: boolean, graph: boolean, consoleLogFPS: boolean}
   * @param {Function} loopToggle Callback function for toggle loop
   */
  constructor(config, loopToggle) {
    this.lastCalledTime = 0
    this.frameTime = 0
    this.framerate = 0
    this.updateRate = 250
    this.lastUpdateTime = 0
    this.DOMelements = {
      fps: null,
      ft: null,
      loop: null,
      graph: null,
    }
    this.graph = {
      fps: null,
      ft: null,
    }
    this.config = config
      ? config
      : {
          consoleLogFPS: false,
          loopStatusLog: false,
          overlay: false,
          graph: false,
        }
    this.logStyle = {
      fontFamily: "font-family: 'Roboto Mono', monospace;",
    }

    this.graph = {
      data: [],
      dataLength: 128,
      max: 0,
      min: 0,
    }
    this.graphDim = {
      w: 256,
      h: 64,
    }
    this.ctx

    if (this.config.overlay) this.initDOM(loopToggle)
    if (this.DOMelements.graph) {
      this.updateGraphCanvas()
    }
  }

  /**
   * Update the values, call this function every animation to calculate the FPS and display it.
   */
  update() {
    this.calculateFPS()
    if (this.config.consoleLogFPS) this.consoleLogFPS()
    if (
      this.config.overlay &&
      performance.now() - this.lastUpdateTime > this.updateRate
    ) {
      this.lastUpdateTime = performance.now()
      this.updateDOM()
    }

    if (this.config.graph && this.config.overlay) {
      this.updateGraphData()
      this.updateGraphCanvas()
    }
  }

  calculateFPS() {
    if (this.lastCalledTime) {
      this.frameTime = performance.now() - this.lastCalledTime
      this.framerate = 1000 / this.frameTime
    }

    this.lastCalledTime = performance.now()
  }

  consoleLogFPS() {
    console.log(
      `%cframerate: ${this.framerate.toFixed(
        2
      )} fps,\nframetime: ${this.frameTime.toFixed(2)} ms`,
      this.logStyle.fontFamily
    )
  }

  updateDOM() {
    this.DOMelements.fps.innerHTML = `framerate: ${this.framerate.toFixed(
      2
    )} fps`
    this.DOMelements.ft.innerHTML = `frametime: ${this.frameTime.toFixed(2)} ms`
  }

  /**
   * Set update interval for the FPS and frame time display in the overlay. Does not effect the graph.
   * @param {Number} value Time in milliseconds
   */
  setUpdateRate(value) {
    this.updateRate = value
  }

  updateGraphData() {
    this.graph.data.push(this.frameTime)
    if (this.graph.data.length > this.graph.dataLength - 1)
      this.graph.data.shift()
  }

  updateGraphCanvas() {
    this.ctx.clearRect(0, 0, this.graphDim.w, this.graphDim.h)
    this.ctx.globalAlpha = 0.25
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.graphDim.w, this.graphDim.h)

    this.ctx.globalAlpha = 1.0
    this.ctx.strokeStyle = '#f5426f'
    this.ctx.beginPath()
    this.ctx.lineWidth = 2
    this.ctx.moveTo(-1, this.graphDim.h / 2)
    let data
    let scaleData
    for (let i = 0; i < this.graph.dataLength; i++) {
      data = this.graph.data[i]
      scaleData = data * 5 - this.graphDim.h * 0.05

      this.ctx.lineTo(
        i * (this.graphDim.w / this.graph.dataLength),
        this.graphDim.h - scaleData
      )
    }

    this.ctx.stroke()
  }

  /**
   * Init the DOM element, this is function is called in the constructor if overlay is true.
   * @param {Function} loopToggle Callback function for the true/false text on the debug overlay
   */
  initDOM(loopToggle) {
    const doesDebugExist = document.getElementById('debug-container')
    const debugContainerEl = doesDebugExist
      ? doesDebugExist
      : document.createElement('div')
    debugContainerEl.id = 'debug-container'
    debugContainerEl.style = `position: absolute;
      top: 0;
      padding: 5pt;
      display: grid;
      color: #ffffff;
      font-family: 'Roboto Mono', monospace;
      font-weight: 300;
      font-size: 10pt;
      background-color: rgba(0, 0, 0, 0.5);
      `
    debugContainerEl.className = 'noselect overlay'
    this.DOMelements.fps = document.createElement('span')
    this.DOMelements.fps.innerHTML = 'framerate: 00.00 fps'
    debugContainerEl.appendChild(this.DOMelements.fps)

    this.DOMelements.ft = document.createElement('span')
    this.DOMelements.ft.innerHTML = 'frametime: 00.00 ms'
    debugContainerEl.appendChild(this.DOMelements.ft)

    const loopStatusContainer = document.createElement('div')
    const loopStatusText = document.createElement('span')
    loopStatusText.innerHTML = 'loop: '
    this.DOMelements.loop = document.createElement('span')
    this.DOMelements.loop.innerHTML = 'not_updated'
    if (loopToggle) {
      this.DOMelements.loop.addEventListener('click', loopToggle)
      this.setTOFStyle(true)
    }

    loopStatusContainer.appendChild(loopStatusText)
    loopStatusContainer.appendChild(this.DOMelements.loop)
    debugContainerEl.appendChild(loopStatusContainer)

    if (this.config.graph) {
      this.DOMelements.graph = document.createElement('canvas')
      this.DOMelements.graph.style.width = `${this.graphDim.w}px`
      this.DOMelements.graph.style.height = `${this.graphDim.h}px`
      this.graphDim.w *= 2
      this.graphDim.h *= 2
      this.DOMelements.graph.width = this.graphDim.w
      this.DOMelements.graph.height = this.graphDim.h
      this.ctx = this.DOMelements.graph.getContext('2d')

      debugContainerEl.appendChild(this.DOMelements.graph)
    }

    document.body.appendChild(debugContainerEl)
  }

  /**
   * Update the DOM element and Loop console status if they are enable in the config
   * @param {Boolean} tof True or False
   */
  loopStatus(tof) {
    if (this.config.overlay) {
      this.DOMelements.loop.innerHTML = tof
      this.setTOFStyle(tof)
    }
    if (this.config.loopStatusLog) DebugLogger.logLoopStatus(tof)
  }

  setTOFStyle(tof) {
    this.DOMelements.loop.style = `cursor: Pointer;color:${
      tof ? '#5EE1F0' : '#FF2E62'
    }`
  }

  Log(message) {
    if (this.config.log) console.log(message)
  }

  /**
   * Log loop: true/false onto the console
   * @param {Boolean} tof True or False
   */
  static logLoopStatus(tof) {
    const fontSize = 'font-size: 14px;',
      fontFamily = "font-family: 'Roboto Mono', monospace;",
      color = `color: #252525;`,
      backgroundColor = `background-color: ${tof ? '#68F48E' : '#FF6B6B'};`,
      padding = `padding: 0px; padding-bottom: 1px; padding-left:5px; padding-right: 6px; ${
        tof ? 'padding-right: 14px;' : ''
      }`
    const style01 = `${fontSize} ${fontFamily}`,
      style02 = `${color} ${fontFamily} ${fontSize} ${backgroundColor} ${padding} `
    console.log(`%cloop: %c${tof}`, style01, style02)
  }
}

export default DebugLogger
