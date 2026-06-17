"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap } from "lucide-react";
import { timelineEntries, type TimelineEntry } from "@/data/experience";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function TimelineItem({
  entry,
  isLast,
}: {
  entry: TimelineEntry;
  isLast: boolean;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !itemRef.current) return;

      const card = itemRef.current.querySelector(".timeline-card");

      itemRef.current.addEventListener("mouseenter", () => {
        gsap.to(itemRef.current!.querySelector(".timeline-dot"), {
          scale: 1.35,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
        gsap.to(card, {
          x: 6,
          duration: 0.35,
          ease: "power2.out",
        });
      });

      itemRef.current.addEventListener("mouseleave", () => {
        gsap.to(itemRef.current!.querySelector(".timeline-dot"), {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(card, {
          x: 0,
          duration: 0.35,
          ease: "power2.out",
        });
      });
    },
    { scope: itemRef, dependencies: [reducedMotion] },
  );

  const Icon = entry.type === "education" ? GraduationCap : Briefcase;

  return (
    <li ref={itemRef} className="relative flex gap-6 pb-12 last:pb-0">
      <div className="relative flex flex-col items-center">
        <div
          className="timeline-dot z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-surface shadow-sm"
          style={{ backgroundColor: `${entry.accent}18`, borderColor: `${entry.accent}40` }}
        >
          <Icon className="h-4 w-4" style={{ color: entry.accent }} />
        </div>
        {!isLast && (
          <div
            className="absolute top-10 h-[calc(100%+0.5rem)] w-px bg-gradient-to-b from-border via-accent-violet/30 to-border"
            aria-hidden="true"
          />
        )}
      </div>

      <article className="timeline-card min-w-0 flex-1 pt-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <time className="text-xs font-medium tracking-wider text-muted uppercase">
            {entry.start} — {entry.end}
          </time>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
            style={{
              backgroundColor: `${entry.accent}14`,
              color: entry.accent,
            }}
          >
            {entry.type}
          </span>
        </div>

        <h3 className="font-display mt-2 text-xl font-semibold tracking-tight">
          {entry.title}
        </h3>
        <p className="mt-0.5 font-medium text-foreground/80">
          {entry.organization}
          {entry.location && (
            <span className="font-normal text-muted"> · {entry.location}</span>
          )}
        </p>
        <p className="mt-2 max-w-md text-sm leading-snug text-muted">
          {entry.description}
        </p>
      </article>
    </li>
  );
}

export function ExperienceTimeline() {
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !listRef.current) return;

      gsap.from(listRef.current.children, {
        x: -24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: listRef, dependencies: [reducedMotion] },
  );

  return (
    <section id="experience" className="section-padding border-t border-border bg-gradient-subtle">
      <div className="container-wide">
        <Reveal>
          <h2 className="font-display mb-12 text-3xl font-semibold tracking-tight sm:text-4xl">
            Career Roadmap
          </h2>
        </Reveal>

        <ul ref={listRef} className="max-w-2xl">
          {timelineEntries.map((entry, i) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              isLast={i === timelineEntries.length - 1}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
