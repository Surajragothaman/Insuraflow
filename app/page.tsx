"use client";

import Link from "next/link";
import { categories, getCategoryStats } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Activity, Layers } from "lucide-react";

export default function LandingPage() {
  const totalOpen = categories.reduce((sum, c) => sum + getCategoryStats(c).openItems, 0);
  const totalWorkflows = categories.reduce((sum, c) => sum + c.apps.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary-foreground"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  InsuraFlow
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Operations Automation
                </p>
              </div>
            </div>

            {/* Stats & User */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Stats - Desktop */}
              <div className="hidden sm:flex items-center gap-6 pr-4 border-r border-border">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Open</span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">{totalOpen}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Workflows</span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">{totalWorkflows}</span>
                  </div>
                </div>
              </div>

              {/* Stats - Mobile */}
              <div className="flex sm:hidden items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">{totalOpen}</span>
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{totalWorkflows}</span>
                </span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  DF
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-foreground">Demo User</span>
                  <span className="text-xs text-muted-foreground">Operator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Process Categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categories across insurance operations
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {categories.map((category) => {
            const stats = getCategoryStats(category);
            const Icon = category.icon;
            const isSingleApp = category.apps.length === 1;
            const href = isSingleApp
              ? `/${category.slug}/${category.apps[0].slug}/intake`
              : `/${category.slug}`;

            return (
              <Link key={category.slug} href={href} className="block">
                <Card className="group relative h-full flex flex-col border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                  <CardContent className="flex flex-1 flex-col p-5">
                    {/* Header: Icon + Title */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                          <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                        </div>
                        {stats.openItems > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground ring-2 ring-card">
                            {stats.openItems}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground leading-tight">
                          {category.name}
                        </h3>
                      </div>
                    </div>

                    {/* Workflow Tags */}
                    <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                      {category.apps.map((app) => (
                        <span
                          key={app.slug}
                          className="inline-flex h-fit items-center rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                        >
                          {app.name}
                        </span>
                      ))}
                    </div>

                    {/* Footer - pushed to bottom via mt-auto */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{category.apps.length} workflow{category.apps.length !== 1 ? "s" : ""}</span>
                        {stats.pausedItems > 0 && (
                          <span className="text-amber-600">{stats.pausedItems} paused</span>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
