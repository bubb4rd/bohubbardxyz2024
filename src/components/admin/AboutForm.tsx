"use client";

import { useActionState } from "react";
import { saveAbout } from "@/lib/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormStatus } from "@/components/admin/FormStatus";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { SiteSettings } from "@/lib/content/types";

export function AboutForm({ settings }: { settings: SiteSettings }) {
  const [result, action, pending] = useActionState(saveAbout, null);

  return (
    <AdminShell title="About & Hero">
      <form action={action} className="admin-card space-y-6">
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-white">Hero</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-field">
              <label className="admin-label" htmlFor="hero_line_1">
                Headline line 1
              </label>
              <input
                id="hero_line_1"
                name="hero_line_1"
                defaultValue={settings.heroLine1}
                className="admin-input w-full"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="hero_line_2">
                Headline line 2
              </label>
              <input
                id="hero_line_2"
                name="hero_line_2"
                defaultValue={settings.heroLine2}
                className="admin-input w-full"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-field">
              <label className="admin-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={settings.name}
                className="admin-input w-full"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="credential">
                Credential
              </label>
              <input
                id="credential"
                name="credential"
                defaultValue={settings.credential}
                className="admin-input w-full"
              />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="subtext">
              Subtext
            </label>
            <textarea
              id="subtext"
              name="subtext"
              defaultValue={settings.subtext}
              className="admin-textarea w-full"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="hero_roles">
              Rotating roles (one per line)
            </label>
            <textarea
              id="hero_roles"
              name="hero_roles"
              defaultValue={settings.heroRoles.join("\n")}
              className="admin-textarea w-full"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-white">About</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-field">
              <label className="admin-label" htmlFor="about_heading">
                Heading
              </label>
              <input
                id="about_heading"
                name="about_heading"
                defaultValue={settings.aboutHeading}
                className="admin-input w-full"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="about_subheading">
                Subheading
              </label>
              <input
                id="about_subheading"
                name="about_subheading"
                defaultValue={settings.aboutSubheading}
                className="admin-input w-full"
              />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="about_paragraphs">
              Paragraphs (blank line between)
            </label>
            <textarea
              id="about_paragraphs"
              name="about_paragraphs"
              defaultValue={settings.aboutParagraphs.join("\n\n")}
              className="admin-textarea min-h-48 w-full"
            />
          </div>
          <ImageUpload
            name="about_image_url"
            defaultValue={settings.aboutImageUrl}
            label="Profile image"
          />
          <div className="admin-field">
            <label className="admin-label" htmlFor="about_image_alt">
              Image alt text
            </label>
            <input
              id="about_image_alt"
              name="about_image_alt"
              defaultValue={settings.aboutImageAlt}
              className="admin-input w-full"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-field">
              <label className="admin-label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                defaultValue={settings.location}
                className="admin-input w-full"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="timezone">
                Timezone (IANA)
              </label>
              <input
                id="timezone"
                name="timezone"
                defaultValue={settings.timezone}
                className="admin-input w-full"
              />
            </div>
          </div>
        </section>

        <FormStatus result={result} />

        <button type="submit" disabled={pending} className="admin-button">
          {pending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </AdminShell>
  );
}
