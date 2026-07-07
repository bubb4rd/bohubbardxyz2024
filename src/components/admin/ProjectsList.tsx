"use client";

import {
  useCallback,
  useMemo,
  useState,
  useTransition,
  type DragEvent,
} from "react";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { deleteProject, reorderProjects } from "@/lib/admin/actions";
import type { Project } from "@/lib/content/types";

function reorderIds(ids: string[], from: number, to: number) {
  const next = [...ids];
  const [id] = next.splice(from, 1);
  next.splice(to, 0, id);
  return next;
}

export function ProjectsList({ projects: initialProjects }: { projects: Project[] }) {
  const [localOrder, setLocalOrder] = useState<string[] | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const projects = useMemo(() => {
    const byId = new Map(initialProjects.map((project) => [project.id, project]));
    const ids =
      localOrder ?? initialProjects.map((project) => project.id);
    return ids
      .map((id) => byId.get(id))
      .filter((project): project is Project => Boolean(project));
  }, [initialProjects, localOrder]);

  const persistOrder = useCallback((orderedIds: string[], fallback: string[]) => {
    startTransition(async () => {
      const result = await reorderProjects(orderedIds);
      if (result.ok) {
        setLocalOrder(null);
        setStatus({ ok: true, message: result.message });
      } else {
        setLocalOrder(fallback);
        setStatus({ ok: false, message: result.message });
      }
    });
  }, []);

  const moveProject = useCallback(
    (from: number, to: number) => {
      if (from === to || to < 0 || to >= projects.length) return;

      const currentIds = projects.map((project) => project.id);
      const fallback = localOrder ?? currentIds;
      const nextIds = reorderIds(currentIds, from, to);
      setLocalOrder(nextIds);
      persistOrder(nextIds, fallback);
    },
    [localOrder, persistOrder, projects],
  );

  const resetDrag = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", projects[index]?.id ?? "");
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragIndex !== null && index !== dragIndex) {
      setOverIndex(index);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, dropIndex: number) => {
    event.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      resetDrag();
      return;
    }

    moveProject(dragIndex, dropIndex);
    resetDrag();
  };

  return (
    <div className="space-y-3">
      {status ? (
        <p
          className={`text-sm ${status.ok ? "text-emerald-400" : "text-red-400"}`}
          role="status"
        >
          {status.message}
        </p>
      ) : null}

      {isPending ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Saving order…
        </p>
      ) : null}

      {projects.map((project, index) => {
        const isDragging = dragIndex === index;
        const isDropTarget = overIndex === index && dragIndex !== index;

        return (
          <div
            key={project.id}
            onDragOver={(event) => handleDragOver(event, index)}
            onDrop={(event) => handleDrop(event, index)}
            onDragLeave={() => {
              if (overIndex === index) setOverIndex(null);
            }}
            className={`relative overflow-hidden rounded-2xl border border-zinc-700/60 ${
              isDragging ? "opacity-50" : ""
            } ${isDropTarget ? "ring-2 ring-sky-400/80" : ""}`}
          >
            {project.image ? (
              <div
                aria-hidden
                className="absolute -inset-6 scale-105 bg-cover bg-center blur-2xl brightness-90 saturate-125"
                style={{ backgroundImage: `url("${project.image}")` }}
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${project.accent}66 0%, #18181b 100%)`,
                }}
              />
            )}

            <div aria-hidden className="absolute inset-0 bg-zinc-950/55" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(115deg, ${project.accent}40 0%, rgba(9, 9, 11, 0.82) 52%, rgba(9, 9, 11, 0.94) 100%)`,
              }}
            />

            <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex shrink-0 pt-0.5">
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => handleDragStart(event, index)}
                    onDragEnd={resetDrag}
                    className="cursor-grab touch-none rounded-md p-2 text-zinc-200/80 hover:bg-white/10 hover:text-white active:cursor-grabbing"
                    aria-label={`Drag to reorder ${project.title}`}
                  >
                    <GripVertical className="h-6 w-6" strokeWidth={2} />
                  </button>
                </div>

                <div className="min-w-0">
                  <h2 className="font-medium text-white drop-shadow-sm">
                    {project.title}
                  </h2>
                  <p className="text-sm text-zinc-200/85 drop-shadow-sm">
                    {project.subtitle} · {project.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:shrink-0">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="admin-button-secondary border-white/15 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40"
                >
                  Edit
                </Link>
                <form action={deleteProject.bind(null, project.id)}>
                  <button
                    type="submit"
                    className="admin-button-secondary border-white/15 bg-black/25 text-red-200 backdrop-blur-sm hover:bg-black/40"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
