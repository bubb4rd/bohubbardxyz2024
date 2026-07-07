import { getSiteSettings } from "@/lib/content/get-content";
import { AboutForm } from "@/components/admin/AboutForm";

export default async function AdminAboutPage() {
  const settings = await getSiteSettings();
  return <AboutForm settings={settings} />;
}
