// 3D hero scene: wireframe icosahedron + particle field with mouse parallax.
import * as THREE from "three";
const container = document.getElementById("hero-canvas");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 11);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    // Theme-aware colors
    const COLORS = {
        accent: 0x38bdf8,
        lightAccent: 0x0284c7,
        particlesDark: 0x64748b,
        particlesLight: 0x94a3b8,
    };
    let accentColor = new THREE.Color(COLORS.accent);
    let particleColor = new THREE.Color(COLORS.particlesDark);
    function applyTheme(mode) {
        accentColor = new THREE.Color(mode === "light" ? COLORS.lightAccent : COLORS.accent);
        particleColor = new THREE.Color(mode === "light" ? COLORS.particlesLight : COLORS.particlesDark);
        if (icosahedron)
            icosahedron.material.color = accentColor;
        if (inner)
            inner.material.color = accentColor;
        particles.forEach((p) => p.material.color = particleColor);
    }
    // Main wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(3.2, 1);
    const mat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.55 });
    const icosahedron = new THREE.Mesh(geo, mat);
    scene.add(icosahedron);
    // Inner solid core, subtly transparent
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.08,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);
    // Orbiting vertices dots
    const dotsGeo = new THREE.BufferGeometry();
    const positions = Float32Array.from(geo.attributes.position.array);
    dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ color: accentColor, size: 0.08, transparent: true, opacity: 0.9 }));
    scene.add(dots);
    // Particle field
    const particles = [];
    const fieldGeo = new THREE.BufferGeometry();
    const count = 900;
    const fieldPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        fieldPos[i * 3] = (Math.random() - 0.5) * 40;
        fieldPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
        fieldPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    fieldGeo.setAttribute("position", new THREE.BufferAttribute(fieldPos, 3));
    const field = new THREE.Points(fieldGeo, new THREE.PointsMaterial({ color: particleColor, size: 0.035, transparent: true, opacity: 0.7 }));
    scene.add(field);
    particles.push(field);
    // Responsive positioning: keep geometry clear of hero text on small screens
    function layout() {
        const wide = window.innerWidth >= 1024;
        icosahedron.position.x = wide ? 4.2 : 0;
        inner.position.x = icosahedron.position.x;
        dots.position.x = icosahedron.position.x;
        icosahedron.position.y = wide ? 0 : 3.4;
        inner.position.y = icosahedron.position.y;
        dots.position.y = icosahedron.position.y;
    }
    layout();
    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    window.addEventListener("pointermove", (e) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener("themechange", ((e) => {
        applyTheme(e.detail);
    }));
    applyTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        layout();
    });
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        mouse.x += (target.x - mouse.x) * 0.03;
        mouse.y += (target.y - mouse.y) * 0.03;
        icosahedron.rotation.y = t * 0.18;
        icosahedron.rotation.x = t * 0.07 + mouse.y * 0.3;
        inner.rotation.y = -t * 0.3;
        inner.rotation.z = t * 0.12;
        dots.rotation.y = t * 0.18;
        dots.rotation.x = icosahedron.rotation.x;
        field.rotation.y = t * 0.015;
        field.position.y = Math.sin(t * 0.4) * 0.4;
        icosahedron.position.y += Math.sin(t * 0.8) * 0.0025;
        dots.position.y = inner.position.y = icosahedron.position.y;
        inner.scale.setScalar(1 + Math.sin(t * 1.4) * 0.05);
        camera.position.x = mouse.x * 0.6;
        camera.position.y = -mouse.y * 0.4;
        camera.lookAt(0, wideYOffset(), 0);
        renderer.render(scene, camera);
    }
    function wideYOffset() {
        return window.innerWidth >= 1024 ? 0 : 2.4;
    }
    if (prefersReduced) {
        // Render a single static frame
        renderer.render(scene, camera);
    }
    else {
        animate();
    }
}
//# sourceMappingURL=scene.js.map