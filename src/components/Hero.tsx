"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PiArrowRightBold } from "react-icons/pi";
import dynamic from "next/dynamic";
import { resumeLink } from "@/data/contact";
import { RotatingRoles } from "./RotatingRoles";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { attachMagneticHover } from "@/lib/magneticHover";

gsap.registerPlugin(useGSAP);

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const ResumeIcon = resumeLink.icon;

  useGSAP(
    () => {
      if (reducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-line-1", {
        y: 48,
        opacity: 0,
        filter: "blur(14px)",
        duration: 1,
      })
        .from(
          ".hero-line-2",
          { y: 40, opacity: 0, filter: "blur(14px)", duration: 0.95 },
          "-=0.6",
        )
        .from(
          ".hero-highlight-bg",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.05,
            ease: "expo.out",
          },
          "-=0.55",
        )
        .from(
          ".hero-highlight-text",
          {
            clipPath: "inset(0 100% 0 0)",
            duration: 1.05,
            ease: "expo.out",
          },
          "<",
        )
        .from(".hero-name", { y: 24, opacity: 0, duration: 0.7 }, "-=0.45")
        .from(
          ".hero-bottom-item",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            clearProps: "opacity,transform",
          },
          "-=0.35",
        );

      const cleanups = gsap.utils
        .toArray<HTMLElement>(".hero-magnetic")
        .map((el) => attachMagneticHover(el, { strength: 0.25 }));

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={containerRef}
      id="home"
      className="hero-section relative"
    >
      <HeroScene />
      <div className="hero-glow-center" aria-hidden="true" />

      <div className="container-wide hero-section__inset">
        <div className="hero-frame relative z-10 grid min-h-0 grid-rows-[1fr_auto]">
          <div className="hero-headline-stage flex min-h-0 items-center justify-center px-2 py-8 sm:px-6 sm:py-12 md:py-16">
            <div className="hero-headline-wrap text-center">
              <h1 className="hero-headline font-display font-semibold">
                <span className="hero-line-1 block text-white">Intentional</span>
                <span className="hero-line-2 block">
                  <span className="hero-highlight">
                    <span className="hero-highlight-bg rounded-sm" aria-hidden="true" />
                    <span className="hero-highlight-text">Design.</span>
                  </span>
                </span>
              </h1>
              <p className="hero-name mt-5 font-display text-4xl font-bold tracking-tight text-white sm:mt-6">
                Bo Hubbard
              </p>
            </div>
          </div>

          <div className="hero-bottom shrink-0 pb-8 md:max-w-sm md:pb-10">
            <div className="hero-bottom-item mt-2">
              <RotatingRoles className="text-base sm:text-lg" />
            </div>

            <p className="hero-bottom-item mt-4 text-md text-white">
              B.S. Computer Science · Class of 2026
            </p>

            <p className="hero-bottom-item mt-4 text-md leading-relaxed text-white/85 md:text-base">
              Software development, graphic design, and interfaces built with
              purpose.
            </p>

            <div className="hero-bottom-item mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={resumeLink.href}
                download
                className="hero-magnetic inline-flex cursor-pointer items-center gap-2 rounded-sm bg-white px-4 py-2.5 font-display text-md font-semibold text-foreground transition-opacity duration-300 will-change-transform hover:opacity-90"
              >
                {resumeLink.label}
                <ResumeIcon className="h-4 w-4" />
              </a>
              <a
                href="#about"
                className="hero-magnetic inline-flex cursor-pointer items-center gap-2 font-display text-md font-semibold text-white/90 transition-opacity duration-300 will-change-transform hover:opacity-70"
              >
                Know more
                <PiArrowRightBold className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
