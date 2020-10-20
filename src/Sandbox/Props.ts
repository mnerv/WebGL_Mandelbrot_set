import { lerp } from 'Engine/Math'
import { Time } from 'Engine/Time'
import { Slider } from 'DOM/Slider'

type Axis = 'x' | 'y'

type vec2 = [number, number]

export class MandelbrotProps {
  SPEED_DEFAULT: number = 1
  SMOOTH_STEP_DEFAULT: number = 0.03
  SCALE_DEFAULT: vec2 = [2, 2]
  POSITION_DEFAULT: vec2 = [0, 0]

  position: vec2 = [...this.POSITION_DEFAULT]
  realPosition: vec2 = [...this.position]

  scale: vec2 = [...this.SCALE_DEFAULT]
  realScale: vec2 = [...this.scale]

  rotation: number = 0
  realRotation: number = 0

  radius: number = 10

  resetMode: boolean = false

  direction: vec2 = [0, 0] // x, y

  smooth_step: number = this.SMOOTH_STEP_DEFAULT

  offset: vec2 = [0, 0]

  private get move_step_x(): number {
    return Math.pow(2, this.scale[0]) * 0.5
  }

  private get move_step_y(): number {
    return Math.pow(2, this.scale[1]) * 0.5
  }

  // slider: Slider

  constructor() {
    // this.slider = new Slider(document.body)
    // this.slider.sliderTitle = 'R: '
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

    this.realScale[0] =
      lerp(this.realScale[0], this.scale[0], this.smooth_step) +
      (this.scale[0] - this.realScale[0]) * time.SElapsed
    this.realScale[1] =
      lerp(this.realScale[1], this.scale[1], this.smooth_step) +
      (this.scale[1] - this.realScale[1]) * time.SElapsed

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

    this.realPosition[0] -= dx * Math.pow(2, this.scale[0])
    this.realPosition[1] += dy * Math.pow(2, this.scale[1])

    // this.realPosition[0] -=
    //   dx * Math.pow(2, this.scale[0]) * c - dy * Math.pow(2, this.scale[1]) * s
    // this.realPosition[1] +=
    //   dx * Math.pow(2, this.scale[0]) * s + dy * Math.pow(2, this.scale[1]) * c

    this.position = [...this.realPosition]
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
    this.scale = [...this.SCALE_DEFAULT]
  }
}
