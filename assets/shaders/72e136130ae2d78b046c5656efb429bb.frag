// #pragma optionNV(fastmath off)
// #pragma optionNV(fastprecision off)
// #extension GL_OES_standard_derivatives : enable
// #extension GL_ARB_gpu_shader_fp64 : enable
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution; // Canvas size (width,height)
uniform float u_time;
uniform vec4 u_area;
uniform vec4 u_coloOffset;
uniform float u_angle;
uniform float u_radius;
uniform float u_maxIter;
uniform float u_sym;

varying vec2 v_TexCoord;

vec2 rot2D(vec2 p, vec2 pivot, float a);

void main() {
  vec2 uv_or = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;
  // vec2 uv_or = (gl_FragCoord.xy - .5 * u_resolution.xy);

  // Symmetry
  vec2 uv = abs(uv_or);              // make the negative side positiv
  uv = rot2D(uv, vec2(0.), PI / 4.); // rotate the abs(uv) by 45D
  uv = abs(uv);                      // make 8 symmetry

  uv = mix(uv_or, uv, u_sym); // linear interpolation

  // assign the transformations value
  vec4 Area = u_area;
  Area.z = pow(10., Area.z);
  Area.w = pow(10., Area.w);

  vec2 c = Area.xy + uv * Area.zw;
  c = rot2D(c, Area.xy, u_angle);

  float r = u_radius; // escape radius
  float r2 = r * r;

  vec2 z, zPrev;
  float iter;

  const float MAX_ITER = 30000.;
  float maxIter = u_maxIter;

  for (float i = 0.; i < MAX_ITER; i++) {
    if (i > maxIter)
      break;
    zPrev = rot2D(z, vec2(0.), u_time);

    z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c; // Mandelbrot set

    if (dot(z, z) > r2)
      break;

    iter++;
  }

  float dist = length(z);                 // distance from origin
  float fracIter = (dist - r) / (r2 - r); // linear interpolation
  fracIter = log2(log(dist) / log(r));    // double exponential interpolation
  iter -= fracIter;

  float m = sqrt(iter / maxIter);
  vec3 col;

  vec4 colorOffset = u_coloOffset;
  if (iter < maxIter)
    col = sin(colorOffset.rgb * m * colorOffset.w) * .5 + .5;
  else
    col = vec3(0.);

  gl_FragColor = vec4(col, 1.0);
}

vec2 rot2D(vec2 p, vec2 pivot, float a) {
  float s = sin(a);
  float c = cos(a);
  p -= pivot;
  p = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  p += pivot;
  return p;
}