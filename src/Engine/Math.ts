/**
 * Linear interpolation
 *
 * @param a Value a, number
 * @param b Value b, number
 * @param n Interpolation factor
 * @return Interpolated value between a and b
 */
export function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b
}

/**
 * Clamp the input value between min (inclusive) and max (inclusive)
 *
 * @param n Input value
 * @param min Minimum value
 * @param max Maximum value
 * @return Clamped value
 */
export function clamp(n: number, min: number, max: number): number {
  return n < max ? (n > min ? n : min) : max
}

/**
 * Map input value to new range
 *
 * @param n Input value
 * @param in_min Input minimum range
 * @param in_max Input maximum range
 * @param out_min Output minimum range
 * @param out_max Output maximum range
 * @return Mapped value
 */
export function map(
  n: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  return ((n - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}
