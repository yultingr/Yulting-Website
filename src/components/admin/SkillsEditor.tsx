"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { getSkillsList, addSkillCategory, deleteSkillCategory, updateSkillCategory } from "@/lib/actions";
import type { SkillCategory } from "@/types";

export function SkillsEditor() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editSkills, setEditSkills] = useState("");
  const [addState, addFormAction, addPending] = useActionState(addSkillCategory, null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getSkillsList().then((s) => { setCategories(s); setMounted(true); });
  }, []);

  useEffect(() => {
    if (addState === null && mounted) {
      getSkillsList().then(setCategories);
    }
  }, [addState, mounted]);

  function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    startTransition(async () => {
      await deleteSkillCategory(id);
      setCategories(await getSkillsList());
    });
  }

  function handleUpdate(id: string) {
    startTransition(async () => {
      await updateSkillCategory(id, {
        skills: editSkills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setEditing(null);
      setCategories(await getSkillsList());
    });
  }

  if (!mounted) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      <form action={addFormAction} className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Add Skill Category</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Category Name</label>
            <input name="name" type="text" placeholder="e.g. Languages" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Skills (comma-separated)</label>
            <input name="skills" type="text" placeholder="Skill 1, Skill 2" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
        </div>
        {addState?.error && <p className="mt-2 text-sm text-red-500">{addState.error}</p>}
        <button type="submit" disabled={addPending} className="mt-4 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
          {addPending ? "Adding..." : "Add Category"}
        </button>
      </form>

      <h3 className="mb-4 text-lg font-semibold text-foreground">Skill Categories ({categories.length})</h3>
      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No categories yet.</div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-card-foreground">{cat.name}</p>
                  {editing === cat.id ? (
                    <div className="mt-2 flex gap-2">
                      <input value={editSkills} onChange={(e) => setEditSkills(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none" placeholder="Skill 1, Skill 2" />
                      <button onClick={() => handleUpdate(cat.id)} className="rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background">Save</button>
                      <button onClick={() => setEditing(null)} className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground">Cancel</button>
                    </div>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {cat.skills.map((s) => (
                        <span key={s} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(cat.id); setEditSkills(cat.skills.join(", ")); }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
