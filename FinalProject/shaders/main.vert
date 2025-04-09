#version 300 es

in vec4 position;
in vec2 textureCoord;
in vec3 normal;

out vec2 v_texCoord;
out vec3 surfaceNormal;
out vec3 toLightVector;
out vec3 toCameraVector;

uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 lightPosition;

void main()
{
  vec4 worldPosition = transformationMatrix * position;
  vec4 viewPosition = viewMatrix * worldPosition;
  toCameraVector = -viewPosition.xyz;

  surfaceNormal = (transformationMatrix * vec4(normal, 0.0)).xyz;
  toLightVector = lightPosition - worldPosition.xyz;

  gl_Position = projectionMatrix * viewPosition;
  v_texCoord = textureCoord;
}