export const heroRoles = [
  "Software Developer",
  "iOS Developer",
  "UI Designer",
  "Graphic Designer",
  "Full-Stack Developer",
];

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
};

export const timelineEntries: TimelineEntry[] = [
  {
    id: "wkcc",
    type: "work",
    title: "Software Development Intern",
    organization: "Wilmette Kenilworth Chamber of Commerce",
    location: "Wilmette, IL",
    start: "June 2026",
    end: "Present",
    description: "Building WKCC Perks, a SwiftUI app for 50+ local chamber businesses.",
    accent: "#3B82F6",
  },
  {
    id: "asu-design",
    type: "work",
    title: "Graphic Design Assistant",
    organization: "Arizona State University",
    location: "Tempe, AZ",
    start: "Nov 2025",
    end: "May 2026",
    description: "On-brand graphics for university marketing and events.",
    accent: "#F472B6",
  },
  {
    id: "main-event",
    type: "work",
    title: "Technician",
    organization: "Main Event Entertainment",
    location: "Tempe, AZ",
    start: "Oct 2024",
    end: "May 2025",
    description: "Kept 100+ arcade and computer systems up and running.",
    accent: "#06B6D4",
  },
  {
    id: "asu",
    type: "education",
    title: "B.S. Computer Science",
    organization: "Arizona State University",
    location: "Tempe, AZ",
    start: "2022",
    end: "May 2026",
    description:
      "Software Engineering, Human Computer Interaction, and design foundations.",
    accent: "#8B5CF6",
  },
];
