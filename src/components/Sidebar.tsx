"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Mail,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";

const navItems: { id: string; href: string; label: string; icon: LucideIcon }[] =
  [
    { id: "about", href: "#about", label: "About", icon: User },
    {
      id: "experience",
      href: "#experience",
      label: "Career Roadmap",
      icon: Briefcase,
    },
    { id: "work", href: "#work", label: "Projects", icon: FolderKanban },
    { id: "skills", href: "#skills", label: "Skills", icon: Wrench },
    { id: "contact", href: "#contact", label: "Contact", icon: Mail },
  ];

const sectionIds = ["home", "about", "experience", "work", "skills", "contact"];

const BAR_TRANSITION_MS = 300;
const WIDE_SIDEBAR_MIN_PX = 1370;

function useWideSidebar() {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${WIDE_SIDEBAR_MIN_PX}px)`);
    const update = () => setIsWide(mq.matches);

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isWide;
}

gsap.registerPlugin(useGSAP);

function NavItem({
  item,
  isActive,
  isExpanded,
  showOutsideLabel,
  itemRef,
}: {
  item: (typeof navItems)[number];
  isActive: boolean;
  isExpanded: boolean;
  showOutsideLabel: boolean;
  itemRef?: (el: HTMLAnchorElement | null) => void;
}) {
  const Icon = item.icon;

  return (
    <a
      ref={itemRef}
      href={item.href}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className={`group relative flex cursor-pointer items-center overflow-visible rounded-xl transition-colors duration-300 ease-out ${
        isExpanded ? "gap-0 px-3 py-3" : "justify-center px-0 py-3"
      } ${isActive ? "text-foreground" : "text-muted hover:text-foreground"}`}
    >
      <Icon
        className={`h-5 w-5 shrink-0 transition-all duration-300 ease-out ${
          isActive ? "scale-105" : "group-hover:scale-110"
        }`}
        strokeWidth={isActive ? 2.25 : 2}
      />

      <span
        className={`overflow-hidden text-sm whitespace-nowrap transition-all duration-300 ease-out ${
          isExpanded
            ? `ml-3 max-w-48 opacity-100 ${isActive ? "font-semibold" : "font-medium"}`
            : "ml-0 max-w-0 opacity-0"
        }`}
        aria-hidden={!isExpanded}
      >
        {item.label}
      </span>

      <span
        className={`pointer-events-none absolute top-1/2 left-[calc(100%+0.75rem)] -translate-y-1/2 text-sm font-semibold whitespace-nowrap text-foreground transition-all duration-300 ease-out ${
          showOutsideLabel
            ? "translate-x-0 opacity-100"
            : "-translate-x-1 opacity-0"
        }`}
        aria-hidden={!showOutsideLabel}
      >
        {item.label}
      </span>
    </a>
  );
}

export function Sidebar() {
  const active = useActiveSection(sectionIds);
  const sidebarRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isWideViewport = useWideSidebar();
  const isExpanded = isPinned || isHovered;

  const moveIndicator = useCallback(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const activeEl = itemRefs.current[active];

    if (!nav || !indicator) return;

    if (!activeEl) {
      gsap.to(indicator, { opacity: 0, duration: 0.2, ease: "power2.out" });
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    const y = itemRect.top - navRect.top + itemRect.height / 2;

    gsap.to(indicator, {
      y,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [active]);

  useGSAP(
    () => {
      gsap.from(sidebarRef.current, {
        x: -24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { scope: sidebarRef },
  );

  useGSAP(
    () => {
      moveIndicator();
    },
    { scope: navRef, dependencies: [moveIndicator, isExpanded] },
  );

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;

    const observer = new ResizeObserver(() => moveIndicator());
    observer.observe(nav);

    const activeEl = itemRefs.current[active];
    if (activeEl) observer.observe(activeEl);

    return () => observer.disconnect();
  }, [active, moveIndicator]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "width") moveIndicator();
    };

    nav.addEventListener("transitionend", onTransitionEnd);
    return () => nav.removeEventListener("transitionend", onTransitionEnd);
  }, [moveIndicator]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;

    const timer = window.setTimeout(moveIndicator, BAR_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [isExpanded, moveIndicator]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;

    const onResize = () => moveIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [moveIndicator]);

  return (
    <aside
        ref={sidebarRef}
        className="fixed top-1/2 left-6 z-50 hidden -translate-y-1/2 overflow-visible md:block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav
          ref={navRef}
          aria-label="Primary"
          className={`relative flex flex-col gap-1.5 overflow-visible py-3 pr-4 pl-3 transition-[width,background-color,box-shadow,border-color] duration-300 ease-out ${
            isExpanded
              ? "w-52 rounded-2xl border border-border/80 bg-surface/95 shadow-[0_12px_40px_rgba(24,24,27,0.08)] backdrop-blur-md"
              : "w-14 bg-transparent"
          }`}
        >
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute top-0 left-1 h-5 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-accent-blue via-accent-violet to-accent-coral opacity-0"
            aria-hidden="true"
          />

          <a
            href="#home"
            className={`font-display mb-1 flex cursor-pointer items-center overflow-visible rounded-xl py-3 font-semibold tracking-tight transition-all duration-300 ease-out ${
              isExpanded ? "gap-0 px-3" : "justify-center px-0"
            }`}
            aria-label="Bo Hubbard home"
          >
            <span className="text-base leading-none">
              {isExpanded ? (
                <>
                  BOHUBBARD<span className="text-gradient">.</span>
                </>
              ) : (
                <>
                  BH<span className="text-gradient">.</span>
                </>
              )}
            </span>
          </a>

          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={active === item.id}
              isExpanded={isExpanded}
              showOutsideLabel={
                isWideViewport && !isExpanded && active === item.id
              }
              itemRef={(el) => {
                itemRefs.current[item.id] = el;
              }}
            />
          ))}

          <button
            type="button"
            onClick={() => setIsPinned((p) => !p)}
            className={`mt-1 flex cursor-pointer items-center overflow-visible rounded-xl py-3 text-muted transition-all duration-300 ease-out hover:text-foreground ${
              isExpanded ? "px-3" : "justify-center px-0"
            } ${isPinned ? "text-foreground" : ""}`}
            aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
          >
            {isPinned ? (
              <ChevronLeft className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            <span
              className={`overflow-hidden text-xs font-medium whitespace-nowrap transition-all duration-300 ease-out ${
                isExpanded ? "ml-3 max-w-24 opacity-100" : "ml-0 max-w-0 opacity-0"
              }`}
            >
              {isPinned ? "Collapse" : "Pin open"}
            </span>
          </button>
        </nav>
      </aside>
  );
}
