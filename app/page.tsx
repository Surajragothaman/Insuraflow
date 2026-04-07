"use client";

import Link from "next/link";
import { categories, getCategoryStats } from "@/lib/mock-data";
import { ArrowRight, Activity, Layers } from "lucide-react";

export default function LandingPage() {
  const totalOpen = categories.reduce((sum, c) => sum + getCategoryStats(c).openItems, 0);
  const totalApps = categories.reduce((sum, c) => sum + c.apps.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/80 bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Insura<span className="text-primary">Flow</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Insurance Operations Automation Platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Stats pills */}
              <div className="flex items-center gap-2.5 rounded-full border border-border/80 bg-card px-4 py-2 shadow-sm transition-colors hover:border-primary/20">
                <Activity className="h-4 w-4 text-primary" />
                <div className="flex flex-col -space-y-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Open</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{totalOpen}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-full border border-border/80 bg-card px-4 py-2 shadow-sm transition-colors hover:border-primary/20">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col -space-y-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Workflows</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{totalApps}</span>
                </div>
              </div>
              {/* User profile pill */}
              <div className="flex items-center gap-3 rounded-full border border-border/80 bg-card py-1.5 pl-1.5 pr-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-primary/10">
                  DF
                </div>
                <div className="hidden sm:flex flex-col -space-y-0.5">
                  <span className="text-sm font-medium text-foreground">Demo User</span>
                  <span className="text-[11px] text-muted-foreground">Operator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Grid */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Process Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} categories across insurance operations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category);
            const Icon = category.icon;
            const isSingleApp = category.apps.length === 1;
            const href = isSingleApp
              ? `/${category.slug}/${category.apps[0].slug}/intake`
              : `/${category.slug}`;

            return (
              <Link key={category.slug} href={href}>
                <div className="group relative flex h-full cursor-pointer flex-col rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  {/* Icon + count badge */}
                  <div className="relative mb-4 self-start">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                    </div>
                    {stats.openItems > 0 && (
                      <div className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                        {stats.openItems}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-semibold leading-snug tracking-tight">
                    {category.name}
                  </h3>

                  {/* App pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5 flex-1">
                    {category.apps.map((app) => (
                      <span
                        key={app.slug}
                        className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5"
                      >
                        {app.name}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {category.apps.length} workflow{category.apps.length > 1 ? "s" : ""}
                      </span>
                      {stats.pausedItems > 0 && (
                        <span className="font-mono text-xs font-medium text-amber-600">
                          {stats.pausedItems} paused
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
