#version 300 es

precision mediump float;

in vec2 v_texCoord;
in vec3 surfaceNormal;
in vec3 toLightVector;

out vec4 fColor;

uniform sampler2D image;
uniform vec3 tintColor;
uniform vec3 lightColor;
uniform float tintStrength;

void main()
{
  vec4 textureColor = texture(image, v_texCoord);
  vec4 baseColor = mix(textureColor, vec4(tintColor, 1.0), tintStrength);
  vec3 normalDirection = normalize(surfaceNormal);
  vec3 toLightDirection = normalize(toLightVector);

  float brightness = max(dot(normalDirection, toLightDirection), 0.3);
  vec3 diffuse = brightness * lightColor;

  fColor = vec4(diffuse, 1.0) * baseColor;
}