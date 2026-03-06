"use client";

import { useState, useEffect } from "react";
import { getAnalyticsSummary } from "@/lib/actions";
import type { AnalyticsSummary } from "@/types";

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getAnalyticsSummary().then((d) => { setData(d); setMounted(true); });
  }, []);

  if (!mounted || !data) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  const maxDayViews = Math.max(...data.viewsByDay.map((d) => d.views), 1);

  return (
    <div>
      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Views (30d)</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{data.totalViews}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Unique Pages</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{data.uniquePaths}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Avg. Daily Views</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {data.viewsByDay.length > 0 ? Math.round(data.totalViews / data.viewsByDay.length) : 0}
          </p>
        </div>
      </div>

      {/* Daily Chart */}
      {data.viewsByDay.length > 0 && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Views Per Day</h3>
          <div className="flex items-end gap-1" style={{ height: 120 }}>
            {data.viewsByDay.map((day) => (
              <div key={day.date} className="group relative flex-1" title={`${day.date}: ${day.views} views`}>
                <div
                  className="w-full rounded-t bg-accent/70 transition-colors group-hover:bg-accent"
                  style={{ height: `${(day.views / maxDayViews) * 100}%`, minHeight: 2 }}
                />
                <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background group-hover:block">
                  {day.views}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{data.viewsByDay[0]?.date.slice(5)}</span>
            <span>{data.viewsByDay[data.viewsByDay.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      )}

      {/* Top Pages */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Top Pages</h3>
        {data.topPages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet. Page views will appear here once visitors start browsing.</p>
        ) : (
          <div className="space-y-2">
            {data.topPages.map((page) => (
              <div key={page.path} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm text-foreground">{page.path}</p>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent/60" style={{ width: `${(page.views / data.topPages[0].views) * 100}%` }} />
                  </div>
                </div>
                <span className="shrink-0 text-sm font-medium text-muted-foreground">{page.views}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
