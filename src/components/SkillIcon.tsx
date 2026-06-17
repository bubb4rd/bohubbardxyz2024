import type { IconType } from "react-icons";
import { BiLogoAdobe, BiLogoWindows } from "react-icons/bi";
import {
  SiAndroid,
  SiApple,
  SiCplusplus,
  SiCss,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGreensock,
  SiHtml5,
  SiIos,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiSwift,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiWordpress,
} from "react-icons/si";
import { Database, Layers, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  java: SiOpenjdk,
  cplusplus: SiCplusplus,
  python: SiPython,
  swift: SiSwift,
  react: SiReact,
  nodejs: SiNodedotjs,
  html: SiHtml5,
  css: SiCss,
  tailwindcss: SiTailwindcss,
  threedotjs: SiThreedotjs,
  gsap: SiGreensock,
  wordpress: SiWordpress,
  ios: SiIos,
  android: SiAndroid,
  git: SiGit,
  github: SiGithub,
  mongodb: SiMongodb,
  firebase: SiFirebase,
  figma: SiFigma,
  adobe: BiLogoAdobe,
  windows: BiLogoWindows,
  mac: SiApple,
};

const lucideMap: Record<string, LucideIcon> = {
  sql: Database,
  swiftui: Layers,
  rest: Waypoints,
};

type SkillIconProps = {
  icon: string;
  className?: string;
};

export function SkillIcon({ icon, className }: SkillIconProps) {
  const Lucide = lucideMap[icon];

  if (Lucide) {
    return (
      <Lucide
        className={className}
        strokeWidth={2.25}
        aria-hidden="true"
      />
    );
  }

  const Icon = iconMap[icon] ?? SiJavascript;
  return <Icon className={className} aria-hidden="true" />;
}
