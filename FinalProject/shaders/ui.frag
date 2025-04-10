#version 300 es

precision mediump float;

in vec2 v_texCoord;

out vec4 fColor;

uniform sampler2D image;
uniform vec3 color;
uniform float useTexture;

void main()
{
  vec4 textureColor = vec4(1.0);
  if (useTexture > 0.5) {
    textureColor = texture(image, v_texCoord);
  }

  if (textureColor.a < 0.5) discard;

  fColor = vec4(color, 1.0) * textureColor;
}