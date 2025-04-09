#version 300 es

precision mediump float;

in vec2 v_texCoord;
in vec3 surfaceNormal;
in vec3 toLightVector;
in vec3 toCameraVector;

out vec4 fColor;

uniform sampler2D image;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 emissiveColor;

uniform vec3 ambientLight;
uniform vec3 diffuseLight;
uniform vec3 specularLight;

uniform float shininess;
uniform float useTexture;

void main()
{
  vec4 baseColor = vec4(1.0);
  if (useTexture > 0.5) {
    baseColor = texture(image, v_texCoord);
  }

  vec3 normalDirection = normalize(surfaceNormal);
  vec3 toLightDirection = normalize(toLightVector);
  vec3 cameraDirection = normalize(toCameraVector);

  float Kd = max(dot(normalDirection, toLightDirection), 0.0);
  vec3 diffuse = diffuseColor * diffuseLight * Kd;

  vec3 halfwayVector = normalize(toLightDirection + cameraDirection);
  float Ks = pow(max(dot(normalDirection, halfwayVector), 0.0), shininess);
  vec3 specular = specularColor * specularLight * Ks;

  vec3 ambient = ambientColor * ambientLight;
  float lightStrength = length(diffuse + specular);
float darkness = 1.0 - clamp(lightStrength, 0.0, 1.0);
vec3 boostedAmbient = ambient * mix(0.2, 2.0, darkness);

  fColor = baseColor * vec4(diffuse + specular + boostedAmbient, 1.0) + vec4(emissiveColor, 1.0);
}