"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveProject } from "@/lib/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormStatus } from "@/components/admin/FormStatus";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Project } from "@/lib/content/types";

export function ProjectForm({
  project,
  sortOrder,
}: {
  project?: Project;
  sortOrder: number;
}) {
  const [result, action, pending] = useActionState(saveProject, null);
  const isNew = !project;

  return (
    <AdminShell title={isNew ? "New project" : "Edit project"}>
      <form action={action} className="admin-card space-y-4">
        {!isNew ? (
          <input type="hidden" name="id" value={project?.id ?? ""} />
        ) : null}

        <div className="admin-field">
          <label className="admin-label" htmlFor="id_display">
            ID (slug)
          </label>
          <input
            id="id_display"
            name={isNew ? "id" : undefined}
            defaultValue={project?.id ?? ""}
            required
            readOnly={!isNew}
            className="admin-input w-full read-only:opacity-60"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={project?.title ?? ""}
              required
              className="admin-input w-full"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="subtitle">
              Subtitle
            </label>
            <input
              id="subtitle"
              name="subtitle"
              defaultValue={project?.subtitle ?? ""}
              required
              className="admin-input w-full"
            />
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={project?.description ?? ""}
            required
            className="admin-textarea w-full"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={project?.tags.join(", ") ?? ""}
            className="admin-input w-full"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="href">
              Live URL
            </label>
            <input
              id="href"
              name="href"
              type="text"
              inputMode="url"
              placeholder="https://example.com"
              defaultValue={project?.href ?? ""}
              className="admin-input w-full"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="github">
              GitHub URL
            </label>
            <input
              id="github"
              name="github"
              type="text"
              inputMode="url"
              placeholder="https://github.com/..."
              defaultValue={project?.github ?? ""}
              className="admin-input w-full"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="admin-field">
            <label className="admin-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={project?.category ?? "dev"}
              className="admin-select w-full"
            >
              <option value="dev">Development</option>
              <option value="design">Design</option>
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="accent">
              Accent color
            </label>
            <input
              id="accent"
              name="accent"
              type="color"
              defaultValue={project?.accent ?? "#3B82F6"}
              className="admin-input h-10 w-full"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="sort_order_display">
              Sort order
            </label>
            <input
              id="sort_order_display"
              name="sort_order"
              type="number"
              defaultValue={sortOrder}
              className="admin-input w-full"
            />
          </div>
        </div>

        <ImageUpload
          name="image_url"
          defaultValue={project?.image ?? ""}
          label="Project image"
        />

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? false}
            />
            Featured (wide card)
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="spotlight"
              defaultChecked={project?.spotlight ?? false}
            />
            Spotlight badge
          </label>
        </div>

        <FormStatus result={result} />

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="admin-button">
            {pending ? "Saving..." : "Save project"}
          </button>
          <Link href="/admin/projects" className="admin-button-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </AdminShell>
  );
}
