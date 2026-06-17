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
};

export const projects: Project[] = [
  {
    id: "wkcc-perks",
    title: "WKCC Perks",
    subtitle: "iOS application",
    description:
      "Built from the ground up in Swift and SwiftUI — a perks directory connecting chamber members with 50 local partner businesses.",
    tags: ["Swift", "SwiftUI", "REST APIs", "iOS"],
    href: "https://github.com/bubb4rd/WKCC-Perks",
    category: "dev",
    accent: "#3B82F6",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1400&q=80&auto=format&fit=crop",
  },
  {
    id: "pantrypulse",
    title: "PantryPulse",
    subtitle: "Recipe tracking app",
    description:
      "Full-stack recipe app for discovering meals from available ingredients.",
    tags: ["React", "Tailwind CSS", "Firebase", "REST APIs"],
    href: "https://pantrypulse-22e13.firebaseapp.com/",
    category: "dev",
    accent: "#8B5CF6",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "borgwithus",
    title: "Borgwithus",
    subtitle: "Cocktail generator",
    description:
      "A dynamic drink name generator with 300+ monthly users.",
    tags: ["React", "CSS", "HTML", "Netlify"],
    href: "https://borgwithus.xyz",
    category: "dev",
    accent: "#06B6D4",
    image:
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "bubbard",
    title: "BUBBARD Design",
    subtitle: "Freelance graphic design",
    description:
      "Digital graphics and visual content engaging 100+ users per post. Direct client collaboration to deliver designs aligned with brand vision across social platforms.",
    tags: ["Adobe Creative Suite", "Figma", "Social Media"],
    href: "https://be.net/bubbard/",
    category: "design",
    accent: "#F472B6",
    featured: true,
    image: "/images/bubbard-design-project.png",
  },
  {
    id: "banana",
    title: "Banana",
    subtitle: "Discord bot",
    description:
      "Multipurpose Discord bot built to increase interactivity in servers.",
    tags: ["Node.js", "MongoDB", "discord.js", "Heroku"],
    href: "https://discord.com/oauth2/authorize?client_id=1184364896071196672&permissions=8&scope=bot",
    category: "dev",
    accent: "#F59E0B",
    image: "/images/banana-project.jpg",
  },
  {
    id: "temporal-haven",
    title: "Temporal Haven",
    subtitle: "Command-line adventure",
    description:
      "Text adventure game — uncover corrupt governments and time travel through the terminal.",
    tags: ["C++", "CMake"],
    href: "https://github.com/bubb4rd/temporal_haven",
    category: "dev",
    accent: "#10B981",
    image:
      "/images/temporal.jpg",
  },
];
