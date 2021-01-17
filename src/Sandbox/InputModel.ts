import { lerp } from 'Engine/Math'
import { Time } from 'Engine/Time'

type vec2 = [number, number]

export class InputModel {
  SPEED_DEFAULT: number = 1
  SMOOTH_STEP_DEFAULT: number = 0.03
  SCALE_DEFAULT: number = 2
  POSITION_DEFAULT: vec2 = [0, 0]
  ROTATION_SPEED_DEFAULT: number = Math.PI / 60
  RESOLUTION_DEFAULT: number = 1
  SCALE_SPEED_DEFAULT: number = 1

  resolution: number = this.RESOLUTION_DEFAULT

  position: vec2 = [...this.POSITION_DEFAULT]
  realPosition: vec2 = [...this.position]
  scale: number = this.SCALE_DEFAULT
  realScale: number = this.scale
  rotation: number = 0
  realRotation: number = 0
  radius: number = 10

  private direction: vec2 = [0, 0] // x, y

  private smooth_step: number = this.SMOOTH_STEP_DEFAULT

  private get move_step_x(): number {
    return Math.pow(2, this.scale) * 0.5
  }

  private get move_step_y(): number {
    return Math.pow(2, this.scale) * 0.5
  }

  private isVisisble: boolean = false
  private settings_container: HTMLDivElement
  private resolution_scale_input: HTMLInputElement

  constructor() {
    this.settings_container = document.querySelector(
      '#settings'
    ) as HTMLDivElement
    ;(document.querySelector(
      '#btn-show-settings'
    ) as HTMLButtonElement).addEventListener('click', this.onClick.bind(this))

    this.resolution_scale_input = document.querySelector(
      '#resolution-scale'
    ) as HTMLInputElement
    this.resolution_scale_input.addEventListener(
      'change',
      this.onChange.bind(this)
    )
  }

  update(time: Time) {
    const s = Math.sin(this.rotation)
    const c = Math.cos(this.rotation)

    this.position[0] +=
      (this.move_step_x * this.direction[0] * c -
        this.move_step_x * this.direction[1] * s) *
      time.SElapsed
    this.position[1] +=
      (this.move_step_y * this.direction[0] * s +
        this.move_step_y * this.direction[1] * c) *
      time.SElapsed

    this.realScale =
      lerp(this.realScale, this.scale, this.smooth_step) +
      (this.scale - this.realScale) * time.SElapsed

    this.realRotation =
      lerp(this.realRotation, this.rotation, this.smooth_step) +
      (this.rotation - this.realRotation) * time.SElapsed

    this.realPosition[0] =
      lerp(this.realPosition[0], this.position[0], this.smooth_step) +
      (this.position[0] - this.realPosition[0]) * time.SElapsed
    this.realPosition[1] =
      lerp(this.realPosition[1], this.position[1], this.smooth_step) +
      (this.position[1] - this.realPosition[1]) * time.SElapsed
  }

  drag(dx: number, dy: number) {
    // const s = Math.sin(this.rotation)
    // const c = Math.cos(this.rotation)

    this.realPosition[0] -= dx * Math.pow(2, this.scale)
    this.realPosition[1] += dy * Math.pow(2, this.scale)

    // this.realPosition[0] -=
    //   dx * Math.pow(2, this.scale[0]) * c - dy * Math.pow(2, this.scale[1]) * s
    // this.realPosition[1] +=
    //   dx * Math.pow(2, this.scale[0]) * s + dy * Math.pow(2, this.scale[1]) * c

    this.position = [...this.realPosition]
  }

  zoom(dir: number) {
    this.scale += dir * this.SCALE_SPEED_DEFAULT
  }

  rotate(dir: number) {
    this.rotation += dir * this.ROTATION_SPEED_DEFAULT
  }

  moveLeft() {
    this.direction[0] = -1
  }

  moveRight() {
    this.direction[0] = 1
  }

  stopLeftRight() {
    this.direction[0] = 0
  }

  moveUp() {
    this.direction[1] = 1
  }

  moveDown() {
    this.direction[1] = -1
  }

  stopUpDown() {
    this.direction[1] = 0
  }

  reset() {
    this.resetPosition()
    this.resetRotation()
    this.resetZoom()
  }

  resetPosition() {
    this.position = [...this.POSITION_DEFAULT]
  }

  resetRotation() {
    this.rotation = 0
  }

  resetZoom() {
    this.scale = this.SCALE_DEFAULT
  }

  private onClick(event: MouseEvent) {
    if (!this.isVisisble) this.settings_container.classList.remove('hide')
    else this.settings_container.classList.add('hide')

    this.isVisisble = !this.isVisisble
  }

  private onChange(event: Event) {
    this.resolution = parseFloat(this.resolution_scale_input.value)
  }
}
