
(function () {
    const container = document.getElementById('canvas-container-3d');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- Particles ---
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
        // Spread heavily in a tube/tunnel shape or sphere
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Graduate colors
        // Dark Cyan to purple
        color.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.5);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 20;

    // --- Interaction ---
    let mouseX = 0;
    let mouseY = 0;

    // Theme Colors
    const fogColorDark = 0x0a0a0a; // Fits body bg
    const fogColorLight = 0xf3f4f6;

    // Watch for theme changes
    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.attributeName === 'class') {
                const isLight = document.documentElement.classList.contains('light');
                scene.fog.color.setHex(isLight ? fogColorLight : fogColorDark);
                // Also dim particles in light mode?
                material.opacity = isLight ? 0.5 : 0.8;
            }
        });
    });
    themeObserver.observe(document.documentElement, { attributes: true, subtree: false });

    // Initial check
    if (document.documentElement.classList.contains('light')) {
        scene.fog.color.setHex(fogColorLight);
        material.opacity = 0.5;
    }

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    });

    // --- Animation ---
    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

})();
