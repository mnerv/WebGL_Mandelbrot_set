precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

const float MAX_ITER = 4096.;

varying vec4 v_color;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;

float mandelbrot(vec2 uv, float max_iter, float radius) {
  float r2 = radius * radius;
  vec2 z = vec2(0.);
  vec2 c = uv;

  float iterations = 0.;
  for (float i = 0.; i < MAX_ITER; i++) {
    if (i > max_iter - 1.)
      break;

    z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;

    if (dot(z, z) > r2)
      break;

    iterations++;
  }

  return iterations;
}

float map(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void main() {
  vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.y;

  float maxiter = 256.;
  vec3 color = vec3(0.);

  float n = mandelbrot(uv * 3.2, maxiter, 2.);

  if (n < maxiter) {
    float c = map(n, 0., 90., 0., 1.);
    c = clamp(c, 0., 1.);

    color = vec3(c);
  } else
    color = vec3(0.);

  gl_FragColor = vec4(color, 1.0);
}