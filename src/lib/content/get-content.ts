import { unstable_cache } from "next/cache";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { seedContent } from "@/lib/content/seed";
import { PORTFOLIO_TAG } from "@/lib/content/revalidate";
import type {
  DbProject,
  DbSiteSettings,
  DbSkill,
  DbSkillCategory,
  DbSocialLink,
  DbTimelineEntry,
  PortfolioContent,
  Project,
  SiteSettings,
  SkillCategory,
  SocialLink,
  TimelineEntry,
} from "@/lib/content/types";

function mapSettings(row: DbSiteSettings): SiteSettings {
  return {
    heroLine1: row.hero_line_1,
    heroLine2: row.hero_line_2,
    name: row.name,
    credential: row.credential,
    subtext: row.subtext,
    heroRoles: row.hero_roles,
    aboutHeading: row.about_heading,
    aboutSubheading: row.about_subheading,
    aboutParagraphs: row.about_paragraphs,
    aboutImageUrl: row.about_image_url,
    aboutImageAlt: row.about_image_alt,
    location: row.location,
    timezone: row.timezone,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogUrl: row.og_url,
    resumeUrl: row.resume_url,
    resumeLabel: row.resume_label,
  };
}

function mapProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    tags: row.tags,
    href: row.href ?? undefined,
    github: row.github ?? undefined,
    category: row.category,
    accent: row.accent,
    image: row.image_url ?? undefined,
    featured: row.featured,
    spotlight: row.spotlight,
  };
}

function mapTimelineEntry(row: DbTimelineEntry): TimelineEntry {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    organization: row.organization,
    location: row.location ?? undefined,
    start: row.start_date,
    end: row.end_date,
    description: row.description,
    accent: row.accent,
    image: row.image_url,
    imageAlt: row.image_alt,
  };
}

function mapSkillCategories(
  categories: DbSkillCategory[],
  skills: DbSkill[],
): SkillCategory[] {
  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    accent: category.accent,
    skills: skills
      .filter((skill) => skill.category_id === category.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((skill) => ({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        accent: skill.accent,
      })),
  }));
}

function mapSocialLinks(rows: DbSocialLink[]): SocialLink[] {
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    href: row.href,
    icon: row.icon,
  }));
}

async function fetchPortfolioContent(): Promise<PortfolioContent> {
  if (!isSupabaseConfigured()) {
    return seedContent;
  }

  const supabase = createPublicClient();

  const [
    settingsResult,
    projectsResult,
    timelineResult,
    categoriesResult,
    skillsResult,
    socialResult,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", "main").maybeSingle(),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("timeline_entries").select("*").order("sort_order"),
    supabase.from("skill_categories").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
  ]);

  const settingsRow = settingsResult.data as DbSiteSettings | null;
  const projects = (projectsResult.data as DbProject[] | null) ?? [];
  const timeline = (timelineResult.data as DbTimelineEntry[] | null) ?? [];
  const categories = (categoriesResult.data as DbSkillCategory[] | null) ?? [];
  const skills = (skillsResult.data as DbSkill[] | null) ?? [];
  const social = (socialResult.data as DbSocialLink[] | null) ?? [];

  const settings = settingsRow
    ? mapSettings(settingsRow)
    : seedContent.settings;

  return {
    settings,
    projects:
      projects.length > 0
        ? projects.map(mapProject)
        : seedContent.projects,
    timelineEntries:
      timeline.length > 0
        ? timeline.map(mapTimelineEntry)
        : seedContent.timelineEntries,
    skillCategories:
      categories.length > 0
        ? mapSkillCategories(categories, skills)
        : seedContent.skillCategories,
    socialLinks:
      social.length > 0 ? mapSocialLinks(social) : seedContent.socialLinks,
    resumeLink: {
      label: settings.resumeLabel,
      href: settings.resumeUrl,
    },
  };
}

export const getPortfolioContent = unstable_cache(
  fetchPortfolioContent,
  ["portfolio-content"],
  { tags: [PORTFOLIO_TAG] },
);

export async function getSiteSettings() {
  const content = await getPortfolioContent();
  return content.settings;
}

export async function getProjects() {
  const content = await getPortfolioContent();
  return content.projects;
}

export async function getTimelineEntries() {
  const content = await getPortfolioContent();
  return content.timelineEntries;
}

export async function getSkillCategories() {
  const content = await getPortfolioContent();
  return content.skillCategories;
}

export async function getContactContent() {
  const content = await getPortfolioContent();
  return {
    socialLinks: content.socialLinks,
    resumeLink: content.resumeLink,
  };
}
