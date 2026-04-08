"use client";

import Link from "next/link";
import { categories, getCategoryStats } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Activity, Layers, LayoutGrid, GitBranch, PauseCircle } from "lucide-react";

export default function LandingPage() {
  const totalOpen = categories.reduce((sum, c) => sum + getCategoryStats(c).openItems, 0);
  const totalPaused = categories.reduce((sum, c) => sum + getCategoryStats(c).pausedItems, 0);
  const totalWorkflows = categories.reduce((sum, c) => sum + c.apps.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand + View Toggle */}
            <div className="flex items-center gap-6">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Insura<span className="text-primary">Flow</span>
              </h1>
              
              {/* View toggle - underline tabs style */}
              <div className="hidden sm:flex items-center border-b-2 border-transparent -mb-[1px]">
                <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground border-b-2 border-primary -mb-[2px]">
                  <LayoutGrid className="h-4 w-4" />
                  Grid
                </div>
                <Link
                  href="/flow"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent -mb-[2px]"
                >
                  <GitBranch className="h-4 w-4" />
                  Flow
                </Link>
              </div>
            </div>

            {/* Stats & User */}
            <div className="flex items-center gap-4">
              {/* Stats - Desktop */}
              <div className="hidden md:flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold tabular-nums text-foreground">{totalOpen}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Open</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                    <PauseCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold tabular-nums text-foreground">{totalPaused}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Paused</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold tabular-nums text-foreground">{totalWorkflows}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Workflows</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block h-8 w-px bg-border" />

              {/* Mobile view toggle */}
              <div className="flex sm:hidden items-center rounded-lg border border-border bg-muted/50 p-0.5">
                <div className="flex items-center justify-center rounded-md bg-card p-1.5 shadow-sm">
                  <LayoutGrid className="h-4 w-4 text-foreground" />
                </div>
                <Link href="/flow" className="flex items-center justify-center rounded-md p-1.5">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  DF
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-medium text-foreground">Demo User</span>
                  <span className="text-[10px] text-muted-foreground">Operator</span>
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
                    {/* Header: Icon + Title + Arrow */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                            <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                          </div>
                          {stats.openItems > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground ring-2 ring-card">
                              {stats.openItems}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className="text-sm font-semibold text-foreground leading-tight">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary-foreground" />
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
                    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border text-xs text-muted-foreground">
                      <span>{category.apps.length} workflow{category.apps.length !== 1 ? "s" : ""}</span>
                      {stats.pausedItems > 0 && (
                        <span className="text-amber-600">{stats.pausedItems} paused</span>
                      )}
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
