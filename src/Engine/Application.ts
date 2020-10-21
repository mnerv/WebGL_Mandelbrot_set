import { Display } from 'Engine/Display'
import { Time } from 'Engine/Time'

/**
 * The main application. This class needs to be inhert to use.
 *
 * The `parent` parameter can be use to pass in the the parent element.
 *
 * Example:
 * ```ts
 * class Sandbox extends Application {
 *  constructor(){
 *    super()
 *  }
 *
 *  update(time: Time): void {
 *    // Update code here
 *  }
 *
 *  render(time: Time): void {
 *    // Render code here
 *  }
 * }
 *
 * const sandbox = new Sandbox()
 * sanbox.start()
 * ```
 */
export abstract class Application {
  constructor(parent?: HTMLDivElement) {
    this.display = new Display(parent)
    this.time = new Time()
  }

  /**
   * Start the Application's main loop
   */
  start(): Application {
    this.run()
    return this
  }

  /**
   * Stop the application
   */
  stop(): boolean {
    cancelAnimationFrame(this.animationID)
    this.animationID = -1
    return true
  }

  getInstance(): Application {
    return this
  }

  /**
   * update is called every frame
   * @param time Time object
   */
  abstract update(time: Time): void

  /**
   * render is called every frame
   * @param time Time object
   */
  abstract render(time: Time): void

  protected display: Display

  private static instance: Application
  private animationID: number = -1

  private time: Time

  /**
   * Application main loop
   */
  private run(): void {
    this.time.update()

    this.update(this.time)

    this.display.resize()
    this.render(this.time)

    this.animationID = requestAnimationFrame(this.run.bind(this))
  }
}

export default Application
