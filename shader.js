// WebGL Shader Background with Three.js
(() => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Shader material
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
        uniform float uScale;
        uniform float uSpeed;
        uniform float uBrightness;
        uniform float uContrast;
        uniform float uNoiseStrength;
        uniform float uPatternMix;
        varying vec2 vUv;

        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187,
                                0.366025403784439,
                               -0.577350269189626,
                                0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));

            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 st = vUv;
            vec2 pos = st * uScale;

            // Animated noise layers (adjustable speed)
            float n1 = snoise(pos + uTime * uSpeed * 0.5);
            float n2 = snoise(pos * 1.5 - uTime * uSpeed * 0.8);
            float n3 = snoise(pos * 2.5 + uTime * uSpeed * 0.4);

            // Combine noise layers
            float noise = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;

            // Create flowing pattern
            float pattern = sin(pos.x + noise * uNoiseStrength) * cos(pos.y + noise * uNoiseStrength);
            pattern = smoothstep(-uContrast, uContrast, pattern);

            // Adjustable color (grayscale with brightness control)
            vec3 color = vec3(noise * uBrightness * 0.5 + uBrightness * 0.5);
            color = mix(color, vec3(pattern * uBrightness), uPatternMix);

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // Shader parameters (adjustable via Tweakpane)
    const params = {
        scale: 3.0,
        speed: 0.1,
        brightness: 0.15,
        contrast: 0.3,
        noiseStrength: 1.5,
        patternMix: 0.2,
        opacity: 0.3
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uScale: { value: params.scale },
            uSpeed: { value: params.speed },
            uBrightness: { value: params.brightness },
            uContrast: { value: params.contrast },
            uNoiseStrength: { value: params.noiseStrength },
            uPatternMix: { value: params.patternMix }
        }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    function animate(time) {
        material.uniforms.uTime.value = time * 0.001;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate(0);

    // Handle resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        material.uniforms.uResolution.value.set(width, height);
    });

    // Tweakpane Setup
    if (typeof Tweakpane !== 'undefined') {
        const pane = new Tweakpane.Pane({
            title: 'Shader Controls',
            expanded: true,
        });

        // Animation folder
        const animFolder = pane.addFolder({
            title: 'Animation',
            expanded: true,
        });

        animFolder.addBinding(params, 'scale', {
            min: 1.0,
            max: 10.0,
            step: 0.1,
            label: 'Scale'
        }).on('change', (e) => {
            material.uniforms.uScale.value = e.value;
        });

        animFolder.addBinding(params, 'speed', {
            min: 0.0,
            max: 0.5,
            step: 0.01,
            label: 'Speed'
        }).on('change', (e) => {
            material.uniforms.uSpeed.value = e.value;
        });

        animFolder.addBinding(params, 'noiseStrength', {
            min: 0.0,
            max: 5.0,
            step: 0.1,
            label: 'Noise Strength'
        }).on('change', (e) => {
            material.uniforms.uNoiseStrength.value = e.value;
        });

        // Appearance folder
        const appearFolder = pane.addFolder({
            title: 'Appearance',
            expanded: true,
        });

        appearFolder.addBinding(params, 'brightness', {
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Brightness'
        }).on('change', (e) => {
            material.uniforms.uBrightness.value = e.value;
        });

        appearFolder.addBinding(params, 'contrast', {
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Contrast'
        }).on('change', (e) => {
            material.uniforms.uContrast.value = e.value;
        });

        appearFolder.addBinding(params, 'patternMix', {
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Pattern Mix'
        }).on('change', (e) => {
            material.uniforms.uPatternMix.value = e.value;
        });

        appearFolder.addBinding(params, 'opacity', {
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Opacity'
        }).on('change', (e) => {
            canvas.style.opacity = e.value;
        });

        // Presets
        const presetFolder = pane.addFolder({
            title: 'Presets',
            expanded: false,
        });

        const PRESETS = {
            'Subtle (Current)': () => {
                params.scale = 3.0;
                params.speed = 0.1;
                params.brightness = 0.15;
                params.contrast = 0.3;
                params.noiseStrength = 1.5;
                params.patternMix = 0.2;
                params.opacity = 0.3;
            },
            'Flowing Gel': () => {
                params.scale = 4.0;
                params.speed = 0.15;
                params.brightness = 0.25;
                params.contrast = 0.4;
                params.noiseStrength = 2.5;
                params.patternMix = 0.5;
                params.opacity = 0.4;
            },
            'Organic Waves': () => {
                params.scale = 5.0;
                params.speed = 0.08;
                params.brightness = 0.2;
                params.contrast = 0.25;
                params.noiseStrength = 3.0;
                params.patternMix = 0.3;
                params.opacity = 0.35;
            },
            'Fast Liquid': () => {
                params.scale = 2.5;
                params.speed = 0.25;
                params.brightness = 0.3;
                params.contrast = 0.5;
                params.noiseStrength = 2.0;
                params.patternMix = 0.6;
                params.opacity = 0.45;
            },
            'Minimal': () => {
                params.scale = 6.0;
                params.speed = 0.05;
                params.brightness = 0.1;
                params.contrast = 0.2;
                params.noiseStrength = 1.0;
                params.patternMix = 0.1;
                params.opacity = 0.2;
            }
        };

        Object.keys(PRESETS).forEach(name => {
            presetFolder.addButton({
                title: name,
            }).on('click', () => {
                PRESETS[name]();
                pane.refresh();
                material.uniforms.uScale.value = params.scale;
                material.uniforms.uSpeed.value = params.speed;
                material.uniforms.uBrightness.value = params.brightness;
                material.uniforms.uContrast.value = params.contrast;
                material.uniforms.uNoiseStrength.value = params.noiseStrength;
                material.uniforms.uPatternMix.value = params.patternMix;
                canvas.style.opacity = params.opacity;
            });
        });

        // Export current settings
        pane.addButton({
            title: 'Log Current Values',
        }).on('click', () => {
            console.log('Current shader parameters:', params);
        });
    }
})();
