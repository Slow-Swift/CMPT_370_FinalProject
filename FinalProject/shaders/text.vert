#version 300 es

in vec4 position;
in vec2 textureCoord;

uniform mat4 transformationMatrix;

out vec2 v_texCoord;

void main() {
    gl_Position = transformationMatrix * position;
    v_texCoord = textureCoord;
}
