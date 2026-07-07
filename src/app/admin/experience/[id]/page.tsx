import { notFound } from "next/navigation";
import { getTimelineEntries } from "@/lib/content/get-content";
import { TimelineForm } from "@/components/admin/TimelineForm";

export default async function EditTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entries = await getTimelineEntries();
  const index = entries.findIndex((entry) => entry.id === id);
  const entry = entries[index];

  if (!entry) notFound();

  return <TimelineForm entry={entry} sortOrder={index} />;
}
