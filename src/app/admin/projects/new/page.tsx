import { getProjects } from "@/lib/content/get-content";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const projects = await getProjects();

  return <ProjectForm sortOrder={projects.length} />;
}
