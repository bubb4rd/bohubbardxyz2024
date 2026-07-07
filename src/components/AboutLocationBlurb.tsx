"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

function formatLocalTime(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getTimezoneAbbreviation(timezone: string) {
  if (timezone === "America/Chicago") return "CT";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((part) => part.type === "timeZoneName")?.value ?? "local";
  } catch {
    return "local";
  }
}

export function AboutLocationBlurb({
  location,
  timezone,
}: {
  location: string;
  timezone: string;
}) {
  const [time, setTime] = useState<string | null>(null);
  const tzAbbr = getTimezoneAbbreviation(timezone);

  useEffect(() => {
    const update = () => setTime(formatLocalTime(new Date(), timezone));
    update();

    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, [timezone]);

  return (
    <li>
      <span className="about-blurb-tag inline-flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3 py-2 shadow-[0_8px_24px_rgba(24,24,27,0.04)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
          <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="pr-1 text-sm font-medium text-foreground tabular-nums">
          {location} ({time ? `${time} ${tzAbbr}` : `—:— ${tzAbbr}`})
        </span>
      </span>
    </li>
  );
}
