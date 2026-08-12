import { DesktopSidebar } from "@/components/DesktopSidebar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <DesktopSidebar />
      <ScrollToTop />
      <main>
        <Hero />
        <About />
        <ExperienceTimeline />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
