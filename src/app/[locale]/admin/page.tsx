"use client";

import {
  useState,
  useEffect,
  useActionState,
  useTransition,
  useRef,
  useCallback,
} from "react";
import { Container } from "@/components/layout/Container";
import { login, logout, isAuthenticated } from "@/lib/actions";
import { VideoManager } from "@/components/admin/VideoManager";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { ContactSubmissions } from "@/components/admin/ContactSubmissions";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AuditLog } from "@/components/admin/AuditLog";

const tabs = [
  { id: "videos", label: "Videos", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { id: "blog", label: "Blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { id: "projects", label: "Projects", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
  { id: "skills", label: "Skills", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { id: "messages", label: "Messages", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { id: "analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "audit", label: "Audit Log", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState(login, null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Admin Panel</span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Sign In</h1>
            <p className="mt-3 text-muted-foreground">Enter your password to access the admin panel.</p>
          </div>
          <form action={formAction} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-card-foreground">Password</label>
            <input id="password" name="password" type="password" autoFocus required placeholder="Enter admin password..." className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
            {state?.error && <p className="mt-3 text-sm text-red-500">{state.error}</p>}
            <button type="submit" disabled={pending} className="mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>("videos");
  const [, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
      onLogout();
    });
  }

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Admin Panel</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            Sign Out
          </button>
        </div>

        <div className="mb-8 -mx-1 flex gap-1 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "videos" && <VideoManager />}
          {activeTab === "blog" && <BlogEditor />}
          {activeTab === "projects" && <ProjectManager />}
          {activeTab === "skills" && <SkillsEditor />}
          {activeTab === "messages" && <ContactSubmissions />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "audit" && <AuditLog />}
        </div>
      </Container>
    </section>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setAuthed);
  }, []);

  if (authed === null) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center text-muted-foreground">Loading...</div>
        </Container>
      </section>
    );
  }

  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
