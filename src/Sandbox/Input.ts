export class Input {
  private _left: boolean = false
  private _right: boolean = false
  private _up: boolean = false
  private _down: boolean = false

  private _zoom_in: boolean = false
  private _zoom_out: boolean = false

  private _rotate_clock: boolean = false
  private _rotate_anti: boolean = false

  protected _space: boolean = false

  private _left_button: boolean = false

  private _reset: boolean = false

  private _x: number = 0
  private _y: number = 0

  private _prev_x: number = 0
  private _prev_y: number = 0

  private _wheel_delta_x: number = 0
  private _wheel_delta_y: number = 0

  get Left(): boolean {
    return this._left
  }

  get Right(): boolean {
    return this._right
  }

  get Up(): boolean {
    return this._up
  }

  get Down(): boolean {
    return this._down
  }

  get ZoomIn(): boolean {
    return this._zoom_in
  }

  get ZoomOut(): boolean {
    return this._zoom_out
  }

  get RotateClock(): boolean {
    return this._rotate_clock
  }

  get RotateAnti(): boolean {
    return this._rotate_anti
  }

  get Space(): boolean {
    return this._space
  }

  get LeftButton(): boolean {
    return this._left_button
  }

  get Reset(): boolean {
    return this._reset
  }

  get X(): number {
    return this._x
  }

  get Y(): number {
    return this._y
  }

  get dX(): number {
    return this._x - this._prev_x
  }

  get dY(): number {
    return this._y - this._prev_y
  }

  get WheelDY(): number {
    return this._wheel_delta_y
  }

  get WheelDX(): number {
    return this._wheel_delta_x
  }

  registerMouseEvents() {
    addEventListener('mousedown', this.onMouseDown.bind(this))
    addEventListener('mousemove', this.onMouseMove.bind(this))
    addEventListener('mouseup', this.onMouseUp.bind(this))

    addEventListener('wheel', this.onWheel.bind(this))
  }

  registerKeyEvents() {
    addEventListener('keydown', this.onKeyDown.bind(this))
    addEventListener('keyup', this.onKeyUp.bind(this))
  }

  removeMouseEvents() {
    removeEventListener('mousedown', this.onMouseDown.bind(this))
    removeEventListener('mousemove', this.onMouseMove.bind(this))
    removeEventListener('mouseup', this.onMouseUp.bind(this))
  }

  removeKeyEvents() {
    removeEventListener('keydown', this.onKeyDown.bind(this))
    removeEventListener('keyup', this.onKeyUp.bind(this))
  }

  private updateKey(code: string, state: boolean) {
    switch (code) {
      case 'KeyA':
      case 'ArrowLeft':
        this._left = state
        break
      case 'KeyD':
      case 'ArrowRight':
        this._right = state
        break
      case 'KeyW':
      case 'ArrowUp':
        this._up = state
        break
      case 'KeyS':
      case 'ArrowDown':
        this._down = state
        break

      case 'KeyF':
      case 'KeyZ':
      case 'ShiftLeft':
        this._zoom_in = state
        break
      case 'KeyG':
      case 'KeyX':
      case 'ControlLeft':
        this._zoom_out = state
        break

      case 'KeyE':
        this._rotate_clock = state
        break
      case 'KeyQ':
        this._rotate_anti = state
        break

      case 'Space':
        this._space = state
        break

      case 'Digit0':
        this._reset = state
        break

      default:
        break
    }
  }

  private onMouseDown(event: MouseEvent) {
    if (event.button == 0) this._left_button = true
  }

  private onMouseMove(event: MouseEvent) {
    this._prev_x = this._x
    this._prev_y = this._y

    this._x = event.clientX
    this._y = event.clientY
  }

  private onMouseUp(event: MouseEvent) {
    if (event.button == 0) this._left_button = false
  }

  private onWheel(event: WheelEvent) {
    this._wheel_delta_y = event.deltaY
    this._wheel_delta_x = event.deltaX
  }

  private onKeyDown(event: KeyboardEvent) {
    this.updateKey(event.code, true)
  }

  private onKeyUp(event: KeyboardEvent) {
    this.updateKey(event.code, false)
  }
}
