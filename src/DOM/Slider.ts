export class Slider extends HTMLElement {
  private _title: string = ''
  private _value: number = 0

  private _min: number = 0
  private _max: number = 1
  private _step: number = 1 / 100

  private title_element: HTMLParagraphElement
  private slider_element: HTMLInputElement

  set sliderTitle(value: string) {
    this._title = value
    this.title_element.innerHTML = this._title
  }

  constructor(parent?: HTMLElement) {
    super()
    if (parent) parent.appendChild(this)
    this.style.position = 'absolute'
    this.style.top = '0px'
    this.style.display = 'flex'

    this.title_element = document.createElement('p')

    this.slider_element = document.createElement('input')
    this.slider_element.min = this._min.toString()
    this.slider_element.max = this._max.toString()
    this.slider_element.step = this._step.toString()
    this.slider_element.type = 'range'

    this.appendChild(this.title_element)
    this.appendChild(this.slider_element)
  }
}

customElements.define('gn-slider', Slider)
