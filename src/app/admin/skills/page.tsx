import { getSkillCategories } from "@/lib/content/get-content";
import { SkillsEditor } from "@/components/admin/SkillsEditor";

export default async function AdminSkillsPage() {
  const skillCategories = await getSkillCategories();
  return <SkillsEditor skillCategories={skillCategories} />;
}
