precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

varying vec4 v_color;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.y;

  gl_FragColor = v_color;
}