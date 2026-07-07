"use client";

import { useEffect, useRef } from "react";
import type { ActionResult } from "@/lib/admin/auth";

export function FormStatus({ result }: { result: ActionResult | null }) {
  if (!result) return null;

  return (
    <p
      className={`text-sm ${result.ok ? "text-emerald-400" : "text-red-400"}`}
      role="status"
    >
      {result.message}
    </p>
  );
}

export function useFormStatus(result: ActionResult | null) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result]);

  return ref;
}
