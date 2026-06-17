"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5 + uMouse * 0.06;

    float wave1 = sin(p.x * 4.0 + uTime * 0.12) * cos(p.y * 3.5 - uTime * 0.1);
    float wave2 = sin(length(p) * 8.0 - uTime * 0.18);
    float blend = wave1 * 0.5 + wave2 * 0.5;

    vec3 blue   = vec3(0.231, 0.510, 0.965);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 coral  = vec3(0.957, 0.447, 0.714);

    vec3 color = mix(blue, violet, uv.x + blend * 0.15);
    color = mix(color, coral, uv.y * 0.55 + blend * 0.1);

    float alpha = 0.07 + blend * 0.025;
    gl_FragColor = vec4(color, alpha);
  }
`;

function GradientWash({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[14, 10]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  );
}

function HeroBlobs() {
  const wrap1 = useRef<HTMLDivElement>(null);
  const wrap2 = useRef<HTMLDivElement>(null);
  const wrap3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wraps = [wrap1, wrap2, wrap3];
    const depths = [18, 28, 22];

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      wraps.forEach((ref, i) => {
        if (!ref.current) return;
        const d = depths[i];
        ref.current.style.transform = `translate(${x * d}px, ${y * d}px)`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={wrap1} className="absolute inset-0 will-change-transform">
        <div className="hero-blob hero-blob-1" />
      </div>
      <div ref={wrap2} className="absolute inset-0 will-change-transform">
        <div className="hero-blob hero-blob-2" />
      </div>
      <div ref={wrap3} className="absolute inset-0 will-change-transform">
        <div className="hero-blob hero-blob-3" />
      </div>
    </>
  );
}

export function HeroScene() {
  const reducedMotion = usePrefersReducedMotion();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="hero-bg bg-gradient-subtle" aria-hidden="true">
        <div className="hero-fade" />
      </div>
    );
  }

  return (
    <div className="hero-bg" aria-hidden="true">
      <HeroBlobs />
      <div className="hero-grid" />
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <GradientWash mouse={mouse} />
        </Canvas>
      </div>
      <div className="hero-grain" />
      <div className="hero-fade" />
    </div>
  );
}
