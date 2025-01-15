#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;

// The transform of the object being drawn
uniform mat4 uModelViewMatrix;
// Transforms 3D coordinates to
// 2D screen coordinates
uniform mat4 uProjectionMatrix;

uniform float uAmplitude;
uniform float uFrequency;



void main() {
  float yMove = sin(aPosition.x * uFrequency) * uAmplitude;
  float xMove = cos(aPosition.x * uFrequency) * uAmplitude;
  // Apply the camera transform
  vec4 viewModelPosition =
    uModelViewMatrix * vec4(aPosition.x, aPosition.y + yMove, aPosition.z, 1.0);

  // Tell WebGL where the vertex goes
  gl_Position =
    uProjectionMatrix * viewModelPosition;
}
