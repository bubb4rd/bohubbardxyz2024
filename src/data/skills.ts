export type SkillItem = {
  name: string;
  icon: string;
  accent: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  description: string;
  accent: string;
  skills: SkillItem[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    description: "Core languages from coursework and production projects.",
    accent: "#3B82F6",
    skills: [
      { name: "JavaScript", icon: "javascript", accent: "#F7DF1E" },
      { name: "TypeScript", icon: "typescript", accent: "#3178C6" },
      { name: "Java", icon: "java", accent: "#007396" },
      { name: "C++", icon: "cplusplus", accent: "#00599C" },
      { name: "Python", icon: "python", accent: "#3776AB" },
      { name: "SQL", icon: "sql", accent: "#4479A1" },
      { name: "Swift", icon: "swift", accent: "#F05138" },
      { name: "SwiftUI", icon: "swiftui", accent: "#0A84FF" },
    ],
  },
  {
    id: "web",
    title: "Web Development",
    description: "Front-end and API-driven experiences shipped to users.",
    accent: "#8B5CF6",
    skills: [
      { name: "React", icon: "react", accent: "#61DAFB" },
      { name: "Node.js", icon: "nodejs", accent: "#339933" },
      { name: "HTML", icon: "html", accent: "#E34F26" },
      { name: "CSS", icon: "css", accent: "#1572B6" },
      { name: "Tailwind CSS", icon: "tailwindcss", accent: "#06B6D4" },
      { name: "REST APIs", icon: "rest", accent: "#10B981" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Technologies",
    description: "Design, deployment, and collaboration stack.",
    accent: "#F472B6",
    skills: [
      { name: "Git", icon: "git", accent: "#F05032" },
      { name: "GitHub", icon: "github", accent: "#181717" },
      { name: "MongoDB", icon: "mongodb", accent: "#47A248" },
      { name: "Firebase", icon: "firebase", accent: "#DD2C00" },
      { name: "Figma", icon: "figma", accent: "#F24E1E" },
      { name: "Adobe Creative Suite", icon: "adobe", accent: "#FF0000" },
      { name: "Windows", icon: "windows", accent: "#0078D4" },
      { name: "Mac", icon: "mac", accent: "#555555" },
    ],
  },
];
