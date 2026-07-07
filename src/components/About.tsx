import Image from "next/image";
import { AboutLocationBlurb } from "./AboutLocationBlurb";
import { Reveal } from "./Reveal";
import type { SiteSettings } from "@/lib/content/types";

export function About({ settings }: { settings: SiteSettings }) {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-wide">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(340px,480px)_1fr] lg:gap-16">
          <Reveal>
            <div className="mx-auto w-full max-w-lg lg:max-w-none">
              <div className="about-photo-wrapper">
                <div className="about-photo-glow" aria-hidden="true" />
                <div className="about-photo-frame rounded-2xl p-[2px]">
                  <div className="about-photo-frame__inner overflow-hidden rounded-[14px] bg-surface">
                    <Image
                      src={settings.aboutImageUrl}
                      alt={settings.aboutImageAlt}
                      width={840}
                      height={1050}
                      className="aspect-[4/5] w-full object-cover object-top"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-8">
            <Reveal delay={0.05}>
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {settings.aboutHeading}{" "}
                  <span className="text-gradient">{settings.aboutSubheading}</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-5 text-base leading-relaxed text-muted">
                {settings.aboutParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="flex flex-wrap gap-3" aria-label="Quick facts">
                <AboutLocationBlurb
                  location={settings.location}
                  timezone={settings.timezone}
                />
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
