"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "@/data/skills";
import { SkillIcon } from "./SkillIcon";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const chipTilts = [-2.5, 1.5, -1, 2, -1.5, 1, -2, 2.5, -0.5, 1.75];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      gsap.from(sectionRef.current.querySelectorAll(".skill-category"), {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      gsap.from(sectionRef.current.querySelectorAll(".skill-chip"), {
        y: 16,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.025,
        ease: "power2.out",
        clearProps: "opacity,visibility",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section id="skills" ref={sectionRef} className="section-padding">
      <div className="container-wide">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Skills &amp; tools
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-5">
          {skillCategories.map((category, categoryIndex) => (
            <article
              key={category.id}
              className={`skill-category group relative overflow-hidden rounded-3xl border border-border/70 bg-surface p-6 shadow-[0_20px_60px_rgba(24,24,27,0.04)] sm:p-7 ${
                categoryIndex === 0
                  ? "lg:col-span-7"
                  : categoryIndex === 1
                    ? "lg:col-span-5"
                    : "lg:col-span-12"
              }`}
            >
              <div
                className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `${category.accent}22`,
                  opacity: 0.65,
                }}
              />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase"
                    style={{ color: category.accent }}
                  >
                    {String(categoryIndex + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight">
                    {category.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                    {category.description}
                  </p>
                </div>

                <div
                  className="hidden h-px flex-1 bg-gradient-to-r from-border to-transparent sm:block"
                  aria-hidden="true"
                />
              </div>

              <ul className="relative mt-6 flex flex-wrap gap-3">
                {category.skills.map((skill, index) => (
                  <li key={skill.name}>
                    <div
                      className="skill-chip flex cursor-default items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-2.5 shadow-[0_10px_30px_rgba(24,24,27,0.05)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_16px_40px_rgba(24,24,27,0.08)]"
                      style={{
                        transform: `rotate(${chipTilts[index % chipTilts.length]}deg)`,
                      }}
                      onMouseEnter={(event) => {
                        if (reducedMotion) return;
                        gsap.to(event.currentTarget, {
                          rotate: 0,
                          duration: 0.25,
                          ease: "power2.out",
                        });
                      }}
                      onMouseLeave={(event) => {
                        if (reducedMotion) return;
                        gsap.to(event.currentTarget, {
                          rotate: chipTilts[index % chipTilts.length],
                          duration: 0.25,
                          ease: "power2.out",
                        });
                      }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background"
                        style={{ color: skill.accent }}
                      >
                        <SkillIcon icon={skill.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="pr-1 text-sm font-medium text-foreground">
                        {skill.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
