#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

varying vec4 v_color;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;

float map(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void main() {
  vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.y;

  vec3 color = vec3(0.);
  vec3 rgb_comp = vec3(.3, 0.1, 0.5);
  float freq = 12.;

  color = (sin(rgb_comp * freq * v_uv.x - PI / 2.) + 1.) * 0.5;

  // gl_FragColor = vec4(color, 1.0);
  gl_FragColor = v_color;
}