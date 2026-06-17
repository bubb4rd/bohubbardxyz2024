"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

export function DesktopSidebar() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(desktop.matches);

    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);

  if (!isDesktop) return null;

  return <Sidebar />;
}
