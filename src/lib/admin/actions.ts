"use server";

import { redirect } from "next/navigation";
import { revalidatePortfolio } from "@/lib/content/revalidate";
import { requireUser, type ActionResult } from "@/lib/admin/auth";
import type { SocialLinkIcon } from "@/lib/content/types";

export async function signIn(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/admin");
}

export async function signOut() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveAbout(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();

    const paragraphs = String(formData.get("about_paragraphs") ?? "")
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const heroRoles = String(formData.get("hero_roles") ?? "")
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("site_settings")
      .update({
        hero_line_1: String(formData.get("hero_line_1") ?? ""),
        hero_line_2: String(formData.get("hero_line_2") ?? ""),
        name: String(formData.get("name") ?? ""),
        credential: String(formData.get("credential") ?? ""),
        subtext: String(formData.get("subtext") ?? ""),
        hero_roles: heroRoles,
        about_heading: String(formData.get("about_heading") ?? ""),
        about_subheading: String(formData.get("about_subheading") ?? ""),
        about_paragraphs: paragraphs,
        about_image_url: String(formData.get("about_image_url") ?? ""),
        about_image_alt: String(formData.get("about_image_alt") ?? ""),
        location: String(formData.get("location") ?? ""),
        timezone: String(formData.get("timezone") ?? ""),
        updated_at: new Date().toISOString(),
      })
      .eq("id", "main");

    if (error) return { ok: false, message: error.message };

    revalidatePortfolio();
    return { ok: true, message: "About section saved." };
  } catch {
    return { ok: false, message: "Unauthorized" };
  }
}

export async function saveSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();

    const { error } = await supabase
      .from("site_settings")
      .update({
        meta_title: String(formData.get("meta_title") ?? ""),
        meta_description: String(formData.get("meta_description") ?? ""),
        og_url: String(formData.get("og_url") ?? ""),
        resume_url: String(formData.get("resume_url") ?? ""),
        resume_label: String(formData.get("resume_label") ?? ""),
        updated_at: new Date().toISOString(),
      })
      .eq("id", "main");

    if (error) return { ok: false, message: error.message };

    revalidatePortfolio();
    return { ok: true, message: "Settings saved." };
  } catch {
    return { ok: false, message: "Unauthorized" };
  }
}

export async function saveProject(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();

    const id = String(formData.get("id") ?? "");
    const tags = String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id,
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      description: String(formData.get("description") ?? ""),
      tags,
      href: String(formData.get("href") ?? "") || null,
      github: String(formData.get("github") ?? "") || null,
      category: String(formData.get("category") ?? "dev") as "dev" | "design",
      accent: String(formData.get("accent") ?? "#3B82F6"),
      image_url: String(formData.get("image_url") ?? "") || null,
      featured: formData.get("featured") === "on",
      spotlight: formData.get("spotlight") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("projects").upsert(payload);

    if (error) return { ok: false, message: error.message };

    revalidatePortfolio();
    return { ok: true, message: "Project saved." };
  } catch {
    return { ok: false, message: "Unauthorized" };
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) revalidatePortfolio();
  } catch {
    // Unauthorized or failed delete
  }
}

export async function saveTimelineEntry(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();

    const id = String(formData.get("id") ?? "");
    const payload = {
      id,
      type: String(formData.get("type") ?? "work") as "work" | "education",
      title: String(formData.get("title") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      location: String(formData.get("location") ?? "") || null,
      start_date: String(formData.get("start_date") ?? ""),
      end_date: String(formData.get("end_date") ?? ""),
      description: String(formData.get("description") ?? ""),
      accent: String(formData.get("accent") ?? "#3B82F6"),
      image_url: String(formData.get("image_url") ?? ""),
      image_alt: String(formData.get("image_alt") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("timeline_entries").upsert(payload);

    if (error) return { ok: false, message: error.message };

    revalidatePortfolio();
    return { ok: true, message: "Timeline entry saved." };
  } catch {
    return { ok: false, message: "Unauthorized" };
  }
}

export async function deleteTimelineEntry(id: string): Promise<void> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("timeline_entries").delete().eq("id", id);
    if (!error) revalidatePortfolio();
  } catch {
    // Unauthorized or failed delete
  }
}

export async function saveSkillCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();

    const { error } = await supabase.from("skill_categories").upsert({
      id: String(formData.get("id") ?? ""),
      title: String(formData.get("title") ?? ""),
      accent: String(formData.get("accent") ?? "#3B82F6"),
      sort_order: Number(formData.get("sort_order") ?? 0),
      updated_at: new Date().toISOString(),
    });

    if (error) return { ok: false, message: error.message };

    revalidatePortfolio();
    return { ok: true, message: "Category saved." };
  } catch {
    return { ok: false, message: "Unauthorized" };
  }
}

export async function saveSkill(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();

    const skillId = String(formData.get("skill_id") ?? "");
    const payload = {
      category_id: String(formData.get("category_id") ?? ""),
      name: String(formData.get("name") ?? ""),
      icon: String(formData.get("icon") ?? ""),
      accent: String(formData.get("accent") ?? "#3B82F6"),
      sort_order: Number(formData.get("sort_order") ?? 0),
      updated_at: new Date().toISOString(),
    };

    const { error } = skillId
      ? await supabase.from("skills").update(payload).eq("id", skillId)
      : await supabase.from("skills").insert(payload);

    if (error) return { ok: false, message: error.message };

    revalidatePortfolio();
    return { ok: true, message: "Skill saved." };
  } catch {
    return { ok: false, message: "Unauthorized" };
  }
}

export async function deleteSkill(id: string): Promise<void> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (!error) revalidatePortfolio();
  } catch {
    // Unauthorized or failed delete
  }
}

export async function saveSocialLink(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();

    const linkId = String(formData.get("link_id") ?? "");
    const payload = {
      label: String(formData.get("label") ?? ""),
      href: String(formData.get("href") ?? ""),
      icon: String(formData.get("icon") ?? "github") as SocialLinkIcon,
      sort_order: Number(formData.get("sort_order") ?? 0),
      updated_at: new Date().toISOString(),
    };

    const { error } = linkId
      ? await supabase.from("social_links").update(payload).eq("id", linkId)
      : await supabase.from("social_links").insert(payload);

    if (error) return { ok: false, message: error.message };

    revalidatePortfolio();
    return { ok: true, message: "Social link saved." };
  } catch {
    return { ok: false, message: "Unauthorized" };
  }
}

export async function deleteSocialLink(id: string): Promise<void> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (!error) revalidatePortfolio();
  } catch {
    // Unauthorized or failed delete
  }
}
