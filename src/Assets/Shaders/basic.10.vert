precision mediump float;

attribute vec3 a_position;
attribute vec4 a_color;
attribute vec2 a_uv;

varying vec4 v_color;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  v_color = a_color;
  v_uv = a_uv;

  gl_Position = vec4(a_position, 1.0);
}