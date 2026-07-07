import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectsList } from "@/components/admin/ProjectsList";
import { getProjects } from "@/lib/content/get-content";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <AdminShell title="Projects">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-400">
          {projects.length} project{projects.length === 1 ? "" : "s"} · drag to
          reorder
        </p>
        <Link href="/admin/projects/new" className="admin-button">
          New project
        </Link>
      </div>

      <ProjectsList projects={projects} />
    </AdminShell>
  );
}
