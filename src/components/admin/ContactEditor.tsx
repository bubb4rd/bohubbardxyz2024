"use client";

import { useActionState } from "react";
import { saveSocialLink, deleteSocialLink } from "@/lib/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormStatus } from "@/components/admin/FormStatus";
import { CONTACT_ICON_OPTIONS } from "@/lib/icons/contact-icons";
import type { SocialLink } from "@/lib/content/types";

function SocialLinkRow({
  link,
  sortOrder,
}: {
  link?: SocialLink;
  sortOrder: number;
}) {
  const [result, action, pending] = useActionState(saveSocialLink, null);
  const isNew = !link?.id;

  return (
    <form
      action={action}
      className="admin-card grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto_auto] sm:items-center"
    >
      {link?.id ? <input type="hidden" name="link_id" value={link.id} /> : null}
      <input type="hidden" name="sort_order" value={sortOrder} />

      <input
        name="label"
        defaultValue={link?.label ?? ""}
        placeholder="Label"
        className="admin-input"
        required={!isNew}
      />
      <input
        name="href"
        defaultValue={link?.href ?? ""}
        placeholder="URL"
        className="admin-input"
        required={!isNew}
      />
      <select name="icon" defaultValue={link?.icon ?? "github"} className="admin-select">
        {CONTACT_ICON_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={pending} className="admin-button-secondary">
        {isNew ? "Add" : "Save"}
      </button>
      {link?.id ? (
        <button
          type="submit"
          formAction={deleteSocialLink.bind(null, link.id!)}
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

export function ContactEditor({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <AdminShell title="Contact">
      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <SocialLinkRow key={link.id ?? link.label} link={link} sortOrder={index} />
        ))}
        <SocialLinkRow sortOrder={socialLinks.length} />
      </div>
    </AdminShell>
  );
}
