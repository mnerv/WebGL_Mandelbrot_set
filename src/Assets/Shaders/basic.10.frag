precision mediump float;

varying vec4 v_color;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;

float plot(vec2 uv){
  return smoothstep(0.003, 0.0, abs(uv.y - uv.x));
}

void main() {
  float y = v_uv.x;
  vec3 color = vec3(y);

  float plot_color = plot(v_uv);

  color = (1.0-plot_color) * color + plot_color * vec3(0.0, 1.0, 1.0);

  gl_FragColor = vec4(color, 1.0);

}