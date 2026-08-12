import Image from "next/image";
import { AboutLocationBlurb } from "./AboutLocationBlurb";
import { Reveal } from "./Reveal";

export function About() {
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
                      src="/images/bo-hubbard-graduation.png"
                      alt="Bo Hubbard at ASU graduation in maroon and gold regalia"
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
                  Bo Hubbard{" "}
                  <span className="text-gradient">developer &amp; designer</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-5 text-base leading-relaxed text-muted">
                <p>
                  I am a Computer Science graduate based in Chicago, IL. I like to combine technical development with my eye
                  for design, aiming to create products and software that are
                  intuitive and engaging.
                </p>
                <p>
                  My passion for problem-solving drives everything I do.
                  I&apos;m motivated, competitive, and persistent. I like the
                  challenge of turning complex ideas into real solutions,
                  especially if they improve how people interact with
                  technology. I am always looking for ways to make software
                  more meaningful and effective.
                </p>
                <p>
                  My roots in technology started early through playing video
                  games and building on sandbox platforms like Roblox, where I
                  discovered the crossroads of problem-solving and creativity.
                  That foundation continues to shape my approach — curious,
                  iterative, and focused.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="flex flex-wrap gap-3" aria-label="Quick facts">
                <AboutLocationBlurb />
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
