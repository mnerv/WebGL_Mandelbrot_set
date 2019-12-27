#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution; // Canvas size (width,height)
uniform vec2 u_mouse;      // mouse position in screen pixels
uniform float u_time;      // Time in seconds since load

uniform float u_zoom;

void main() {
  vec2 m = u_mouse.xy / u_resolution.xy;
  // float zoom = pow(10., -m.x * 3.);
  // float zoom = pow(10., -u_time / 2.);
  float zoom = pow(10., -u_zoom / 2.);

  vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;

  vec2 c = uv * zoom * 3.;
  c += vec2(-0.69955, 0.37999);

  vec2 z = vec2(0);
  float iter = 0.;

  const float max_iter = 150.;

  for (float i = 0.; i < max_iter; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;
    if (length(z) > 2.)
      break;
    iter++;
  }

  float f = iter / max_iter;
  vec3 col = vec3(f);
  gl_FragColor = vec4(col, 1.0);
}
