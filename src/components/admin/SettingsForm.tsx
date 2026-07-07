"use client";

import { useActionState } from "react";
import { saveSettings } from "@/lib/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormStatus } from "@/components/admin/FormStatus";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { SiteSettings } from "@/lib/content/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [result, action, pending] = useActionState(saveSettings, null);

  return (
    <AdminShell title="Settings">
      <form action={action} className="admin-card space-y-4">
        <div className="admin-field">
          <label className="admin-label" htmlFor="meta_title">
            Page title
          </label>
          <input
            id="meta_title"
            name="meta_title"
            defaultValue={settings.metaTitle}
            className="admin-input w-full"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="meta_description">
            Meta description
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            defaultValue={settings.metaDescription}
            className="admin-textarea w-full"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="og_url">
            Open Graph URL
          </label>
          <input
            id="og_url"
            name="og_url"
            type="url"
            defaultValue={settings.ogUrl}
            className="admin-input w-full"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="resume_label">
              Resume button label
            </label>
            <input
              id="resume_label"
              name="resume_label"
              defaultValue={settings.resumeLabel}
              className="admin-input w-full"
            />
          </div>
        </div>

        <ImageUpload
          name="resume_url"
          defaultValue={settings.resumeUrl}
          label="Resume file URL"
          accept=".pdf,application/pdf"
        />

        <FormStatus result={result} />

        <button type="submit" disabled={pending} className="admin-button">
          {pending ? "Saving..." : "Save settings"}
        </button>
      </form>
    </AdminShell>
  );
}
