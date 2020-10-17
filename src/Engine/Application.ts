import { Display } from 'Engine/Display'
import { Time } from 'Engine/Time'

export abstract class Application {
  constructor(parent?: HTMLDivElement) {
    this.display = new Display(parent)
    this.time = new Time()
  }

  start(): Application {
    this.run()
    return this
  }

  close(): boolean {
    cancelAnimationFrame(this.animationID)
    this.animationID = -1
    return true
  }

  getInstance(): Application {
    return this
  }

  abstract update(time: Time): void

  abstract render(time: Time): void

  protected display: Display

  private static instance: Application
  private animationID: number = -1

  private time: Time

  private run(): void {
    this.time.update()

    this.update(this.time)
    this.render(this.time)

    this.animationID = requestAnimationFrame(this.run.bind(this))
  }
}

export default Application
