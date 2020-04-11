#ifdef GL_ES
precision highp float;
#endif
#extension GL_ARB_gpu_shader_fp64 : enable

#define PI 3.14159265359

varying vec2 v_TexCoord;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

  float zoom = pow(10., -2.);

  // −0.7269 + 0.1889i
  // vec2 c = uv * 6.;
  // c += vec2(-0.69955, 0.37999);
  // c += vec2(-0.70176, -0.3842);

  // −0.8 + 0.156i
  // −0.7269 + 0.1889i
  vec2 c = vec2(-0.8, 0.156);
  vec2 v = uv;

  vec2 z = vec2(0);
  z = uv * 3.;
  float iter = 0.;

  const float max_iter = 1024.;

  float r = 2.; // escape radius
  float r2 = r * r;

  for (float i = 0.; i < max_iter; i++) {
    // z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;

    z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;

    if (dot(z, z) > r * r)
      break;

    iter++;
  }

  float dist = length(z);                 // distance from origin
  float fracIter = (dist - r) / (r2 - r); // linear interpolation
  fracIter = log2(log(dist) / log(r));    // double exponential interpolation
  iter += fracIter;

  float m = sqrt(iter / max_iter);

  vec3 sine_off = vec3(.5, .9, 1.);

  vec3 col = sin(sine_off * m);

  gl_FragColor = vec4(col, 1.0);
}