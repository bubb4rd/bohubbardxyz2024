"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, Star } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP);

const stackItems = [
  {
    id: "clients",
    src: "/images/endure-discord.png",
    alt: "Endure Discord branding graphic with crowned E mark on textured purple background",
    label: "Other Client Work",
    rotate: -14,
    y: 36,
    x: -58,
    scale: 0.9,
  },
  {
    id: "branding",
    src: "/images/bubbard-branding.png",
    alt: "BUBBARD branding logo with crown and green circle on textured black background",
    label: "BODE · BRANDING",
    rotate: 0,
    y: 18,
    x: 0,
    scale: 0.95,
  },
  {
    id: "wordmark",
    src: "/images/dame-caps-orange.png",
    alt: "Dame caps logo graphic by BUBBARD, chrome typography with orange glow",
    label: "Dame · Wordmark",
    rotate: 12,
    y: 0,
    x: 58,
    scale: 1,
  },
] as const;

function useCompactStack() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return compact;
}

function getLayerMetrics(
  item: (typeof stackItems)[number],
  activeIndex: number | null,
  index: number,
  compact: boolean,
) {
  const fan = compact ? 0.3 : 1;
  const isActive = activeIndex === index;

  return {
    x: isActive ? 0 : item.x * fan,
    y: isActive ? (compact ? -18 : -28) : item.y * (compact ? 0.8 : 1),
    rotate: isActive ? 0 : item.rotate * (compact ? 0.55 : 1),
    scale: isActive ? (compact ? 1.04 : 1.08) : item.scale * (compact ? 0.94 : 1),
  };
}

function applyLayerState(
  layer: HTMLDivElement,
  index: number,
  activeIndex: number | null,
  compact: boolean,
) {
  const item = stackItems[index];
  const metrics = getLayerMetrics(item, activeIndex, index, compact);
  const isActive = activeIndex === index;

  gsap.to(layer, {
    x: metrics.x,
    y: metrics.y,
    rotate: metrics.rotate,
    scale: metrics.scale,
    duration: 0.42,
    ease: "back.out(1.4)",
    overwrite: true,
  });

  layer.style.zIndex = isActive ? "50" : String(10 + index);
}

export function HeroDesignShowcase() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const compact = useCompactStack();

  useGSAP(
    () => {
      if (reducedMotion || !linkRef.current || !stackRef.current) return;

      const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
      const arrow = linkRef.current.querySelector(".hero-design-arrow");

      const setActive = (index: number | null) => {
        layers.forEach((layer, layerIndex) => {
          applyLayerState(layer, layerIndex, index, compact);
        });
      };

      layers.forEach((layer, index) => {
        layer.addEventListener("mouseenter", () => {
          setActive(index);
          gsap.to(arrow, { x: 3, y: -3, duration: 0.3 });
        });
      });

      stackRef.current.addEventListener("mouseleave", () => {
        setActive(null);
        gsap.to(arrow, { x: 0, y: 0, duration: 0.3 });
      });
    },
    { scope: linkRef, dependencies: [reducedMotion, compact] },
  );

  useEffect(() => {
    const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
    layers.forEach((layer, index) => {
      const metrics = getLayerMetrics(stackItems[index], null, index, compact);
      layer.style.transform = `translate3d(${metrics.x}px, ${metrics.y}px, 0) rotate(${metrics.rotate}deg) scale(${metrics.scale})`;
    });
  }, [compact]);

  return (
    <a
      ref={linkRef}
      href="https://be.net/bubbard"
      target="_blank"
      rel="noopener noreferrer"
      className="hero-design group relative mx-auto block w-full max-w-full cursor-pointer overflow-hidden sm:max-w-sm lg:max-w-none"
      aria-label="View BUBBARD design work on Behance"
    >
      <div
        ref={stackRef}
        className="relative mx-auto w-full max-w-[280px] overflow-hidden pt-10 sm:h-[min(420px,72vw)] sm:max-w-[360px] sm:pt-0"
      >
        <span className="hero-spotlight-tag pointer-events-none absolute top-0 right-0 z-20 sm:-top-12 sm:right-0 sm:-right-3">
          <Star className="h-3.5 w-3.5 fill-accent-violet text-accent-violet" strokeWidth={2} />
          Spotlight
        </span>

        <div className="relative h-[min(300px,56vw)] overflow-hidden sm:h-[min(420px,72vw)] sm:overflow-visible">
          {stackItems.map((item, index) => {
            const metrics = getLayerMetrics(item, null, index, compact);
            return (
              <div
                key={item.id}
                ref={(node) => {
                  layerRefs.current[index] = node;
                }}
                className="stack-layer absolute top-0 left-[16%] w-[68%] will-change-transform sm:left-[12%] sm:w-[76%]"
                style={{
                  zIndex: 10 + index,
                  transform: `translate3d(${metrics.x}px, ${metrics.y}px, 0) rotate(${metrics.rotate}deg) scale(${metrics.scale})`,
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#111] shadow-[0_18px_45px_rgba(24,24,27,0.16)] transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(24,24,27,0.22)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 85vw, 360px"
                      priority={index === stackItems.length - 1}
                    />
                  </div>
                  <div className="border-t border-white/10 bg-black/70 px-3 py-2 backdrop-blur-sm">
                    <p className="text-[11px] font-medium tracking-wide text-white/90 uppercase">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted sm:mt-8 lg:justify-start">
        <span className="font-display font-semibold text-foreground">
          BUBBARD Design
        </span>
        <span className="text-border">·</span>
        <span>Behance</span>
        <ArrowUpRight className="hero-design-arrow h-4 w-4 transition-transform" />
      </div>
    </a>
  );
}
