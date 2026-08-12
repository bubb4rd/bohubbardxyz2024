"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { resumeLink, socialLinks } from "@/data/contact";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const links = sectionRef.current.querySelectorAll(".contact-link");

      links.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link.querySelector(".link-arrow"), {
            x: 4,
            y: -4,
            duration: 0.25,
          });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link.querySelector(".link-arrow"), {
            x: 0,
            y: 0,
            duration: 0.25,
          });
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const allLinks = [
    ...socialLinks.map((link) => ({
      ...link,
      external: !link.href.startsWith("mailto"),
      download: false,
    })),
    {
      ...resumeLink,
      external: false,
      download: true,
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding bg-gradient-subtle"
    >
      <div className="container-wide">
        <Reveal>
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:p-16">
            <h2 className="font-display max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s build something{" "}
              <span className="text-gradient">together</span>
            </h2>
            <p className="mt-4 max-w-lg text-muted">Reach out anytime.</p>

            <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {allLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      download={link.download || undefined}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="contact-link group inline-flex cursor-pointer items-center gap-3 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-accent-blue/40"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted" />
                      {link.label}
                      <ArrowUpRight className="link-arrow h-4 w-4 text-muted transition-colors group-hover:text-foreground" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
