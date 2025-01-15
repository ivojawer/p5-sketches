#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 0.0);
}

