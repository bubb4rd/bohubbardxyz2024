export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  href?: string;
  github?: string;
  category: "dev" | "design";
  accent: string;
  image?: string;
  featured?: boolean;
  spotlight?: boolean;
};

export type TimelineEntry = {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  location?: string;
  start: string;
  end: string;
  description: string;
  accent: string;
  image: string;
  imageAlt: string;
};

export type SkillItem = {
  id?: string;
  name: string;
  icon: string;
  accent: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  accent: string;
  skills: SkillItem[];
};

export type SocialLinkIcon = "github" | "linkedin" | "email" | "behance";

export type SocialLink = {
  id?: string;
  label: string;
  href: string;
  icon: SocialLinkIcon;
};

export type ResumeLink = {
  label: string;
  href: string;
};

export type SiteSettings = {
  heroLine1: string;
  heroLine2: string;
  name: string;
  credential: string;
  subtext: string;
  heroRoles: string[];
  aboutHeading: string;
  aboutSubheading: string;
  aboutParagraphs: string[];
  aboutImageUrl: string;
  aboutImageAlt: string;
  location: string;
  timezone: string;
  metaTitle: string;
  metaDescription: string;
  ogUrl: string;
  resumeUrl: string;
  resumeLabel: string;
};

export type PortfolioContent = {
  settings: SiteSettings;
  projects: Project[];
  timelineEntries: TimelineEntry[];
  skillCategories: SkillCategory[];
  socialLinks: SocialLink[];
  resumeLink: ResumeLink;
};

export type DbProject = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  href: string | null;
  github: string | null;
  category: "dev" | "design";
  accent: string;
  image_url: string | null;
  featured: boolean;
  spotlight: boolean;
  sort_order: number;
};

export type DbTimelineEntry = {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  location: string | null;
  start_date: string;
  end_date: string;
  description: string;
  accent: string;
  image_url: string;
  image_alt: string;
  sort_order: number;
};

export type DbSiteSettings = {
  id: string;
  hero_line_1: string;
  hero_line_2: string;
  name: string;
  credential: string;
  subtext: string;
  hero_roles: string[];
  about_heading: string;
  about_subheading: string;
  about_paragraphs: string[];
  about_image_url: string;
  about_image_alt: string;
  location: string;
  timezone: string;
  meta_title: string;
  meta_description: string;
  og_url: string;
  resume_url: string;
  resume_label: string;
};

export type DbSkillCategory = {
  id: string;
  title: string;
  accent: string;
  sort_order: number;
};

export type DbSkill = {
  id: string;
  category_id: string;
  name: string;
  icon: string;
  accent: string;
  sort_order: number;
};

export type DbSocialLink = {
  id: string;
  label: string;
  href: string;
  icon: SocialLinkIcon;
  sort_order: number;
};
