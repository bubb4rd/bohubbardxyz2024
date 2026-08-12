"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const LOCATION = "Chicago, IL";
const TIME_ZONE = "America/Chicago";

function formatCentralTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function AboutLocationBlurb() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatCentralTime(new Date()));
    update();

    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <li>
      <span className="about-blurb-tag inline-flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3 py-2 shadow-[0_8px_24px_rgba(24,24,27,0.04)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
          <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="pr-1 text-sm font-medium text-foreground tabular-nums">
          {LOCATION} ({time ? `${time} CT` : "—:— CT"})
        </span>
      </span>
    </li>
  );
}
