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

uniform sampler2D u_texture;
void main() {
  vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.y;

  gl_FragColor = texture2D(u_texture, v_uv);
}