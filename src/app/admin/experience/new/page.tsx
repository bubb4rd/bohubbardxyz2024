import { getTimelineEntries } from "@/lib/content/get-content";
import { TimelineForm } from "@/components/admin/TimelineForm";

export default async function NewTimelinePage() {
  const entries = await getTimelineEntries();
  return <TimelineForm sortOrder={entries.length} />;
}
