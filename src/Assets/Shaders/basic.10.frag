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

vec3 hsb2rgb(in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
                   0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  // vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y; //
  // gl_FragCoord returns pixel coordinate
  vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.y;

  vec3 color = vec3(0.);

  float angle = atan(uv.y, uv.x) + u_time;
  float radius = length(uv) * 2.;

  color = hsb2rgb(vec3((angle / TWO_PI), radius, 1.));

  gl_FragColor = vec4(color, 1.0);
}