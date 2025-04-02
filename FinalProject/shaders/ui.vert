#version 300 es

in vec4 position;
in vec2 textureCoord;

out vec2 v_texCoord;

uniform mat4 transformationMatrix;

void main()
{
  vec4 uiPosition = transformationMatrix * position;


  gl_Position = uiPosition;
  v_texCoord = textureCoord;
}