"use client";

import { useActionState } from "react";
import { saveSkill, saveSkillCategory } from "@/lib/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormStatus } from "@/components/admin/FormStatus";
import type { SkillCategory } from "@/lib/content/types";
import { deleteSkill } from "@/lib/admin/actions";

const ICON_OPTIONS = [
  "javascript", "typescript", "java", "cplusplus", "python", "sql", "swift",
  "ios", "android", "react", "nodejs", "html", "css", "tailwindcss",
  "threedotjs", "gsap", "wordpress", "rest", "git", "github", "mongodb",
  "firebase", "figma", "adobe", "windows", "mac",
];

function CategoryEditor({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const [categoryResult, categoryAction, categoryPending] = useActionState(
    saveSkillCategory,
    null,
  );

  return (
    <div className="admin-card space-y-4">
      <form action={categoryAction} className="space-y-3 border-b border-zinc-800 pb-4">
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="sort_order" value={index} />
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            name="title"
            defaultValue={category.title}
            className="admin-input"
            placeholder="Category title"
          />
          <input
            name="accent"
            type="color"
            defaultValue={category.accent}
            className="admin-input h-10"
          />
          <button type="submit" disabled={categoryPending} className="admin-button-secondary">
            Save category
          </button>
        </div>
        <FormStatus result={categoryResult} />
      </form>

      <div className="space-y-3">
        {category.skills.map((skill, skillIndex) => (
          <SkillRow
            key={skill.id ?? `${category.id}-${skill.name}`}
            categoryId={category.id}
            skill={skill}
            sortOrder={skillIndex}
          />
        ))}
        <SkillRow categoryId={category.id} sortOrder={category.skills.length} />
      </div>
    </div>
  );
}

function SkillRow({
  categoryId,
  skill,
  sortOrder,
}: {
  categoryId: string;
  skill?: SkillCategory["skills"][number];
  sortOrder: number;
}) {
  const [result, action, pending] = useActionState(saveSkill, null);
  const isNew = !skill?.id;

  return (
    <form action={action} className="grid gap-2 rounded-lg border border-zinc-800 p-3 sm:grid-cols-[1fr_140px_100px_auto_auto] sm:items-center">
      {skill?.id ? <input type="hidden" name="skill_id" value={skill.id} /> : null}
      <input type="hidden" name="category_id" value={categoryId} />
      <input type="hidden" name="sort_order" value={sortOrder} />
      <input
        name="name"
        defaultValue={skill?.name ?? ""}
        placeholder="Skill name"
        className="admin-input"
        required={!isNew}
      />
      <select name="icon" defaultValue={skill?.icon ?? "react"} className="admin-select">
        {ICON_OPTIONS.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>
      <input
        name="accent"
        type="color"
        defaultValue={skill?.accent ?? "#3B82F6"}
        className="admin-input h-10"
      />
      <button type="submit" disabled={pending} className="admin-button-secondary">
        {isNew ? "Add" : "Save"}
      </button>
      {skill?.id ? (
        <button
          type="submit"
          formAction={deleteSkill.bind(null, skill.id!)}
          className="admin-button-secondary text-red-300"
        >
          Delete
        </button>
      ) : (
        <span />
      )}
      <div className="sm:col-span-full">
        <FormStatus result={result} />
      </div>
    </form>
  );
}

export function SkillsEditor({
  skillCategories,
}: {
  skillCategories: SkillCategory[];
}) {
  return (
    <AdminShell title="Skills">
      <div className="space-y-6">
        {skillCategories.map((category, index) => (
          <CategoryEditor key={category.id} category={category} index={index} />
        ))}
      </div>
    </AdminShell>
  );
}
