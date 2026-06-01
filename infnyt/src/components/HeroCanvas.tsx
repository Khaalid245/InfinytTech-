"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class InfinityCurve extends (THREE.Curve as any)<THREE.Vector3> {
  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const angle  = t * Math.PI * 2;
    const scale  = 2.2;
    const denom  = 1 + Math.sin(angle) ** 2;
    const x = (scale * Math.cos(angle)) / denom;
    const y = (scale * Math.sin(angle) * Math.cos(angle)) / denom;
    const z = Math.sin(angle * 2) * 0.15;
    return optionalTarget.set(x, y, z);
  }
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = "transparent";
    container.appendChild(renderer.domElement);

    // Environment for reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Infinity mesh
    const TUBULAR  = 400;
    const RADIAL   = 24;
    const curve    = new InfinityCurve() as unknown as THREE.Curve<THREE.Vector3>;
    const tubeGeo  = new THREE.TubeGeometry(curve, TUBULAR, 0.18, RADIAL, true);

    // Vertex colours — first half chartreuse, second half white, small blend zone
    const totalVerts  = (TUBULAR + 1) * (RADIAL + 1);
    const colorData   = new Float32Array(totalVerts * 3);
    const chartreuse  = new THREE.Color(0x4d686b);
    const white       = new THREE.Color(0x4d686b);
    const blendWidth  = 0.045;

    for (let i = 0; i <= TUBULAR; i++) {
      const t = i / TUBULAR;
      let c: THREE.Color;
      if (t < 0.5 - blendWidth) {
        c = chartreuse;
      } else if (t < 0.5 + blendWidth) {
        c = chartreuse.clone().lerp(white, (t - (0.5 - blendWidth)) / (2 * blendWidth));
      } else {
        c = white;
      }
      for (let j = 0; j <= RADIAL; j++) {
        const idx = (i * (RADIAL + 1) + j) * 3;
        colorData[idx]     = c.r;
        colorData[idx + 1] = c.g;
        colorData[idx + 2] = c.b;
      }
    }
    tubeGeo.setAttribute("color", new THREE.BufferAttribute(colorData, 3));

    const material = new THREE.MeshPhysicalMaterial({
      vertexColors:       true,
      emissive:           new THREE.Color(0x4d686b),
      emissiveIntensity:  0.55,
      metalness:          0.1,
      roughness:          0.45,
      clearcoat:          0.2,
      clearcoatRoughness: 0.4,
    });
    const mesh = new THREE.Mesh(tubeGeo, material);
    scene.add(mesh);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    // Smooth cursor tracking
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.tx =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    // Animate
    const clock = new THREE.Clock();
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mouse.cx += (mouse.tx - mouse.cx) * 0.05;
      mouse.cy += (mouse.ty - mouse.cy) * 0.05;
      mesh.rotation.y = t * 0.3  + mouse.cx * 0.4;
      mesh.rotation.x = Math.sin(t * 0.2) * 0.1 + mouse.cy * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      tubeGeo.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
