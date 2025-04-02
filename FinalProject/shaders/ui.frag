#version 300 es

precision mediump float;

in vec2 v_texCoord;

out vec4 fColor;

uniform sampler2D image;
uniform vec3 tintColor;
uniform float tintStrength;
uniform float mouseOver;

void main()
{
  //vec4 textureColor = texture(image, v_texCoord);
  //vec4 baseColor = mix(textureColor, vec4(tintColor, 1.0), 1.0);
  //baseColor = mix(baseColor, vec4(1.0, 1.0, 1.0, 1.0), mouseOver * 0.3);

  fColor = vec4(tintColor,1.0);
}