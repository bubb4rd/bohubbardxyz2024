"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { heroRoles } from "@/data/experience";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP);

export function RotatingRoles({ className = "text-lg sm:text-xl" }: { className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !textRef.current) return;

      let index = 0;

      const cycle = () => {
        const next = (index + 1) % heroRoles.length;

        gsap.to(textRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => {
            index = next;
            setRoleIndex(index);
            gsap.set(textRef.current, { yPercent: 100, opacity: 0 });
            gsap.to(textRef.current, {
              yPercent: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power2.out",
              onComplete: () => {
                gsap.delayedCall(2.4, cycle);
              },
            });
          },
        });
      };

      gsap.delayedCall(2.8, cycle);

      return () => {
        gsap.killTweensOf(textRef.current);
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <span
      ref={containerRef}
      className={`relative inline-block overflow-hidden align-bottom ${className}`}
      style={{ height: "1.35em", minWidth: "19ch" }}
      aria-live="polite"
    >
      <span
        ref={textRef}
        className="absolute inset-x-0 top-0 font-medium text-gradient whitespace-nowrap"
      >
        {heroRoles[roleIndex]}
      </span>
    </span>
  );
}
