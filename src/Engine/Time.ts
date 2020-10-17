export class Time {
  private current: number = 0
  private previous: number = 0
  private elapsed: number = 0

  /**
   * Total time since start in milliseconds
   */
  get Total(): number {
    return this.current
  }

  /**
   * Elapsed time since last frame in milliseconds
   */
  get Elapsed(): number {
    return this.elapsed
  }

  /**
   * Total time since start in seconds
   */
  get STotal(): number {
    return this.current / 1000
  }

  /**
   * Elapsed time since last frame in seconds
   */
  get SElapsed(): number {
    return this.elapsed / 1000
  }

  /**
   * This needs to be called every frame
   */
  update(): void {
    this.previous = this.current
    this.current = performance.now()
    this.elapsed = this.current - this.previous
  }
}
