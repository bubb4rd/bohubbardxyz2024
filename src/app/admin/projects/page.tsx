import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getProjects } from "@/lib/content/get-content";
import { deleteProject } from "@/lib/admin/actions";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <AdminShell title="Projects">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-400">
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
        <Link href="/admin/projects/new" className="admin-button">
          New project
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="admin-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-medium text-white">{project.title}</h2>
              <p className="text-sm text-zinc-400">
                {project.subtitle} · {project.category}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/projects/${project.id}`}
                className="admin-button-secondary"
              >
                Edit
              </Link>
              <form action={deleteProject.bind(null, project.id)}>
                <button type="submit" className="admin-button-secondary text-red-300">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
