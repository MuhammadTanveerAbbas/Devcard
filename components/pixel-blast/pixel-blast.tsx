"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import "./pixel-blast.css";

/**
 * PixelBlast, from React Bits.
 * Source: https://reactbits.dev
 * Idea comes from the Bayer dithering WebGL demo by github.com/zavalit.
 *
 * Notes on this port:
 * - Converted to TypeScript with explicit uniform types.
 * - Fixed the liquid strength update. Upstream assigned the Effect itself to
 *   uStrength and then wrote .value on it, so changing liquidStrength at runtime
 *   silently did nothing.
 * - WebGL creation is guarded, so a missing or blocked WebGL context renders
 *   nothing instead of throwing inside an effect.
 */

const MAX_CLICKS = 10;

export type PixelBlastShape = "square" | "circle" | "triangle" | "diamond";

export type PixelBlastProps = {
  variant?: PixelBlastShape;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
  /** Called once if WebGL is not available. Use it to show a static fallback. */
  onError?: () => void;
};

type TouchPoint = {
  x: number;
  y: number;
  age: number;
  force: number;
  vx: number;
  vy: number;
};

type TouchTexture = {
  texture: THREE.Texture;
  /**
   * A move adds a trail point whose force comes from its speed.
   * A force override pushes a burst, used for taps and clicks.
   */
  addTouch: (norm: { x: number; y: number }, forceOverride?: number) => void;
  update: () => void;
  /** Drops the trail, so a pointer that leaves the window does not streak. */
  reset: () => void;
  radiusScale: number;
};

type PixelBlastUniforms = {
  uResolution: { value: THREE.Vector2 };
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uClickPos: { value: THREE.Vector2[] };
  uClickTimes: { value: Float32Array };
  uShapeType: { value: number };
  uPixelSize: { value: number };
  uScale: { value: number };
  uDensity: { value: number };
  uPixelJitter: { value: number };
  uEnableRipples: { value: number };
  uRippleSpeed: { value: number };
  uRippleThickness: { value: number };
  uRippleIntensity: { value: number };
  uEdgeFade: { value: number };
};

type ThreeInstance = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  timer: THREE.Timer;
  clickIx: number;
  uniforms: PixelBlastUniforms;
  resizeObserver: ResizeObserver;
  raf: number;
  quad: THREE.Mesh;
  composer: EffectComposer | null;
  touch: TouchTexture | null;
  liquidEffect: Effect | null;
  /** Removes every listener this instance added, pointer input included. */
  teardown: () => void;
};

const SHAPE_MAP: Record<PixelBlastShape, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

const createTouchTexture = (): TouchTexture => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const trail: TouchPoint[] = [];
  let last: { x: number; y: number } | null = null;
  const maxAge = 64;
  let radius = 0.1 * size;
  const speed = 1 / maxAge;

  const clear = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);
  const easeOutQuad = (t: number) => -t * (t - 2);

  const drawPoint = (p: TouchPoint) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    let intensity = 1;
    if (p.age < maxAge * 0.3) {
      intensity = easeOutSine(p.age / (maxAge * 0.3));
    } else {
      intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0;
    }
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,1)";
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const addTouch = (norm: { x: number; y: number }, forceOverride?: number) => {
    let force = 0;
    let vx = 0;
    let vy = 0;

    if (forceOverride !== undefined) {
      // Tap or click. Push outwards in a random direction so a still finger
      // still ripples the field instead of waiting for a drag.
      force = forceOverride;
      const angle = Math.random() * Math.PI * 2;
      vx = Math.cos(angle);
      vy = Math.sin(angle);
    } else if (last) {
      const dx = norm.x - last.x;
      const dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / (d || 1);
      vy = dy / (d || 1);
      force = Math.min(dd * 10000, 1);
    }

    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };

  const reset = () => {
    last = null;
    trail.length = 0;
    clear();
    texture.needsUpdate = true;
  };

  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const f = point.force * speed * (1 - point.age / maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > maxAge) trail.splice(i, 1);
    }
    for (let i = 0; i < trail.length; i++) drawPoint(trail[i]);
    texture.needsUpdate = true;
  };

  const touch: TouchTexture = {
    texture,
    addTouch,
    update,
    reset,
    radiusScale: 1,
  };

  Object.defineProperty(touch, "radiusScale", {
    get: () => radius / (0.1 * size),
    set: (v: number) => {
      radius = 0.1 * size * v;
    },
    enumerable: true,
    configurable: true,
  });

  return touch;
};

const createLiquidEffect = (
  texture: THREE.Texture,
  opts: { strength?: number; freq?: number } = {},
) => {
  const fragment = `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;

    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;

      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);

      float amt = uStrength * intensity * wave;

      uv += vec2(vx, vy) * amt;
    }
  `;

  return new Effect("LiquidEffect", fragment, {
    uniforms: new Map<string, THREE.Uniform>([
      ["uTexture", new THREE.Uniform(texture)],
      ["uStrength", new THREE.Uniform(opts.strength ?? 0.025)],
      ["uTime", new THREE.Uniform(0)],
      ["uFreq", new THREE.Uniform(opts.freq ?? 4.5)],
    ]),
  });
};

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;

  // sRGB gamma correction, convert linear to sRGB for accurate color output
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );

  fragColor = vec4(srgbColor, M);
}
`;

export default function PixelBlast({
  variant = "square",
  pixelSize = 3,
  color = "#8C8C8C",
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0,
  onError,
}: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<ThreeInstance | null>(null);
  const prevConfigRef = useRef<{ antialias: boolean; liquid: boolean; noiseAmount: number } | null>(null);
  const speedRef = useRef(speed);
  const visibleRef = useRef(true);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    speedRef.current = speed;

    let observer: IntersectionObserver | null = null;
    let visibilityHandler: (() => void) | null = null;
    if (autoPauseOffscreen && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      observer.observe(container);
    }
    if (typeof document !== "undefined") {
      visibilityHandler = () => {
        visibleRef.current = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", visibilityHandler);
    }

    const needsReinitKeys = ["antialias", "liquid", "noiseAmount"] as const;
    const cfg = { antialias, liquid, noiseAmount };
    let mustReinit = false;

    if (!threeRef.current) {
      mustReinit = true;
    } else if (prevConfigRef.current) {
      for (const k of needsReinitKeys) {
        if (prevConfigRef.current[k] !== cfg[k]) {
          mustReinit = true;
          break;
        }
      }
    }

    const dispose = () => {
      const t = threeRef.current;
      if (!t) return;
      t.teardown();
      t.quad.geometry.dispose();
      t.material.dispose();
      t.timer.disconnect();
      t.composer?.dispose();
      t.renderer.dispose();
      t.renderer.forceContextLoss();
      if (t.renderer.domElement.parentElement === container) {
        container.removeChild(t.renderer.domElement);
      }
      threeRef.current = null;
    };

    if (mustReinit) {
      dispose();

      const canvas = document.createElement("canvas");
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        onErrorRef.current?.();
        return () => undefined;
      }

      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
      if (transparent) renderer.setClearAlpha(0);
      else renderer.setClearColor(0x000000, 1);

      const uniforms: PixelBlastUniforms = {
        uResolution: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uClickPos: {
          value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)),
        },
        uClickTimes: { value: new Float32Array(MAX_CLICKS) },
        uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
        uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
        uScale: { value: patternScale },
        uDensity: { value: patternDensity },
        uPixelJitter: { value: pixelSizeJitter },
        uEnableRipples: { value: enableRipples ? 1 : 0 },
        uRippleSpeed: { value: rippleSpeed },
        uRippleThickness: { value: rippleThickness },
        uRippleIntensity: { value: rippleIntensityScale },
        uEdgeFade: { value: edgeFade },
      };

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SRC,
        fragmentShader: FRAGMENT_SRC,
        uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        glslVersion: THREE.GLSL3,
      });

      const quadGeom = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(quadGeom, material);
      scene.add(quad);

      // THREE.Clock is deprecated in this version, Timer is the replacement.
      const timer = new THREE.Timer();
      if (typeof document !== "undefined") timer.connect(document);
      const instance: ThreeInstance = {
        renderer,
        scene,
        camera,
        material,
        timer,
        clickIx: 0,
        uniforms,
        resizeObserver: null as unknown as ResizeObserver,
        raf: 0,
        quad,
        composer: null,
        touch: null,
        liquidEffect: null,
        teardown: () => undefined,
      };

      // One place that keeps the drawing buffer, the resolution uniform and the
      // pixel grid size in step with the element, the device pixel ratio and
      // the viewport. A zero sized element falls back to the window, so the
      // field is never left blank.
      const syncSize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (renderer.getPixelRatio() !== dpr) renderer.setPixelRatio(dpr);

        const w = container.clientWidth || window.innerWidth || 1;
        const h = container.clientHeight || window.innerHeight || 1;
        renderer.setSize(w, h, false);

        const bufferWidth = renderer.domElement.width || 1;
        const bufferHeight = renderer.domElement.height || 1;
        uniforms.uResolution.value.set(bufferWidth, bufferHeight);
        uniforms.uPixelSize.value = Math.max(1, pixelSize * renderer.getPixelRatio());
        instance.composer?.setSize(bufferWidth, bufferHeight);
      };
      syncSize();

      const ro = new ResizeObserver(syncSize);
      ro.observe(container);
      instance.resizeObserver = ro;

      // Device pixel ratio changes when the window moves to another screen or
      // the browser zoom changes. matchMedia is the only reliable signal.
      let dprQuery: MediaQueryList | null = null;
      const onDprChange = () => {
        syncSize();
        watchDpr();
      };
      const watchDpr = () => {
        dprQuery?.removeEventListener("change", onDprChange);
        dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
        dprQuery.addEventListener("change", onDprChange);
      };
      watchDpr();

      // A lost context leaves a blank canvas behind. Hand it to the static
      // fallback instead of showing nothing.
      const onContextLost = (e: Event) => {
        e.preventDefault();
        onErrorRef.current?.();
      };
      canvas.addEventListener("webglcontextlost", onContextLost, false);
      window.addEventListener("orientationchange", syncSize);

      const randomFloat = () => {
        if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
          const u32 = new Uint32Array(1);
          window.crypto.getRandomValues(u32);
          return u32[0] / 0xffffffff;
        }
        return Math.random();
      };
      const timeOffset = randomFloat() * 1000;

      if (liquid) {
        const touch = createTouchTexture();
        touch.radiusScale = liquidRadius;
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const liquidEffect = createLiquidEffect(touch.texture, {
          strength: liquidStrength,
          freq: liquidWobbleSpeed,
        });
        const effectPass = new EffectPass(camera, liquidEffect);
        effectPass.renderToScreen = true;
        composer.addPass(effectPass);
        instance.composer = composer;
        instance.touch = touch;
        instance.liquidEffect = liquidEffect;
      }

      if (noiseAmount > 0) {
        if (!instance.composer) {
          const composer = new EffectComposer(renderer);
          composer.addPass(new RenderPass(scene, camera));
          instance.composer = composer;
        }
        const noiseEffect = new Effect(
          "NoiseEffect",
          `uniform float uTime;
           uniform float uAmount;
           float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
           void mainUv(inout vec2 uv){}
           void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
             float n = hash(floor(uv*vec2(1920.0,1080.0)) + floor(uTime*60.0));
             float g = (n-0.5)*uAmount;
             outputColor = inputColor + vec4(vec3(g),0.0);
           }`,
          {
            uniforms: new Map<string, THREE.Uniform>([
              ["uTime", new THREE.Uniform(0)],
              ["uAmount", new THREE.Uniform(noiseAmount)],
            ]),
          },
        );
        const composer = instance.composer;
        const noisePass = new EffectPass(camera, noiseEffect);
        noisePass.renderToScreen = true;
        composer.passes.forEach((p) => {
          p.renderToScreen = false;
        });
        composer.addPass(noisePass);
      }

      instance.composer?.setSize(renderer.domElement.width, renderer.domElement.height);

      const mapToPixels = (e: PointerEvent) => {
        const el = renderer.domElement;
        const rect = el.getBoundingClientRect();
        // Nothing to map while the canvas has no size.
        if (rect.width < 1 || rect.height < 1 || el.width < 1 || el.height < 1) return null;
        const scaleX = el.width / rect.width;
        const scaleY = el.height / rect.height;
        return {
          fx: (e.clientX - rect.left) * scaleX,
          fy: (rect.height - (e.clientY - rect.top)) * scaleY,
          w: el.width,
          h: el.height,
        };
      };

      const onPointerDown = (e: PointerEvent) => {
        const point = mapToPixels(e);
        if (!point) return;
        const ix = instance.clickIx;
        uniforms.uClickPos.value[ix].set(point.fx, point.fy);
        uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
        instance.clickIx = (ix + 1) % MAX_CLICKS;
        // A tap blooms the field straight away, before any drag movement.
        instance.touch?.addTouch({ x: point.fx / point.w, y: point.fy / point.h }, 0.85);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!instance.touch) return;
        const point = mapToPixels(e);
        if (!point) return;
        instance.touch.addTouch({ x: point.fx / point.w, y: point.fy / point.h });
      };
      const onPointerLeave = () => instance.touch?.reset();

      // Pointer input lives on the window, so the field reacts wherever the
      // pointer is, the card included. Every listener is passive and none of
      // them call preventDefault, so the card keeps its own hover, tilt, tap
      // and copy behaviour, and scrolling is untouched. Only the backdrop moves.
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerLeave, { passive: true });
      window.addEventListener("pointercancel", onPointerLeave, { passive: true });
      window.addEventListener("blur", onPointerLeave);
      document.addEventListener("pointerleave", onPointerLeave, { passive: true });

      instance.teardown = () => {
        ro.disconnect();
        cancelAnimationFrame(instance.raf);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerLeave);
        window.removeEventListener("pointercancel", onPointerLeave);
        window.removeEventListener("blur", onPointerLeave);
        document.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("orientationchange", syncSize);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        dprQuery?.removeEventListener("change", onDprChange);
      };

      const animate = () => {
        if (autoPauseOffscreen && !visibleRef.current) {
          instance.raf = requestAnimationFrame(animate);
          return;
        }
        timer.update();
        uniforms.uTime.value = timeOffset + timer.getElapsed() * speedRef.current;
        if (instance.liquidEffect) {
          instance.liquidEffect.uniforms.get("uTime")!.value = uniforms.uTime.value;
        }
        if (instance.composer) {
          instance.touch?.update();
          instance.composer.passes.forEach((pass) => {
            const effects = (pass as unknown as { effects?: Effect[] }).effects;
            effects?.forEach((eff) => {
              const u = eff.uniforms?.get("uTime");
              if (u) u.value = uniforms.uTime.value;
            });
          });
          instance.composer.render();
        } else {
          renderer.render(scene, camera);
        }
        instance.raf = requestAnimationFrame(animate);
      };
      instance.raf = requestAnimationFrame(animate);

      threeRef.current = instance;
    } else {
      const t = threeRef.current;
      if (!t) return;
      t.uniforms.uShapeType.value = SHAPE_MAP[variant] ?? 0;
      t.uniforms.uPixelSize.value = pixelSize * t.renderer.getPixelRatio();
      t.uniforms.uColor.value.set(color);
      t.uniforms.uScale.value = patternScale;
      t.uniforms.uDensity.value = patternDensity;
      t.uniforms.uPixelJitter.value = pixelSizeJitter;
      t.uniforms.uEnableRipples.value = enableRipples ? 1 : 0;
      t.uniforms.uRippleIntensity.value = rippleIntensityScale;
      t.uniforms.uRippleThickness.value = rippleThickness;
      t.uniforms.uRippleSpeed.value = rippleSpeed;
      t.uniforms.uEdgeFade.value = edgeFade;
      if (transparent) t.renderer.setClearAlpha(0);
      else t.renderer.setClearColor(0x000000, 1);
      if (t.liquidEffect) {
        // Fixed: upstream read the Effect itself instead of its uStrength uniform.
        t.liquidEffect.uniforms.get("uStrength")!.value = liquidStrength;
        t.liquidEffect.uniforms.get("uFreq")!.value = liquidWobbleSpeed;
      }
      if (t.touch) t.touch.radiusScale = liquidRadius;
    }

    prevConfigRef.current = cfg;

    return () => {
      observer?.disconnect();
      if (visibilityHandler) document.removeEventListener("visibilitychange", visibilityHandler);
      dispose();
    };
  }, [
    antialias,
    liquid,
    noiseAmount,
    pixelSize,
    patternScale,
    patternDensity,
    enableRipples,
    rippleIntensityScale,
    rippleThickness,
    rippleSpeed,
    pixelSizeJitter,
    edgeFade,
    transparent,
    liquidStrength,
    liquidRadius,
    liquidWobbleSpeed,
    autoPauseOffscreen,
    variant,
    color,
    speed,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pixel-blast-container${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    />
  );
}