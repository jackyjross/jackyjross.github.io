'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ShaderBackgroundProps {
  isDark: boolean;
}

export default function ShaderBackground({ isDark }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Shader code
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = vUv;
        float noise1 = snoise(st * 2.0 + uTime * uSpeed * 0.3);
        float noise2 = snoise(st * 3.0 - uTime * uSpeed * 0.2);
        float noise3 = snoise(st * 1.5 + vec2(uTime * uSpeed * 0.15));
        float combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.3) / 1.8;
        float gradientPos = st.x * 0.5 + st.y * 0.5 + combinedNoise * uIntensity;
        gradientPos += sin(uTime * uSpeed * 0.5) * 0.2;

        vec3 color;
        if (gradientPos < 0.5) {
          color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, gradientPos));
        } else {
          color = mix(uColor2, uColor3, smoothstep(0.5, 1.0, gradientPos));
        }
        color += combinedNoise * 0.03;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const darkColors = {
      color1: { r: 0.1, g: 0.15, b: 0.25 },
      color2: { r: 0.15, g: 0.1, b: 0.2 },
      color3: { r: 0.08, g: 0.12, b: 0.18 }
    };

    const lightColors = {
      color1: { r: 0.7, g: 0.75, b: 0.85 },
      color2: { r: 0.75, g: 0.7, b: 0.8 },
      color3: { r: 0.65, g: 0.72, b: 0.78 }
    };

    const colors = isDark ? darkColors : lightColors;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uSpeed: { value: 0.15 },
        uIntensity: { value: 0.3 },
        uColor1: { value: new THREE.Vector3(colors.color1.r, colors.color1.g, colors.color1.b) },
        uColor2: { value: new THREE.Vector3(colors.color2.r, colors.color2.g, colors.color2.b) },
        uColor3: { value: new THREE.Vector3(colors.color3.r, colors.color3.g, colors.color3.b) }
      }
    });

    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    sceneRef.current = scene;

    let animationId: number;
    function animate(time: number) {
      if (material) {
        material.uniforms.uTime.value = time * 0.001;
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate(0);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      if (material) {
        material.uniforms.uResolution.value.set(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Update colors when theme changes
  useEffect(() => {
    if (!materialRef.current) return;

    const darkColors = {
      color1: { r: 0.1, g: 0.15, b: 0.25 },
      color2: { r: 0.15, g: 0.1, b: 0.2 },
      color3: { r: 0.08, g: 0.12, b: 0.18 }
    };

    const lightColors = {
      color1: { r: 0.7, g: 0.75, b: 0.85 },
      color2: { r: 0.75, g: 0.7, b: 0.8 },
      color3: { r: 0.65, g: 0.72, b: 0.78 }
    };

    const colors = isDark ? darkColors : lightColors;

    materialRef.current.uniforms.uColor1.value.set(colors.color1.r, colors.color1.g, colors.color1.b);
    materialRef.current.uniforms.uColor2.value.set(colors.color2.r, colors.color2.g, colors.color2.b);
    materialRef.current.uniforms.uColor3.value.set(colors.color3.r, colors.color3.g, colors.color3.b);
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${
        isDark ? 'opacity-40' : 'opacity-25'
      } transition-opacity duration-300`}
    />
  );
}
