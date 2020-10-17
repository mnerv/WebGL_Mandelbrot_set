import { Time } from 'Engine/Time'
import { clamp } from 'Engine/Math'
type ContextMode = '2d' | 'webgl' | 'webgl2'

/**
 * Creates Display area for canvas to render in.
 */
export class Display {
  parent: HTMLDivElement
  canvas: HTMLCanvasElement

  private resolution: number = 1.0
  private autoResize: boolean = false

  /**
   * Create display area.
   *
   * Contains parent element with canvas element inside with width and height sets to 100%.
   * @param parent Parent element canvas appends to
   */
  constructor(parent?: HTMLDivElement) {
    this.parent = parent ? parent : document.createElement('div')
    if (!parent) {
      this.parent.id = 'Display'
      document.body.appendChild(this.parent)
    }

    this.canvas = document.createElement('canvas')
    this.canvas.innerHTML = 'Your browser does not support HTML5.'
    this.canvas.id = 'DisplayRenderer'
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.parent.appendChild(this.canvas)

    this.setFill()
    this.resize()
  }

  enableAutoResize() {
    addEventListener('resize', this.resize.bind(this))
    this.autoResize = true
  }

  disableAutoResize() {
    removeEventListener('resize', this.resize.bind(this))
    this.autoResize = false
  }

  isAutoResizeEnabled() {
    return this.autoResize
  }

  setFill() {
    this.setSize(100, 100, '%')
  }

  /**
   * Set the display size.
   * @param width Display width
   * @param height Display height
   * @param unit The display unit, default is `px`. Example: `%`, `pt`, etc.
   */
  setSize(width: number, height: number, unit: string = 'px') {
    this.parent.style.width = width + unit
    this.parent.style.height = (height ? height : width) + unit
  }

  resize(): void {
    const displayWidth = Math.round(
      this.canvas.clientWidth * devicePixelRatio * this.resolution
    )
    const displayHeight = Math.round(
      this.canvas.clientHeight * devicePixelRatio * this.resolution
    )

    if (this.width != displayWidth || this.height != displayHeight) {
      this.canvas.width = displayWidth
      this.canvas.height = displayHeight
    }
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  /**
   * Set resolution scale
   * @param scale Value from 0 to 1. The value clamp at 0.
   */
  setResolution(scale: number): void {
    this.resolution = clamp(scale, 0, scale)

    this.resize()
  }

  getContext(mode: ContextMode) {
    return this.canvas.getContext(mode)
  }
}

export default Display
