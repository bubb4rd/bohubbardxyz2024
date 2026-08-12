"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories, type SkillCategory, type SkillItem } from "@/data/skills";
import { SkillIcon } from "./SkillIcon";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const chipTilts = [-2.5, 1.5, -1, 2, -1.5, 1, -2, 2.5, -0.5, 1.75];

function SkillChips({
  skills,
  reducedMotion,
  className = "",
}: {
  skills: SkillItem[];
  reducedMotion: boolean;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {skills.map((skill, index) => (
        <li key={skill.name}>
          <div
            className="skill-chip flex cursor-default items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 shadow-[0_10px_30px_rgba(24,24,27,0.05)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_16px_40px_rgba(24,24,27,0.08)]"
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background"
              style={{ color: skill.accent }}
            >
              <SkillIcon icon={skill.icon} className="h-[17px] w-[17px]" />
            </span>
            <span className="pr-0.5 text-sm font-medium text-foreground">
              {skill.name}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SkillCategoryCard({
  category,
  categoryIndex,
  reducedMotion,
  stretch = false,
  inlineSkills = false,
  className = "",
}: {
  category: SkillCategory;
  categoryIndex: number;
  reducedMotion: boolean;
  stretch?: boolean;
  inlineSkills?: boolean;
  className?: string;
}) {
  return (
    <article
      className={`skill-category group relative overflow-hidden rounded-3xl border border-border/70 bg-surface p-5 shadow-[0_20px_60px_rgba(24,24,27,0.04)] sm:p-6 ${
        stretch ? "flex h-full min-h-0 flex-col" : ""
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `${category.accent}22`,
          opacity: 0.65,
        }}
      />

      {inlineSkills ? (
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 shrink-0">
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: category.accent }}
            >
              {String(categoryIndex + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
              {category.title}
            </h3>
          </div>

          <SkillChips
            skills={category.skills}
            reducedMotion={reducedMotion}
            className="justify-end sm:ml-auto"
          />
        </div>
      ) : (
        <>
          <div className="relative shrink-0">
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: category.accent }}
            >
              {String(categoryIndex + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
              {category.title}
            </h3>
          </div>

          <SkillChips
            skills={category.skills}
            reducedMotion={reducedMotion}
            className={stretch ? "mt-auto flex-1 content-start pt-5" : "mt-5"}
          />
        </>
      )}
    </article>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const languages = skillCategories.find((category) => category.id === "languages")!;
  const mobile = skillCategories.find((category) => category.id === "mobile")!;
  const web = skillCategories.find((category) => category.id === "web")!;
  const tools = skillCategories.find((category) => category.id === "tools")!;

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

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-12 lg:gap-4">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <SkillCategoryCard
              category={languages}
              categoryIndex={skillCategories.indexOf(languages)}
              reducedMotion={reducedMotion}
            />
            <SkillCategoryCard
              category={mobile}
              categoryIndex={skillCategories.indexOf(mobile)}
              reducedMotion={reducedMotion}
              stretch
              inlineSkills
              className="flex-1 justify-center"
            />
          </div>

          <div className="flex lg:col-span-5">
            <SkillCategoryCard
              category={web}
              categoryIndex={skillCategories.indexOf(web)}
              reducedMotion={reducedMotion}
              stretch
              className="w-full"
            />
          </div>

          <div className="lg:col-span-12">
            <SkillCategoryCard
              category={tools}
              categoryIndex={skillCategories.indexOf(tools)}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
