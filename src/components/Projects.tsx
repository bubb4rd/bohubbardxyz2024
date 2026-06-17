"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";
import { ProjectGalleryItem } from "./ProjectGalleryItem";
import { Reveal } from "./Reveal";

const filters = [
  { id: "all", label: "All" },
  { id: "dev", label: "Development" },
  { id: "design", label: "Design" },
] as const;

type FilterId = (typeof filters)[number]["id"];

function ProjectFilters({
  active,
  onChange,
}: {
  active: FilterId;
  onChange: (id: FilterId) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Partial<Record<FilterId, HTMLButtonElement>>>({});
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  const updateIndicator = () => {
    const track = trackRef.current;
    const button = buttonRefs.current[active];
    if (!track || !button) return;

    setIndicator({
      left: button.offsetLeft,
      width: button.offsetWidth,
    });
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [active]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => updateIndicator());
    observer.observe(track);

    window.addEventListener("resize", updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [active]);

  return (
    <div
      ref={trackRef}
      className="relative flex w-full gap-1 rounded-full border border-border bg-surface p-1 sm:w-auto"
      role="tablist"
      aria-label="Filter projects"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-foreground shadow-sm transition-[transform,width] duration-300 ease-out"
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.left}px)`,
        }}
      />

      {filters.map((filter) => (
        <button
          key={filter.id}
          ref={(node) => {
            buttonRefs.current[filter.id] = node ?? undefined;
          }}
          type="button"
          role="tab"
          aria-selected={active === filter.id}
          onClick={() => onChange(filter.id)}
          className={`relative z-10 flex-1 cursor-pointer rounded-full px-3 py-2 text-center text-sm font-medium transition-colors duration-300 sm:flex-none sm:px-4 sm:whitespace-nowrap ${
            active === filter.id
              ? "text-background"
              : "text-muted hover:text-foreground"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export function Projects() {
  const [active, setActive] = useState<FilterId>("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section id="work" className="section-padding">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h2>

            <ProjectFilters active={active} onChange={setActive} />
          </div>
        </Reveal>

        <div className="grid items-start gap-x-8 gap-y-8 sm:grid-cols-2">
          {filtered.map((project, i) => (
            <Reveal
              key={project.id}
              delay={i * 0.06}
              className={project.featured ? "sm:col-span-2" : ""}
            >
              <ProjectGalleryItem project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
