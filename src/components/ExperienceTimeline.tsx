"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap } from "lucide-react";
import { timelineEntries, type TimelineEntry } from "@/data/experience";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function TimelineImagePanel({
  entry,
  reducedMotion,
}: {
  entry: TimelineEntry;
  reducedMotion: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<[HTMLDivElement | null, HTMLDivElement | null]>([null, null]);
  const fadeTweenRef = useRef<gsap.core.Tween | null>(null);
  const topLayerRef = useRef<0 | 1>(0);
  const layersRef = useRef<[TimelineEntry, TimelineEntry]>([entry, entry]);
  const pendingEntryRef = useRef<TimelineEntry | null>(null);
  const lastEntryChangeRef = useRef(0);
  const [topLayer, setTopLayer] = useState<0 | 1>(0);
  const [layers, setLayers] = useState<[TimelineEntry, TimelineEntry]>([entry, entry]);

  topLayerRef.current = topLayer;
  layersRef.current = layers;

  const backLayer = (top: 0 | 1): 0 | 1 => (top === 0 ? 1 : 0);

  useEffect(() => {
    timelineEntries.forEach((item) => {
      const preload = new window.Image();
      preload.src = item.image;
    });
  }, []);

  const applyLayerVisibility = (visibleIndex: 0 | 1) => {
    const hiddenIndex = backLayer(visibleIndex);
    const visibleEl = layerRefs.current[visibleIndex];
    const hiddenEl = layerRefs.current[hiddenIndex];
    if (visibleEl) gsap.set(visibleEl, { autoAlpha: 1, scale: 1, zIndex: 2 });
    if (hiddenEl) gsap.set(hiddenEl, { autoAlpha: 0, scale: 1.015, zIndex: 1 });
  };

  const snapToEntry = (target: TimelineEntry) => {
    fadeTweenRef.current?.kill();
    fadeTweenRef.current = null;
    pendingEntryRef.current = null;

    const currentTop = topLayerRef.current;
    if (layersRef.current[currentTop].id === target.id) {
      applyLayerVisibility(currentTop);
      return;
    }

    const nextTop = backLayer(currentTop);
    const nextLayers: [TimelineEntry, TimelineEntry] = [
      layersRef.current[0],
      layersRef.current[1],
    ];
    nextLayers[nextTop] = target;

    layersRef.current = nextLayers;
    topLayerRef.current = nextTop;
    setLayers(nextLayers);
    setTopLayer(nextTop);
    requestAnimationFrame(() => applyLayerVisibility(nextTop));
  };

  const fadeInLayer = (layerIndex: 0 | 1, targetEntry: TimelineEntry) => {
    const layerEl = layerRefs.current[layerIndex];
    const frontIndex = topLayerRef.current;
    const frontEl = layerRefs.current[frontIndex];
    if (!layerEl) return;

    fadeTweenRef.current?.kill();
    fadeTweenRef.current = null;

    if (frontEl) gsap.set(frontEl, { zIndex: 1, autoAlpha: 1, scale: 1 });
    gsap.set(layerEl, { zIndex: 2, autoAlpha: 0, scale: 1.015 });

    fadeTweenRef.current = gsap.to(layerEl, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.38,
      ease: "power2.out",
      onComplete: () => {
        fadeTweenRef.current = null;

        if (pendingEntryRef.current?.id !== targetEntry.id) {
          scheduleTransitionAttempt();
          return;
        }

        pendingEntryRef.current = null;
        topLayerRef.current = layerIndex;
        setTopLayer(layerIndex);
        applyLayerVisibility(layerIndex);
      },
    });
  };

  const tryFadeToPending = () => {
    const pending = pendingEntryRef.current;
    if (!pending || reducedMotion) return;

    const currentTop = topLayerRef.current;
    if (layersRef.current[currentTop].id === pending.id) {
      pendingEntryRef.current = null;
      applyLayerVisibility(currentTop);
      return;
    }

    const nextBack = backLayer(currentTop);
    if (layersRef.current[nextBack].id !== pending.id) return;

    const img = layerRefs.current[nextBack]?.querySelector("img");
    if (!img?.complete) return;

    fadeInLayer(nextBack, pending);
  };

  const scheduleTransitionAttempt = () => {
    queueMicrotask(tryFadeToPending);
    requestAnimationFrame(tryFadeToPending);
  };

  useGSAP(
    () => {
      applyLayerVisibility(topLayerRef.current);
    },
    { scope: panelRef },
  );

  useEffect(() => {
    if (entry.id === layersRef.current[topLayerRef.current].id) {
      pendingEntryRef.current = null;
      return;
    }

    const now = performance.now();
    const rapidChange = now - lastEntryChangeRef.current < 280;
    lastEntryChangeRef.current = now;

    fadeTweenRef.current?.kill();
    fadeTweenRef.current = null;
    pendingEntryRef.current = entry;

    if (reducedMotion || rapidChange) {
      snapToEntry(entry);
      return;
    }

    const nextBack = backLayer(topLayerRef.current);
    setLayers((prev) => {
      const next: [TimelineEntry, TimelineEntry] = [prev[0], prev[1]];
      next[nextBack] = entry;
      layersRef.current = next;
      return next;
    });

    applyLayerVisibility(topLayerRef.current);
    const hiddenEl = layerRefs.current[nextBack];
    if (hiddenEl) gsap.set(hiddenEl, { autoAlpha: 0, scale: 1.015, zIndex: 1 });

    scheduleTransitionAttempt();
  }, [entry.id, reducedMotion]);

  useEffect(() => {
    scheduleTransitionAttempt();
  }, [layers, reducedMotion]);

  useGSAP(
    () => {
      if (reducedMotion || !glowRef.current) return;

      gsap.to(glowRef.current, {
        autoAlpha: 0.8,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    },
    {
      scope: panelRef,
      dependencies: [entry.id, reducedMotion],
    },
  );

  useEffect(
    () => () => {
      fadeTweenRef.current?.kill();
    },
    [],
  );

  return (
    <div ref={panelRef} className="experience-preview">
      <div
        ref={glowRef}
        className="experience-preview__glow transition-[background] duration-500 ease-out"
        style={{ background: `${entry.accent}30`, opacity: 0.8 }}
        aria-hidden="true"
      />
      <div
        className="experience-preview__frame overflow-hidden rounded-2xl border border-border bg-surface p-[2px]"
        style={{
          boxShadow: `0 24px 60px ${entry.accent}22`,
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-foreground/5">
          {([0, 1] as const).map((layerIndex) => (
            <div
              key={layerIndex}
              ref={(node) => {
                layerRefs.current[layerIndex] = node;
              }}
              className="absolute inset-0 will-change-[opacity,transform]"
              style={{ zIndex: layerIndex === topLayer ? 2 : 1 }}
            >
              <Image
                src={layers[layerIndex].image}
                alt={layers[layerIndex].imageAlt}
                width={840}
                height={1050}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 462px"
                priority={layers[layerIndex].id === timelineEntries[0]?.id}
                onLoad={scheduleTransitionAttempt}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  entry,
  isActive,
  onActivate,
}: {
  entry: TimelineEntry;
  isActive: boolean;
  onActivate: () => void;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !itemRef.current) return;

      const dot = itemRef.current.querySelector(".timeline-dot");

      itemRef.current.addEventListener("mouseenter", () => {
        gsap.to(dot, {
          scale: 1.35,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      });

      itemRef.current.addEventListener("mouseleave", () => {
        gsap.to(dot, {
          scale: isActive ? 1.15 : 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    },
    { scope: itemRef, dependencies: [reducedMotion, isActive] },
  );

  const Icon = entry.type === "education" ? GraduationCap : Briefcase;

  return (
    <li
      ref={itemRef}
      data-timeline-id={entry.id}
      className="relative flex gap-6 pb-12 last:pb-0"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <div className="relative flex w-10 shrink-0 flex-col items-center">
        <div
          className="timeline-dot z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface shadow-sm transition-transform duration-300"
          style={{
            backgroundColor: `${entry.accent}${isActive ? "28" : "18"}`,
            borderColor: `${entry.accent}${isActive ? "70" : "40"}`,
            transform: isActive ? "scale(1.15)" : undefined,
          }}
        >
          <Icon className="h-4 w-4" style={{ color: entry.accent }} />
        </div>
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

        <h3
          className={`font-display mt-2 font-semibold tracking-tight transition-[font-size] duration-300 ${
            isActive ? "text-[1.425rem]" : "text-xl"
          }`}
        >
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
  const pointerRef = useRef({ x: 0, y: 0, inside: false });
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState(timelineEntries[0]?.id ?? "");
  const activeEntry =
    timelineEntries.find((entry) => entry.id === activeId) ?? timelineEntries[0];

  const activateEntryUnderPointer = () => {
    if (!pointerRef.current.inside) return;

    const hovered = document.elementFromPoint(
      pointerRef.current.x,
      pointerRef.current.y,
    );
    const item = hovered?.closest<HTMLElement>("[data-timeline-id]");
    const id = item?.dataset.timelineId;
    if (id) setActiveId(id);
  };

  useEffect(() => {
    const onScroll = () => activateEntryUnderPointer();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () =>
      window.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

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

  if (!activeEntry) return null;

  return (
    <section id="experience" className="section-padding border-t border-border bg-gradient-subtle">
      <div className="container-wide">
        <Reveal>
          <h2 className="font-display mb-10 text-3xl font-semibold tracking-tight sm:mb-12 sm:text-4xl">
            Career Roadmap
          </h2>
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(308px,440px)] lg:gap-12 xl:gap-16">
          <div className="experience-timeline-wrap order-2 relative min-w-0 max-w-2xl lg:order-1 lg:max-w-none">
            <ul
              ref={listRef}
              className="experience-timeline relative"
              onMouseEnter={() => {
                pointerRef.current.inside = true;
              }}
              onMouseLeave={() => {
                pointerRef.current.inside = false;
              }}
              onMouseMove={(event) => {
                pointerRef.current.x = event.clientX;
                pointerRef.current.y = event.clientY;
                activateEntryUnderPointer();
              }}
            >
              {timelineEntries.map((entry) => (
                <TimelineItem
                  key={entry.id}
                  entry={entry}
                  isActive={activeId === entry.id}
                  onActivate={() => setActiveId(entry.id)}
                />
              ))}
            </ul>
          </div>

          <aside className="experience-preview-aside order-1 lg:order-2 lg:sticky lg:top-28">
            <TimelineImagePanel entry={activeEntry} reducedMotion={reducedMotion} />
          </aside>
        </div>
      </div>
    </section>
  );
}
