#version 300 es
// From https://webgl2fundamentals.org/webgl/lessons/webgl-picking.html

precision mediump float;
uniform vec4 id;

out vec4 outColor;

void main()
{
  outColor = id;
}