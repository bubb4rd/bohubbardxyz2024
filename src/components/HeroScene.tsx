"use client";

import Topography from "./Topography";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function HeroScene() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div className="hero-bg bg-gradient-subtle" aria-hidden="true">
        <div className="hero-fade" />
      </div>
    );
  }

  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="absolute inset-0">
        <Topography
          lowColor="#acb6f0"
          midColor="#363547"
          highColor="#FFFFFF"
          speed={0.35}
          morphAmount={3}
          morphSpeed={0.05}
          bands={2}
          thickness={0.01}
          scale={2}
          pixelSize={1}
          glow={0.8}
          colorMode="elevation"
          contrast={3}
          brightness={1}
          fillBands={false}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseRadius={0.3}
          mouseStrength={0.4}
        />
      </div>
      <div className="hero-fade" />
    </div>
  );
}
