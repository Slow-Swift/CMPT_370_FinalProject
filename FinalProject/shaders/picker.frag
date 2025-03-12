// From https://webgl2fundamentals.org/webgl/lessons/webgl-picking.html
#version 300 es

precision mediump float;
uniform vec4 id;

out vec4 outColor;

void main()
{
  outColor = id;
}