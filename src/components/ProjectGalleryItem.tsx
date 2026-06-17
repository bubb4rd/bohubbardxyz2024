"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP);

type ProjectGalleryItemProps = {
  project: Project;
};

export function ProjectGalleryItem({ project }: ProjectGalleryItemProps) {
  const itemRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !itemRef.current) return;

      const item = itemRef.current;
      const image = item.querySelector(".gallery-image");
      const overlay = item.querySelector(".gallery-overlay");

      const onEnter = () => {
        gsap.to(image, { scale: 1.04, duration: 0.5, ease: "power2.out" });
        gsap.to(overlay, { opacity: 1, duration: 0.35, ease: "power2.out" });
        gsap.to(item.querySelector(".gallery-arrow"), {
          x: 3,
          y: -3,
          duration: 0.3,
        });
      };

      const onLeave = () => {
        gsap.to(image, { scale: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(overlay, { opacity: 0, duration: 0.35, ease: "power2.out" });
        gsap.to(item.querySelector(".gallery-arrow"), {
          x: 0,
          y: 0,
          duration: 0.3,
        });
      };

      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);

      return () => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: itemRef, dependencies: [reducedMotion] },
  );

  return (
    <article ref={itemRef} className="gallery-item group relative">
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer"
          aria-label={`Open ${project.title}`}
        >
          <GalleryContent project={project} />
        </a>
      ) : (
        <div className="cursor-default">
          <GalleryContent project={project} />
        </div>
      )}
    </article>
  );
}

function GalleryContent({ project }: { project: Project }) {
  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl bg-background ${
          project.featured ? "aspect-[21/10]" : "aspect-[4/3]"
        }`}
      >
        <div className="gallery-image absolute inset-0 origin-center">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes={
                project.featured
                  ? "(max-width: 768px) 100vw, 70vw"
                  : "(max-width: 768px) 100vw, 35vw"
              }
            />
          ) : (
            <div
              className="flex h-full flex-col items-center justify-center gap-3"
              style={{
                background: `linear-gradient(145deg, ${project.accent}22 0%, ${project.accent}08 50%, transparent 100%)`,
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-surface/80"
                style={{ color: project.accent }}
              >
                <ImageIcon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium tracking-wider text-muted uppercase">
                Project image
              </span>
            </div>
          )}
        </div>

        <div className="gallery-overlay pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/75 via-foreground/25 to-transparent p-6 opacity-0">
          <p className="font-display text-xl font-semibold text-white">
            {project.title}
          </p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
            {project.description}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="liquid-glass-tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wider text-muted uppercase">
            {project.subtitle}
          </p>
          <h3 className="font-display mt-0.5 text-lg font-semibold tracking-tight">
            {project.title}
          </h3>
        </div>
        <span className="gallery-arrow mt-1 inline-flex text-muted transition-colors group-hover:text-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </>
  );
}
