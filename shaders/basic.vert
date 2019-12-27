#ifdef GL_ES
precision mediump float;
#endif

// Always include this to get the position of the pixel and map the shader
// correctly onto the shape our vertex data
attribute vec3 aPosition;

// our texcoordinates
// attribute vec2 aTexCoord;

// this is a variable that will be shared with the fragment shader
// we will assign the attribute texcoords to the varying texcoords to move them
// from the vert shader to the frag shader it can be called whatever you want
// but often people prefix it with 'v' to indicate that it is a varying
// varying vec2 vTexCoord;

void main() {
  // // copy the texture coordinates
  // vTexCoord = aTexCoord;

  // // copy the position data into a vec4, using 1.0 as the w component
  vec4 position = vec4(aPosition, 1.0);
  position.xy = position.xy * 2.0 - 1.0;

  gl_Position = position;
}