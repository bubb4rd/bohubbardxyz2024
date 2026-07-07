import { DesktopSidebar } from "@/components/DesktopSidebar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getPortfolioContent } from "@/lib/content/get-content";

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <>
      <DesktopSidebar />
      <ScrollToTop />
      <main>
        <Hero
          settings={content.settings}
          resumeLink={content.resumeLink}
        />
        <About settings={content.settings} />
        <ExperienceTimeline timelineEntries={content.timelineEntries} />
        <Projects projects={content.projects} />
        <Skills skillCategories={content.skillCategories} />
        <Contact
          socialLinks={content.socialLinks}
          resumeLink={content.resumeLink}
        />
      </main>
      <Footer />
    </>
  );
}
