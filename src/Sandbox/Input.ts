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
  private _is_dragging: boolean = false

  private _reset: boolean = false
  private _reset_all: boolean = false
  private _reset_position: boolean = false
  private _reset_rotation: boolean = false
  private _reset_scale: boolean = false

  private _x: number = 0
  private _y: number = 0

  private _prev_x: number = 0
  private _prev_y: number = 0

  private _wheel_delta_x: number = 0
  private _wheel_delta_y: number = 0

  private _is_rolling: boolean = false

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

  get IsDragging(): boolean {
    return this._is_dragging
  }

  get Reset(): boolean {
    return this._reset
  }

  get ResetAll(): boolean {
    return this._reset_all
  }

  get ResetPosition(): boolean {
    return this._reset_position
  }

  get ResetRotation(): boolean {
    return this._reset_rotation
  }

  get ResetScale(): boolean {
    return this._reset_scale
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

  get IsRolling(): boolean {
    return this._is_rolling
  }

  set IsRolling(value: boolean) {
    this._is_rolling = value
  }

  registerMouseEvents(element: HTMLElement) {
    element.addEventListener('mousedown', this.onMouseDown.bind(this))
    addEventListener('mousemove', this.onMouseMove.bind(this))
    addEventListener('mouseup', this.onMouseUp.bind(this))

    element.addEventListener('wheel', this.onWheel.bind(this))

    addEventListener('focus', this.onFocus.bind(this))
    addEventListener('blur', this.onBlur.bind(this))
  }

  registerTouchEvents(element: HTMLElement) {
    element.addEventListener('touchstart', this.onTouchStart.bind(this))
    element.addEventListener('touchmove', this.onTouchMove.bind(this))
    element.addEventListener('touchend', this.onTouchEnd.bind(this))
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

  update() {
    this._prev_x = this._x
    this._prev_y = this._y
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

      case 'KeyZ':
      case 'ShiftLeft':
        this._zoom_in = state
        break
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
        this._reset_all = state
        break
      case 'Digit7':
        this._reset = state
        this._reset_position = state
        break
      case 'Digit8':
        this._reset = state
        this._reset_rotation = state
        break
      case 'Digit9':
        this._reset = state
        this._reset_scale = state
        break

      case 'Digit1':
        break
      case 'Digit2':
        break
      case 'Digit3':
        break
      case 'Digit4':
        break

      default:
        break
    }
  }

  private onMouseDown(event: MouseEvent) {
    if (event.button == 0) {
      this._left_button = true
      this._is_dragging = true

      this._x = event.clientX * devicePixelRatio
      this._y = event.clientY * devicePixelRatio

      this._prev_x = this._x
      this._prev_y = this._y
    }
  }

  private onMouseMove(event: MouseEvent) {
    this._x = event.clientX * devicePixelRatio
    this._y = event.clientY * devicePixelRatio
  }

  private onMouseUp(event: MouseEvent) {
    if (event.button == 0) {
      this._left_button = false
      this._is_dragging = false
    }
  }

  private onTouchStart(event: TouchEvent) {
    event.preventDefault()
    if (event.touches.length == 1) {
      this._left_button = true
      this._is_dragging = true

      this._x = event.touches[0].clientX * devicePixelRatio
      this._y = event.touches[0].clientY * devicePixelRatio

      this._prev_x = this._x
      this._prev_y = this._y
    }
  }

  private onTouchMove(event: TouchEvent) {
    event.preventDefault()
    if (event.touches.length == 1) {
      this._left_button = true
      this._is_dragging = true

      this._x = event.touches[0].clientX * devicePixelRatio
      this._y = event.touches[0].clientY * devicePixelRatio
    }
  }

  private onTouchEnd(event: TouchEvent) {
    event.preventDefault()

    if (event.touches.length == 1) {
      this._left_button = false
      this._is_dragging = false

      this._x = event.touches[0].clientX * devicePixelRatio
      this._y = event.touches[0].clientY * devicePixelRatio
    }
  }

  private onWheel(event: WheelEvent) {
    event.preventDefault()
    this._wheel_delta_y = event.deltaY
    this._wheel_delta_x = event.deltaX

    this._is_rolling = true
  }

  private onKeyDown(event: KeyboardEvent) {
    this.updateKey(event.code, true)
  }

  private onKeyUp(event: KeyboardEvent) {
    this.updateKey(event.code, false)
  }

  private onFocus(event: FocusEvent) {}

  private onBlur(event: FocusEvent) {
    this._left = false
    this._right = false
    this._up = false
    this._down = false

    this._zoom_in = false
    this._zoom_out = false

    this._rotate_anti = false
    this._rotate_clock = false
  }
}
