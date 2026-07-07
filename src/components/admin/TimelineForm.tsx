"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveTimelineEntry } from "@/lib/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormStatus } from "@/components/admin/FormStatus";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { TimelineEntry } from "@/lib/content/types";

export function TimelineForm({
  entry,
  sortOrder,
}: {
  entry?: TimelineEntry;
  sortOrder: number;
}) {
  const [result, action, pending] = useActionState(saveTimelineEntry, null);
  const isNew = !entry;

  return (
    <AdminShell title={isNew ? "New timeline entry" : "Edit timeline entry"}>
      <form action={action} className="admin-card space-y-4">
        {!isNew ? <input type="hidden" name="id" value={entry.id} /> : null}

        <div className="admin-field">
          <label className="admin-label" htmlFor="id_display">
            ID (slug)
          </label>
          <input
            id="id_display"
            name={isNew ? "id" : undefined}
            defaultValue={entry?.id ?? ""}
            required
            readOnly={!isNew}
            className="admin-input w-full read-only:opacity-60"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue={entry?.type ?? "work"}
              className="admin-select w-full"
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="sort_order">
              Sort order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={sortOrder}
              className="admin-input w-full"
            />
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={entry?.title ?? ""}
            required
            className="admin-input w-full"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="organization">
              Organization
            </label>
            <input
              id="organization"
              name="organization"
              defaultValue={entry?.organization ?? ""}
              required
              className="admin-input w-full"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              defaultValue={entry?.location ?? ""}
              className="admin-input w-full"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="start_date">
              Start
            </label>
            <input
              id="start_date"
              name="start_date"
              defaultValue={entry?.start ?? ""}
              required
              className="admin-input w-full"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="end_date">
              End
            </label>
            <input
              id="end_date"
              name="end_date"
              defaultValue={entry?.end ?? ""}
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
            defaultValue={entry?.description ?? ""}
            required
            className="admin-textarea w-full"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="accent">
            Accent color
          </label>
          <input
            id="accent"
            name="accent"
            type="color"
            defaultValue={entry?.accent ?? "#3B82F6"}
            className="admin-input h-10 w-full"
          />
        </div>

        <ImageUpload
          name="image_url"
          defaultValue={entry?.image ?? ""}
          label="Timeline image"
        />

        <div className="admin-field">
          <label className="admin-label" htmlFor="image_alt">
            Image alt text
          </label>
          <input
            id="image_alt"
            name="image_alt"
            defaultValue={entry?.imageAlt ?? ""}
            required
            className="admin-input w-full"
          />
        </div>

        <FormStatus result={result} />

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="admin-button">
            {pending ? "Saving..." : "Save entry"}
          </button>
          <Link href="/admin/experience" className="admin-button-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </AdminShell>
  );
}
