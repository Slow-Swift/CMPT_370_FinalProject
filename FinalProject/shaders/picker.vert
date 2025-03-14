#version 300 es
// From https://webgl2fundamentals.org/webgl/lessons/webgl-picking.html

in vec4 position;

uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main()
{
  vec4 worldPosition = transformationMatrix * position;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}