import { createClient } from "@supabase/supabase-js";
import { seedContent } from "../src/lib/content/seed";
import {
  printSupabaseEnvHelp,
  validateSupabaseEnv,
} from "./lib/validate-supabase-env";

const validation = validateSupabaseEnv();
if (!validation.ok) {
  console.error("Cannot seed: invalid Supabase env.\n");
  for (const error of validation.errors) {
    console.error(`- ${error}`);
  }
  printSupabaseEnvHelp();
  process.exit(1);
}

const supabase = createClient(validation.url!, validation.serviceKey!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  const { settings, projects, timelineEntries, skillCategories, socialLinks } =
    seedContent;

  const { error: settingsError } = await supabase.from("site_settings").upsert({
    id: "main",
    hero_line_1: settings.heroLine1,
    hero_line_2: settings.heroLine2,
    name: settings.name,
    credential: settings.credential,
    subtext: settings.subtext,
    hero_roles: settings.heroRoles,
    about_heading: settings.aboutHeading,
    about_subheading: settings.aboutSubheading,
    about_paragraphs: settings.aboutParagraphs,
    about_image_url: settings.aboutImageUrl,
    about_image_alt: settings.aboutImageAlt,
    location: settings.location,
    timezone: settings.timezone,
    meta_title: settings.metaTitle,
    meta_description: settings.metaDescription,
    og_url: settings.ogUrl,
    resume_url: settings.resumeUrl,
    resume_label: settings.resumeLabel,
  });

  if (settingsError) throw settingsError;

  const { error: deleteProjectsError } = await supabase
    .from("projects")
    .delete()
    .neq("id", "");
  if (deleteProjectsError) throw deleteProjectsError;

  const { error: projectsError } = await supabase.from("projects").insert(
    projects.map((project, index) => ({
      id: project.id,
      title: project.title,
      subtitle: project.subtitle,
      description: project.description,
      tags: project.tags,
      href: project.href ?? null,
      github: project.github ?? null,
      category: project.category,
      accent: project.accent,
      image_url: project.image ?? null,
      featured: project.featured ?? false,
      spotlight: project.spotlight ?? false,
      sort_order: index,
    })),
  );
  if (projectsError) throw projectsError;

  const { error: deleteTimelineError } = await supabase
    .from("timeline_entries")
    .delete()
    .neq("id", "");
  if (deleteTimelineError) throw deleteTimelineError;

  const { error: timelineError } = await supabase.from("timeline_entries").insert(
    timelineEntries.map((entry, index) => ({
      id: entry.id,
      type: entry.type,
      title: entry.title,
      organization: entry.organization,
      location: entry.location ?? null,
      start_date: entry.start,
      end_date: entry.end,
      description: entry.description,
      accent: entry.accent,
      image_url: entry.image,
      image_alt: entry.imageAlt,
      sort_order: index,
    })),
  );
  if (timelineError) throw timelineError;

  const { error: deleteSkillsError } = await supabase
    .from("skills")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteSkillsError) throw deleteSkillsError;

  const { error: deleteCategoriesError } = await supabase
    .from("skill_categories")
    .delete()
    .neq("id", "");
  if (deleteCategoriesError) throw deleteCategoriesError;

  const { error: categoriesError } = await supabase.from("skill_categories").insert(
    skillCategories.map((category, index) => ({
      id: category.id,
      title: category.title,
      accent: category.accent,
      sort_order: index,
    })),
  );
  if (categoriesError) throw categoriesError;

  const skills = skillCategories.flatMap((category) =>
    category.skills.map((skill, index) => ({
      category_id: category.id,
      name: skill.name,
      icon: skill.icon,
      accent: skill.accent,
      sort_order: index,
    })),
  );

  const { error: skillsError } = await supabase.from("skills").insert(skills);
  if (skillsError) throw skillsError;

  const { error: deleteSocialError } = await supabase
    .from("social_links")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteSocialError) throw deleteSocialError;

  const { error: socialError } = await supabase.from("social_links").insert(
    socialLinks.map((link, index) => ({
      label: link.label,
      href: link.href,
      icon: link.icon,
      sort_order: index,
    })),
  );
  if (socialError) throw socialError;

  console.log("Seed complete.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
