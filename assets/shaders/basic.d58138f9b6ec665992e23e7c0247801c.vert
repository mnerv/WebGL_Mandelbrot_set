// #pragma optionNV(fastmath off)
// #pragma optionNV(fastprecision off)
// #extension GL_OES_standard_derivatives : enable
// #extension GL_ARB_gpu_shader_fp64 : enable
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 a_VertPosition;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;

// Matrices
uniform mat4 m_world;
uniform mat4 m_view;
uniform mat4 m_proj;

void main() {
  v_TexCoord = a_TexCoord;

  // gl_Position = m_proj * m_view * m_world * vec4(vert_position, 1.0);
  gl_Position = vec4(a_VertPosition, 1.0);
}