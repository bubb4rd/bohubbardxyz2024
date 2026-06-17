export const heroRoles = [
  "Software Developer",
  "App Developer",
  "UI Designer",
  "Graphic Designer",
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
  image: string;
  imageAlt: string;
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
    description: "Building WKCC Perks, a SwiftUI app for 50+ local chamber businesses, and more.",
    accent: "#3B82F6",
    image:
      "/images/WKCCLogo.png",
    imageAlt: "iPhone displaying a mobile application interface",
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
    image: "/images/A41.jpg",
    imageAlt: "Graphic design work created for Arizona State University marketing",
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
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Arcade entertainment floor with glowing game cabinets",
  },
  {
    id: "asu",
    type: "education",
    title: "B.S. Computer Science",
    organization: "Arizona State University",
    location: "Tempe, AZ",
    start: "Aug 2022",
    end: "May 2026",
    description:
      "Software Engineering, Human Computer Interaction, and design foundations.",
    accent: "#8B5CF6",
    image: "/images/asu.jpg",
    imageAlt: "Bo Hubbard at ASU graduation in maroon and gold regalia",
  },
];
