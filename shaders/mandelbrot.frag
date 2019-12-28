#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // Canvas size (width,height)
uniform vec4 u_Area;
uniform float u_Angle;

varying vec2 vTexCoord;

vec2 rot2D(vec2 p, vec2 pivot, float a);

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  uv = gl_FragCoord.xy;
  vec4 Area = u_Area;

  Area.z = pow(10., -Area.z);
  Area.w = pow(10., -Area.w);

  vec2 c = Area.xy + (uv - 0.5 * u_resolution.xy) * Area.zw;
  c = rot2D(c, Area.xy, u_Angle);
  vec2 z;
  float iter;

  const float MAX_ITER = 255.;

  for (float i = 0.; i < MAX_ITER; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;
    if (length(z) > 2.)
      break;
    iter++;
  }

  vec3 col = vec3(iter / MAX_ITER);
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