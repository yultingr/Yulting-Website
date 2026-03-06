"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { getProjectsList, addProject, deleteProject } from "@/lib/actions";
import type { Project } from "@/types";

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);
  const [addState, addFormAction, addPending] = useActionState(addProject, null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getProjectsList().then((p) => { setProjects(p); setMounted(true); });
  }, []);

  useEffect(() => {
    if (addState === null && mounted) {
      getProjectsList().then(setProjects);
    }
  }, [addState, mounted]);

  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    startTransition(async () => {
      await deleteProject(id);
      setProjects(await getProjectsList());
    });
  }

  if (!mounted) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      <form action={addFormAction} className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Add New Project</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Title</label>
            <input name="title" type="text" placeholder="Project name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Year</label>
            <input name="year" type="number" defaultValue={new Date().getFullYear()} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-card-foreground">Description</label>
            <textarea name="description" rows={3} placeholder="Project description..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Technologies (comma-separated)</label>
            <input name="technologies" type="text" placeholder="Next.js, TypeScript" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Live URL</label>
            <input name="liveUrl" type="text" placeholder="https://..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">GitHub URL</label>
            <input name="githubUrl" type="text" placeholder="https://github.com/..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-card-foreground">
              <input name="featured" type="checkbox" className="rounded" />
              Featured
            </label>
          </div>
        </div>
        {addState?.error && <p className="mt-2 text-sm text-red-500">{addState.error}</p>}
        <button type="submit" disabled={addPending} className="mt-4 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
          {addPending ? "Adding..." : "Add Project"}
        </button>
      </form>

      <h3 className="mb-4 text-lg font-semibold text-foreground">Projects ({projects.length})</h3>
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No projects yet.</div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-card-foreground">{project.title}</p>
                  {project.featured && <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">Featured</span>}
                </div>
                <p className="truncate text-xs text-muted-foreground">{project.description}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {project.technologies.map((t) => (
                    <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(project.id)} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" title="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
