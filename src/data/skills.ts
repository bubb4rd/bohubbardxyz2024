export type SkillItem = {
  name: string;
  icon: string;
  accent: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  accent: string;
  column: "left" | "right" | "full";
  skills: SkillItem[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    accent: "#3B82F6",
    column: "left",
    skills: [
      { name: "JavaScript", icon: "javascript", accent: "#F7DF1E" },
      { name: "TypeScript", icon: "typescript", accent: "#3178C6" },
      { name: "Java", icon: "java", accent: "#007396" },
      { name: "C++", icon: "cplusplus", accent: "#00599C" },
      { name: "Python", icon: "python", accent: "#3776AB" },
      { name: "SQL", icon: "sql", accent: "#4479A1" },
      { name: "Swift", icon: "swift", accent: "#F05138" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Development",
    accent: "#F05138",
    column: "left",
    skills: [
      { name: "iOS", icon: "ios", accent: "#000000" },
      { name: "Android", icon: "android", accent: "#3DDC84" },
    ],
  },
  {
    id: "web",
    title: "Web Development",
    accent: "#8B5CF6",
    column: "right",
    skills: [
      { name: "React", icon: "react", accent: "#61DAFB" },
      { name: "Node.js", icon: "nodejs", accent: "#339933" },
      { name: "HTML", icon: "html", accent: "#E34F26" },
      { name: "CSS", icon: "css", accent: "#1572B6" },
      { name: "Tailwind CSS", icon: "tailwindcss", accent: "#06B6D4" },
      { name: "Three.js", icon: "threedotjs", accent: "#000000" },
      { name: "GSAP", icon: "gsap", accent: "#88CE02" },
      { name: "WordPress", icon: "wordpress", accent: "#21759B" },
      { name: "REST APIs", icon: "rest", accent: "#10B981" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Technologies",
    accent: "#F472B6",
    column: "full",
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
