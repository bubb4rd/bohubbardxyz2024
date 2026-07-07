import { getSiteSettings } from "@/lib/content/get-content";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsForm settings={settings} />;
}
