"use client";

import type React from "react";
import { useEffect, useRef } from "react";

// GLSL utility functions
const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;

const proceduralHash11 = `
  float hash11(float p) {
    p = fract(p * 0.3183099) + 0.1;
    p *= p + 19.19;
    return fract(p * p);
  }
`;

const proceduralHash21 = `
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;

const simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const vertexShaderSource = `#version 300 es
precision mediump float;
layout(location = 0) in vec4 a_position;
void main() { gl_Position = a_position; }
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;
uniform float u_pxSize;
uniform sampler2D u_image;
uniform float u_hasImage;
uniform float u_imgScale;

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
  0,  8,  2, 10,
 12,  4, 14,  6,
  3, 11,  1,  9,
 15,  7, 13,  5
);
const int bayer8x8[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  int index = pos.y * size + pos.x;
  if (size == 2) { return float(bayer2x2[index]) / 4.0; }
  else if (size == 4) { return float(bayer4x4[index]) / 16.0; }
  else if (size == 8) { return float(bayer8x8[index]) / 64.0; }
  return 0.0;
}

void main() {
  float t = .5 * u_time;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= .5;
  uv.x *= u_resolution.x / u_resolution.y;

  float pxSize = u_pxSize;
  vec2 pxSizeUv = gl_FragCoord.xy;
  pxSizeUv -= .5 * u_resolution;
  pxSizeUv /= pxSize;
  vec2 pixelizedUv = floor(pxSizeUv) * pxSize / u_resolution.xy;
  pixelizedUv -= .5 * vec2(0.);
  pixelizedUv.x *= u_resolution.x / u_resolution.y;

  vec2 shape_uv = pixelizedUv;
  vec2 dithering_uv = pxSizeUv;
  vec2 ditheringNoise_uv = uv * u_resolution;

  // Shape (image) stays fixed — the particles move instead (see dithering below).
  vec2 sp = shape_uv;

  float shape = 0.;
  if (u_hasImage > 0.5) {
    // Use the supplied image as the shape source (black mark on light bg).
    vec2 iuv = sp / u_imgScale + 0.5;
    float inside = step(0.0, iuv.x) * step(iuv.x, 1.0) * step(0.0, iuv.y) * step(iuv.y, 1.0);
    vec4 tex = texture(u_image, vec2(iuv.x, 1.0 - iuv.y));
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    shape = (1.0 - lum) * tex.a * inside;
  } else if (u_shape < 1.5) {
    shape_uv *= .8;
    shape = 0.5 + 0.5 * getSimplexNoise(shape_uv, t);
    shape = smoothstep(0.3, 0.9, shape);
  } else if (u_shape < 6.5) {
    // swirl fallback for the mid shapes (kept simple)
    float l = length(shape_uv);
    float angle = 6. * atan(shape_uv.y, shape_uv.x) + 4. * t;
    shape = mix(0., fract(pow(l, -1.2) + angle / TWO_PI), smoothstep(0., 1., pow(l, 1.2)));
  } else if (u_shape < 7.5) {
    // Sphere
    shape_uv *= 2.;
    float d = 1. - pow(length(shape_uv), 2.);
    vec3 pos = vec3(shape_uv, sqrt(max(d, 0.)));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  } else {
    // Burst — radial tapered petals; fixed orientation.
    vec2 p = shape_uv * 1.9;
    float l = length(p);
    float a = atan(p.y, p.x); // fixed orientation — never rotates
    float petals = 13.0;
    float width = mix(11.0, 3.0, smoothstep(0.18, 0.95, l)); // petals widen outward
    float spoke = pow(0.5 + 0.5 * cos(petals * a), width);
    float band = smoothstep(0.20, 0.33, l) * (1.0 - smoothstep(0.66, 1.0, l));
    shape = spoke * band * 1.4;
  }

  int type = int(floor(u_type));
  float dithering = 0.0;
  // Particles move: scroll the dither field horizontally over time (shape is fixed).
  float drift = 8.0 * t;
  vec2 cell = floor(ditheringNoise_uv / max(u_pxSize, 1.0));
  vec2 nNoise = cell + vec2(floor(drift), 0.0);
  vec2 nBayer = dithering_uv + vec2(drift, 0.0);
  switch (type) {
    case 1: { dithering = step(hash21(nNoise), shape); } break;
    case 2: dithering = getBayerValue(nBayer, 2); break;
    case 3: dithering = getBayerValue(nBayer, 4); break;
    default: dithering = getBayerValue(nBayer, 8); break;
  }

  dithering -= .5;
  float res = step(.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;
  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`;

export const DitheringShapes = {
  simplex: 1, warp: 2, dots: 3, wave: 4, ripple: 5, swirl: 6, sphere: 7, burst: 8,
} as const;

export const DitheringTypes = { random: 1, "2x2": 2, "4x4": 3, "8x8": 4 } as const;

export type DitheringShape = keyof typeof DitheringShapes;
export type DitheringType = keyof typeof DitheringTypes;

interface DitheringShaderProps {
  width?: number;
  height?: number;
  fill?: boolean;
  colorBack?: string;
  colorFront?: string;
  shape?: DitheringShape;
  type?: DitheringType;
  pxSize?: number;
  speed?: number;
  /** Optional image used as the shape source (e.g. "/Untitled%20design.png"). */
  image?: string;
  /** On-screen size of the image as a fraction of the canvas height (default 0.8). */
  imageScale?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgba(hex: string): [number, number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0, 1];
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
    1,
  ];
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram | null {
  const vShader = createShader(gl, gl.VERTEX_SHADER, vs);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!vShader || !fShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error: " + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function DitheringShader({
  width = 800,
  height = 800,
  fill = false,
  colorBack = "#000000",
  colorFront = "#ffffff",
  shape = "simplex",
  type = "8x8",
  pxSize = 4,
  speed = 1,
  image,
  imageScale = 0.8,
  className = "",
  style = {},
}: DitheringShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const programRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const uniformLocationsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const startTimeRef = useRef<number>(Date.now());
  const sizeRef = useRef<{ w: number; h: number }>({ w: width, h: height });
  const textureRef = useRef<WebGLTexture | null>(null);
  const hasImageRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) { console.error("WebGL2 not supported"); return; }
    glRef.current = gl;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) return;
    programRef.current = program;

    uniformLocationsRef.current = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_colorBack: gl.getUniformLocation(program, "u_colorBack"),
      u_colorFront: gl.getUniformLocation(program, "u_colorFront"),
      u_shape: gl.getUniformLocation(program, "u_shape"),
      u_type: gl.getUniformLocation(program, "u_type"),
      u_pxSize: gl.getUniformLocation(program, "u_pxSize"),
      u_image: gl.getUniformLocation(program, "u_image"),
      u_hasImage: gl.getUniformLocation(program, "u_hasImage"),
      u_imgScale: gl.getUniformLocation(program, "u_imgScale"),
    };

    // Optional image texture used as the shape source.
    hasImageRef.current = 0;
    if (image) {
      const tex = gl.createTexture();
      textureRef.current = tex;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      const img = new Image();
      img.onload = () => {
        const g = glRef.current;
        if (!g || !textureRef.current) return;
        g.bindTexture(g.TEXTURE_2D, textureRef.current);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img);
        hasImageRef.current = 1;
      };
      img.src = image;
    }

    const posLoc = gl.getAttribLocation(program, "a_position");
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const resize = () => {
      let w = width, h = height;
      if (fill && wrapRef.current) {
        const r = wrapRef.current.getBoundingClientRect();
        w = Math.max(1, Math.floor(r.width * dpr));
        h = Math.max(1, Math.floor(r.height * dpr));
      }
      sizeRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();

    let ro: ResizeObserver | undefined;
    if (fill && wrapRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(resize);
      ro.observe(wrapRef.current);
    }

    const back = hexToRgba(colorBack);
    const front = hexToRgba(colorFront);

    const render = () => {
      const ctx = glRef.current;
      const sp = programRef.current;
      if (!ctx || !sp) return;
      const { w, h } = sizeRef.current;
      const currentTime = (Date.now() - startTimeRef.current) * 0.001 * speed;

      ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.useProgram(sp);
      const loc = uniformLocationsRef.current;
      if (loc.u_time) ctx.uniform1f(loc.u_time, currentTime);
      if (loc.u_resolution) ctx.uniform2f(loc.u_resolution, w, h);
      if (loc.u_colorBack) ctx.uniform4fv(loc.u_colorBack, back);
      if (loc.u_colorFront) ctx.uniform4fv(loc.u_colorFront, front);
      if (loc.u_shape) ctx.uniform1f(loc.u_shape, DitheringShapes[shape]);
      if (loc.u_type) ctx.uniform1f(loc.u_type, DitheringTypes[type]);
      if (loc.u_pxSize) ctx.uniform1f(loc.u_pxSize, pxSize * dpr);
      if (loc.u_hasImage) ctx.uniform1f(loc.u_hasImage, hasImageRef.current);
      if (loc.u_imgScale) ctx.uniform1f(loc.u_imgScale, imageScale);
      if (textureRef.current && loc.u_image) {
        ctx.activeTexture(ctx.TEXTURE0);
        ctx.bindTexture(ctx.TEXTURE_2D, textureRef.current);
        ctx.uniform1i(loc.u_image, 0);
      }

      ctx.drawArrays(ctx.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ro?.disconnect();
      if (glRef.current) {
        if (programRef.current) glRef.current.deleteProgram(programRef.current);
        if (textureRef.current) glRef.current.deleteTexture(textureRef.current);
      }
      textureRef.current = null;
    };
  }, [width, height, fill, colorBack, colorFront, shape, type, pxSize, speed, image, imageScale]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", ...(fill ? { width: "100%", height: "100%" } : { width, height }), ...style }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
