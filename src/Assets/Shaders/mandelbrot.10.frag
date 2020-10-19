precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

const float MAX_ITER = 8192.;

varying vec4 v_color;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec2 u_position;
uniform vec2 u_scale;
uniform float u_rotation;

uniform float u_radius;

uniform vec2 u_z;
uniform vec2 u_c;
uniform bool u_julia;
uniform bool u_frac;

vec2 rot2D(vec2 p, vec2 pivot, float a) {
  float s = sin(a);
  float c = cos(a);
  p -= pivot;
  p = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  p += pivot;
  return p;
}

float mandelbrot(vec2 _z, vec2 _c, float max_iter, float radius,
                 bool fractions) {
  float r2 = radius * radius;
  vec2 z = _z;
  vec2 c = _c;

  float iterations = 0.;
  for (float i = 0.; i < MAX_ITER; i++) {
    if (i > max_iter - 1.)
      break;

    z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;

    if (dot(z, z) > r2)
      break;

    iterations++;
  }

  if (fractions) {
    float dist = length(z);
    float frac_iter = (dist - radius) / (r2 - radius);
    frac_iter = log2(log(dist) / log(radius));
    iterations -= frac_iter;
  }

  return iterations;
}

void main() {
  vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.y;

  float maxiter = 256.; // Temp
  vec3 color = vec3(0.);

  vec2 scale = vec2(pow(2., u_scale.x), pow(2., u_scale.y));

  float n = 0.;

  if (u_julia)
    n = mandelbrot(uv * scale + u_position, u_c, maxiter, u_radius, !u_frac);
  else
    n = mandelbrot(u_z, rot2D(uv * scale + u_position, u_position, u_rotation),
                   maxiter, u_radius, !u_frac);

  if (n < maxiter) {
    float c = sqrt(n / maxiter);
    c = clamp(c, 0., 1.);

    color = sin(vec3(0.25, 0.41, 0.6) * c * 50.) * 0.5 + 0.5;
  } else
    color = vec3(0.);

  gl_FragColor = vec4(color, 1.0);
}