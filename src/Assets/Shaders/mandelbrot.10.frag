#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

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

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

vec2 rot_2d(vec2 p, vec2 pivot, float a) {
  float s = sin(a);
  float c = cos(a);
  p -= pivot;
  p = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  p += pivot;
  return p;
}

float map(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

int map(int x, int in_min, int in_max, int out_min, int out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

float mandelbrot(vec2 _z, vec2 _c, float max_iter, float radius,
                 bool fractions) {
  float r2 = radius * radius;
  vec2 z = _z;
  vec2 c = _c;

  float iterations = 0.;
  for (float i = 0.; i < MAX_ITER; i++) {
    if (i > max_iter)
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

  float max_iter = 512.; // Temp
  vec3 color = vec3(0.);

  vec2 scale = vec2(pow(2., u_scale.x), pow(2., u_scale.y));

  float n = 0.;

  if (u_julia)
    n = mandelbrot(rot_2d(uv * scale + u_position, u_position, u_rotation), u_c,
                   max_iter, u_radius, !u_frac);
  else
    n = mandelbrot(u_z, rot_2d(uv * scale + u_position, u_position, u_rotation),
                   max_iter, u_radius, !u_frac);

  float c = 0.;

  if (n < max_iter - 5.) {
    c = sqrt(n / max_iter);
    c = clamp(c, 0., 1.);

    vec3 rgb_comp = vec3(.3, 0.1, 0.5);
    float freq = 12.;

    color = (sin(rgb_comp * freq * c - PI / 2.) + 1.) * 0.5;
  } else
    color = vec3(0.);

  gl_FragColor = vec4(color, 1.0);
}