import { lerp } from 'Engine/Math'
import { Time } from 'Engine/Time'
import { Template } from 'webpack'

type Axis = 'x' | 'y'

export class MandelbrotProps {
  NAV_SPEED: number = 1
  SMOOTH_STEP: number = 0.03

  position: [number, number] = [0, 0]
  realPosition: [number, number] = [...this.position]

  scale: [number, number] = [1, 1]
  realScale: [number, number] = [...this.scale]

  rotation: number = 0
  realRotation: number = 0

  radius: number = 10

  resetMode: boolean = false

  direction: [number, number] = [0, 0] // x, y

  private get move_step(): number {
    return Math.pow(2, this.scale[0]) * 0.5
  }

  update(time: Time) {
    const s = Math.sin(this.rotation)
    const c = Math.cos(this.rotation)

    this.position[0] +=
      (this.move_step * this.direction[0] * c -
        this.move_step * this.direction[1] * s) *
      time.SElapsed
    this.position[1] +=
      (this.move_step * this.direction[0] * s +
        this.move_step * this.direction[1] * c) *
      time.SElapsed

    this.realScale[0] =
      lerp(this.realScale[0], this.scale[0], this.SMOOTH_STEP) +
      (this.scale[0] - this.realScale[0]) * time.SElapsed
    this.realScale[1] =
      lerp(this.realScale[1], this.scale[1], this.SMOOTH_STEP) +
      (this.scale[1] - this.realScale[1]) * time.SElapsed

    this.realRotation =
      lerp(this.realRotation, this.rotation, this.SMOOTH_STEP) +
      (this.rotation - this.realRotation) * time.SElapsed

    this.realPosition[0] =
      lerp(this.realPosition[0], this.position[0], this.SMOOTH_STEP) +
      (this.position[0] - this.realPosition[0]) * time.SElapsed
    this.realPosition[1] =
      lerp(this.realPosition[1], this.position[1], this.SMOOTH_STEP) +
      (this.position[1] - this.realPosition[1]) * time.SElapsed
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
    this.position = [0, 0]
  }

  resetRotation() {
    this.rotation = 0
  }

  resetZoom() {
    this.scale = [1, 1]
  }
}
