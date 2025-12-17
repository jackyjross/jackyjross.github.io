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
        uniform float uSpeed;
        uniform float uIntensity;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
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

            // Create flowing gradient with multiple noise layers
            float noise1 = snoise(st * 2.0 + uTime * uSpeed * 0.3);
            float noise2 = snoise(st * 3.0 - uTime * uSpeed * 0.2);
            float noise3 = snoise(st * 1.5 + vec2(uTime * uSpeed * 0.15));

            // Combine noise for smooth organic movement
            float combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.3) / 1.8;

            // Create gradient position that animates over time
            float gradientPos = st.x * 0.5 + st.y * 0.5 + combinedNoise * uIntensity;
            gradientPos += sin(uTime * uSpeed * 0.5) * 0.2;

            // Smooth gradient transitions between three colors
            vec3 color;
            if (gradientPos < 0.5) {
                color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, gradientPos));
            } else {
                color = mix(uColor2, uColor3, smoothstep(0.5, 1.0, gradientPos));
            }

            // Add subtle organic variation
            color += combinedNoise * 0.03;

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // Shader parameters (adjustable via Tweakpane)
    const params = {
        speed: 0.15,
        intensity: 0.3,
        opacity: 0.4,
        color1: { r: 0.1, g: 0.15, b: 0.25 },  // Deep blue
        color2: { r: 0.15, g: 0.1, b: 0.2 },   // Purple
        color3: { r: 0.08, g: 0.12, b: 0.18 }  // Dark blue
    };

    // Light theme colors
    const lightThemeColors = {
        color1: { r: 0.7, g: 0.75, b: 0.85 },  // Light blue
        color2: { r: 0.75, g: 0.7, b: 0.8 },   // Light purple
        color3: { r: 0.65, g: 0.72, b: 0.78 }  // Light blue-gray
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uSpeed: { value: params.speed },
            uIntensity: { value: params.intensity },
            uColor1: { value: new THREE.Vector3(params.color1.r, params.color1.g, params.color1.b) },
            uColor2: { value: new THREE.Vector3(params.color2.r, params.color2.g, params.color2.b) },
            uColor3: { value: new THREE.Vector3(params.color3.r, params.color3.g, params.color3.b) }
        }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Function to update gradient colors based on theme
    const updateThemeColors = () => {
        const isLightTheme = document.body.classList.contains('light-theme');
        if (isLightTheme) {
            material.uniforms.uColor1.value.set(lightThemeColors.color1.r, lightThemeColors.color1.g, lightThemeColors.color1.b);
            material.uniforms.uColor2.value.set(lightThemeColors.color2.r, lightThemeColors.color2.g, lightThemeColors.color2.b);
            material.uniforms.uColor3.value.set(lightThemeColors.color3.r, lightThemeColors.color3.g, lightThemeColors.color3.b);
            canvas.style.opacity = 0.25;
        } else {
            material.uniforms.uColor1.value.set(params.color1.r, params.color1.g, params.color1.b);
            material.uniforms.uColor2.value.set(params.color2.r, params.color2.g, params.color2.b);
            material.uniforms.uColor3.value.set(params.color3.r, params.color3.g, params.color3.b);
            canvas.style.opacity = params.opacity;
        }
    };

    // Listen for theme changes
    const observer = new MutationObserver(() => {
        updateThemeColors();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Apply initial theme
    updateThemeColors();

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
            title: 'Gradient Controls',
            expanded: true,
        });

        // Animation folder
        const animFolder = pane.addFolder({
            title: 'Animation',
            expanded: true,
        });

        animFolder.addBinding(params, 'speed', {
            min: 0.0,
            max: 0.5,
            step: 0.01,
            label: 'Speed'
        }).on('change', (e) => {
            material.uniforms.uSpeed.value = e.value;
        });

        animFolder.addBinding(params, 'intensity', {
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Intensity'
        }).on('change', (e) => {
            material.uniforms.uIntensity.value = e.value;
        });

        animFolder.addBinding(params, 'opacity', {
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Opacity'
        }).on('change', (e) => {
            canvas.style.opacity = e.value;
        });

        // Colors folder
        const colorFolder = pane.addFolder({
            title: 'Colors',
            expanded: true,
        });

        colorFolder.addBinding(params, 'color1', {
            label: 'Color 1',
            color: { type: 'float' }
        }).on('change', (e) => {
            material.uniforms.uColor1.value.set(e.value.r, e.value.g, e.value.b);
        });

        colorFolder.addBinding(params, 'color2', {
            label: 'Color 2',
            color: { type: 'float' }
        }).on('change', (e) => {
            material.uniforms.uColor2.value.set(e.value.r, e.value.g, e.value.b);
        });

        colorFolder.addBinding(params, 'color3', {
            label: 'Color 3',
            color: { type: 'float' }
        }).on('change', (e) => {
            material.uniforms.uColor3.value.set(e.value.r, e.value.g, e.value.b);
        });

        // Presets
        const presetFolder = pane.addFolder({
            title: 'Presets',
            expanded: false,
        });

        const PRESETS = {
            'Deep Ocean (Current)': () => {
                params.speed = 0.15;
                params.intensity = 0.3;
                params.opacity = 0.4;
                params.color1 = { r: 0.1, g: 0.15, b: 0.25 };
                params.color2 = { r: 0.15, g: 0.1, b: 0.2 };
                params.color3 = { r: 0.08, g: 0.12, b: 0.18 };
            },
            'Purple Haze': () => {
                params.speed = 0.12;
                params.intensity = 0.4;
                params.opacity = 0.45;
                params.color1 = { r: 0.2, g: 0.1, b: 0.25 };
                params.color2 = { r: 0.15, g: 0.05, b: 0.3 };
                params.color3 = { r: 0.1, g: 0.15, b: 0.2 };
            },
            'Warm Sunset': () => {
                params.speed = 0.1;
                params.intensity = 0.35;
                params.opacity = 0.4;
                params.color1 = { r: 0.25, g: 0.1, b: 0.15 };
                params.color2 = { r: 0.2, g: 0.15, b: 0.1 };
                params.color3 = { r: 0.15, g: 0.08, b: 0.2 };
            },
            'Mint Fresh': () => {
                params.speed = 0.18;
                params.intensity = 0.3;
                params.opacity = 0.35;
                params.color1 = { r: 0.08, g: 0.2, b: 0.18 };
                params.color2 = { r: 0.1, g: 0.15, b: 0.2 };
                params.color3 = { r: 0.12, g: 0.18, b: 0.15 };
            },
            'Monochrome': () => {
                params.speed = 0.08;
                params.intensity = 0.25;
                params.opacity = 0.3;
                params.color1 = { r: 0.05, g: 0.05, b: 0.05 };
                params.color2 = { r: 0.1, g: 0.1, b: 0.1 };
                params.color3 = { r: 0.08, g: 0.08, b: 0.08 };
            }
        };

        const updateUniforms = () => {
            material.uniforms.uSpeed.value = params.speed;
            material.uniforms.uIntensity.value = params.intensity;
            material.uniforms.uColor1.value.set(params.color1.r, params.color1.g, params.color1.b);
            material.uniforms.uColor2.value.set(params.color2.r, params.color2.g, params.color2.b);
            material.uniforms.uColor3.value.set(params.color3.r, params.color3.g, params.color3.b);
            canvas.style.opacity = params.opacity;
        };

        Object.keys(PRESETS).forEach(name => {
            presetFolder.addButton({
                title: name,
            }).on('click', () => {
                PRESETS[name]();
                pane.refresh();
                updateUniforms();
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
