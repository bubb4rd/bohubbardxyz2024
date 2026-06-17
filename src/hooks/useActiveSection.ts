"use client";

import { useEffect, useRef, useState } from "react";

const SETTLE_MS = 140;
const MARKER_RATIO = 0.34;
const HYSTERESIS_PX = 96;
const TOP_LOCK_PX = 96;

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0]);
  const activeRef = useRef(sectionIds[0]);
  const pendingRef = useRef<string | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    let frame = 0;

    const pickSection = () => {
      if (window.scrollY < TOP_LOCK_PX) {
        pendingRef.current = null;
        if (settleTimerRef.current !== null) {
          window.clearTimeout(settleTimerRef.current);
          settleTimerRef.current = null;
        }

        const homeId = sectionIds[0];
        if (activeRef.current !== homeId) {
          activeRef.current = homeId;
          setActive(homeId);
        }
        return;
      }

      const markerY = window.innerHeight * MARKER_RATIO;
      let candidate = sectionIds[0];
      let candidateDistance = Infinity;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

        if (visibleHeight <= 0) continue;

        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - markerY);

        if (distance < candidateDistance) {
          candidateDistance = distance;
          candidate = el.id;
        }
      }

      const currentId = activeRef.current;
      if (candidate === currentId) {
        pendingRef.current = null;
        return;
      }

      const currentEl = document.getElementById(currentId);
      if (currentEl) {
        const currentRect = currentEl.getBoundingClientRect();
        const currentVisible =
          Math.min(currentRect.bottom, window.innerHeight) -
          Math.max(currentRect.top, 0);
        const currentCenter = currentRect.top + currentRect.height / 2;
        const currentDistance = Math.abs(currentCenter - markerY);

        if (
          currentVisible > 48 &&
          candidateDistance > currentDistance - HYSTERESIS_PX
        ) {
          return;
        }
      }

      if (pendingRef.current !== candidate) {
        pendingRef.current = candidate;

        if (settleTimerRef.current !== null) {
          window.clearTimeout(settleTimerRef.current);
        }

        settleTimerRef.current = window.setTimeout(() => {
          if (pendingRef.current !== candidate) return;
          activeRef.current = candidate;
          setActive(candidate);
          pendingRef.current = null;
          settleTimerRef.current = null;
        }, SETTLE_MS);
      }
    };

    const schedulePick = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pickSection);
    };

    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        cancelAnimationFrame(frame);
        if (settleTimerRef.current !== null) {
          window.clearTimeout(settleTimerRef.current);
          settleTimerRef.current = null;
        }
        pendingRef.current = null;
        return;
      }
      schedulePick();
    };

    schedulePick();
    window.addEventListener("scroll", schedulePick, { passive: true });
    window.addEventListener("resize", schedulePick);
    desktop.addEventListener("change", onDesktopChange);

    return () => {
      cancelAnimationFrame(frame);
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
      window.removeEventListener("scroll", schedulePick);
      window.removeEventListener("resize", schedulePick);
      desktop.removeEventListener("change", onDesktopChange);
    };
  }, [sectionIds]);

  return active;
}
