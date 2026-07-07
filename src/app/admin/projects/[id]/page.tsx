import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content/get-content";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.id === id);
  const project = projects[index];

  if (!project) notFound();

  return <ProjectForm project={project} sortOrder={index} />;
}
