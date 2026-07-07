import { getContactContent } from "@/lib/content/get-content";
import { ContactEditor } from "@/components/admin/ContactEditor";

export default async function AdminContactPage() {
  const { socialLinks } = await getContactContent();
  return <ContactEditor socialLinks={socialLinks} />;
}
