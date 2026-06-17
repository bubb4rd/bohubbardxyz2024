"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { resumeLink } from "@/data/contact";
import { RotatingRoles } from "./RotatingRoles";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
      tl.from(".hero-line-1", { y: 48, opacity: 0, duration: 0.9 })
        .from(".hero-line-2", { y: 40, opacity: 0, duration: 0.85 }, "-=0.55")
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
                <span className="hero-line-1 block text-foreground">Intentional</span>
                <span className="hero-line-2 hero-gradient-text block">Design.</span>
              </h1>
              <p className="hero-name mt-5 font-display text-2xl font-medium tracking-tight text-muted sm:mt-6 sm:text-3xl">
                Bo Hubbard
              </p>
            </div>
          </div>

          <div className="hero-bottom shrink-0 pb-8 md:max-w-sm md:pb-10">
            <div className="hero-bottom-item mt-2">
              <RotatingRoles className="text-base sm:text-lg" />
            </div>

            <p className="hero-bottom-item mt-4 text-sm text-muted">
              B.S. Computer Science · Class of 2026
            </p>

            <p className="hero-bottom-item mt-4 text-sm leading-relaxed text-muted md:text-base">
              Software development, graphic design, and interfaces built with
              purpose.
            </p>

            <div className="hero-bottom-item mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={resumeLink.href}
                download
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-4 py-2.5 font-display text-sm font-semibold text-background transition-opacity duration-300 hover:opacity-90"
              >
                {resumeLink.label}
                <ResumeIcon className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="#about"
                className="inline-flex cursor-pointer items-center gap-2 font-display text-sm font-semibold text-foreground transition-opacity duration-300 hover:opacity-70"
              >
                Know more
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
