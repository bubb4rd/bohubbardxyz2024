import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getTimelineEntries } from "@/lib/content/get-content";
import { deleteTimelineEntry } from "@/lib/admin/actions";

export default async function AdminExperiencePage() {
  const entries = await getTimelineEntries();

  return (
    <AdminShell title="Experience">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-400">
          {entries.length} timeline entr{entries.length === 1 ? "y" : "ies"}
        </p>
        <Link href="/admin/experience/new" className="admin-button">
          New entry
        </Link>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="admin-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-medium text-white">{entry.title}</h2>
              <p className="text-sm text-zinc-400">
                {entry.organization} · {entry.start} – {entry.end}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/experience/${entry.id}`}
                className="admin-button-secondary"
              >
                Edit
              </Link>
              <form action={deleteTimelineEntry.bind(null, entry.id)}>
                <button type="submit" className="admin-button-secondary text-red-300">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
