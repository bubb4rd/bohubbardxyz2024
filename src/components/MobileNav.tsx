"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  FolderKanban,
  Mail,
  Menu,
  User,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ANIMATION_MS = 320;

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

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { style: bodyStyle } = document.body;
    const html = document.documentElement;

    const previous = {
      bodyPosition: bodyStyle.position,
      bodyTop: bodyStyle.top,
      bodyLeft: bodyStyle.left,
      bodyRight: bodyStyle.right,
      bodyWidth: bodyStyle.width,
      bodyOverflow: bodyStyle.overflow,
      htmlOverflow: html.style.overflow,
    };

    html.classList.add("menu-open");
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";

    const blockBackgroundScroll = (event: TouchEvent) => {
      const panel = document.getElementById("mobile-nav-panel");
      if (panel?.contains(event.target as Node)) return;
      event.preventDefault();
    };

    document.addEventListener("touchmove", blockBackgroundScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", blockBackgroundScroll);
      html.classList.remove("menu-open");
      bodyStyle.position = previous.bodyPosition;
      bodyStyle.top = previous.bodyTop;
      bodyStyle.left = previous.bodyLeft;
      bodyStyle.right = previous.bodyRight;
      bodyStyle.width = previous.bodyWidth;
      bodyStyle.overflow = previous.bodyOverflow;
      html.style.overflow = previous.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const close = useCallback(() => setOpen(false), []);

  const handleNavClick = useCallback(
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setOpen(false);
      window.setTimeout(
        () => scrollToSection(href),
        reducedMotion ? 0 : ANIMATION_MS + 40,
      );
    },
    [reducedMotion],
  );

  useScrollLock(mounted);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted || !open) return;

    if (reducedMotion) {
      setActive(true);
      return;
    }

    setActive(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setActive(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [mounted, open, reducedMotion]);

  useEffect(() => {
    if (open || !mounted) return;

    setActive(false);
    const duration = reducedMotion ? 0 : ANIMATION_MS;
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, mounted, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const transitionClass = reducedMotion
    ? ""
    : "transition-[transform,opacity] duration-300 ease-out";

  const menuOverlay =
    mounted &&
    createPortal(
      <div
        className={`fixed inset-0 z-[200] bg-foreground/30 overscroll-none ${
          reducedMotion ? "" : "transition-opacity duration-300 ease-out"
        } ${active ? "opacity-100" : "opacity-0"}`}
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 z-0 cursor-default"
          onClick={close}
          aria-label="Close menu"
        />

        <nav
          id="mobile-nav-panel"
          aria-label="Primary mobile"
          aria-hidden={!active}
          className={`absolute top-0 right-0 z-10 flex h-dvh w-[min(100%,20rem)] flex-col border-l border-border bg-surface pt-[env(safe-area-inset-top)] shadow-[-12px_0_40px_rgba(24,24,27,0.12)] ${transitionClass} ${
            active ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <span className="font-display text-sm font-semibold tracking-tight">
              Menu
            </span>
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 cursor-pointer touch-manipulation items-center justify-center rounded-full text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <ul className="flex flex-col gap-0.5 p-3">
            <li
              className={transitionClass}
              style={
                {
                  opacity: active ? 1 : 0,
                  transform: active ? "translateX(0)" : "translateX(12px)",
                  transitionDelay: active && !reducedMotion ? "80ms" : "0ms",
                } as CSSProperties
              }
            >
              <a
                href="#home"
                onClick={handleNavClick("#home")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-muted">
                  BH<span className="text-gradient">.</span>
                </span>
                Home
              </a>
            </li>

            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className={transitionClass}
                  style={
                    {
                      opacity: active ? 1 : 0,
                      transform: active ? "translateX(0)" : "translateX(12px)",
                      transitionDelay:
                        active && !reducedMotion
                          ? `${120 + index * 45}ms`
                          : "0ms",
                    } as CSSProperties
                  }
                >
                  <a
                    href={item.href}
                    onClick={handleNavClick(item.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-muted">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>,
      document.body,
    );

  return (
    <>
      <div className="mobile-nav md:hidden">
        <header className="mobile-nav__bar fixed inset-x-0 top-0 z-[100] border-b border-border/80 bg-background pt-[env(safe-area-inset-top)]">
          <div className="flex h-14 items-center justify-between px-4">
            <a
              href="#home"
              className="font-display text-base font-semibold tracking-tight"
              aria-label="Bo Hubbard home"
            >
              BH<span className="text-gradient">.</span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full text-foreground"
            >
              {open ? (
                <X className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </header>
        <div
          className="h-[calc(3.5rem+env(safe-area-inset-top))]"
          aria-hidden="true"
        />
      </div>
      {menuOverlay}
    </>
  );
}
