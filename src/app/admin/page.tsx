import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

const sections = [
  {
    href: "/admin/projects",
    title: "Projects",
    description: "Add, edit, or remove portfolio projects.",
  },
  {
    href: "/admin/about",
    title: "About & Hero",
    description: "Update hero copy, bio, and profile image.",
  },
  {
    href: "/admin/experience",
    title: "Experience",
    description: "Manage career roadmap timeline entries.",
  },
  {
    href: "/admin/skills",
    title: "Skills",
    description: "Edit skill categories and chips.",
  },
  {
    href: "/admin/contact",
    title: "Contact",
    description: "Update social links.",
  },
  {
    href: "/admin/settings",
    title: "Settings",
    description: "SEO metadata and resume link.",
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="admin-card block transition-colors hover:border-zinc-600"
          >
            <h2 className="font-display text-lg font-semibold text-white">
              {section.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-400">{section.description}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
