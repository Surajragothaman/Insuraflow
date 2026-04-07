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
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-[1400px] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Insura<span className="text-primary">Flow</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Insurance Operations Automation Platform
              </p>
            </div>

            {/* Stats & User */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 shadow-sm transition-colors hover:border-primary/20">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-medium uppercase leading-none tracking-wider text-muted-foreground">Open</span>
                  <span className="font-mono text-sm font-semibold leading-tight tabular-nums text-foreground">{totalOpen}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 shadow-sm transition-colors hover:border-primary/20">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-medium uppercase leading-none tracking-wider text-muted-foreground">Workflows</span>
                  <span className="font-mono text-sm font-semibold leading-tight tabular-nums text-foreground">{totalWorkflows}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-background py-1 pl-1 pr-3 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground ring-2 ring-primary/10">
                  DF
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="text-sm font-medium leading-tight text-foreground">Demo User</span>
                  <span className="text-[10px] leading-none text-muted-foreground">Operator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Process Categories</h2>
          <p className="text-sm text-muted-foreground">{categories.length} categories across insurance operations</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category);
            const Icon = category.icon;
            const isSingleApp = category.apps.length === 1;
            const href = isSingleApp
              ? `/${category.slug}/${category.apps[0].slug}/intake`
              : `/${category.slug}`;

            return (
              <Link key={category.slug} href={href} className="block h-full">
                <Card className="group relative flex h-full cursor-pointer flex-col border border-border/60 bg-card shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                  <CardContent className="flex flex-1 flex-col p-4">
                    {/* Icon & Badge */}
                    <div className="relative mb-3 self-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                        <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                      </div>
                      {stats.openItems > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                          {stats.openItems}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground">
                      {category.name}
                    </h3>

                    {/* Workflow Pills */}
                    <div className="mt-2.5 flex flex-1 flex-wrap content-start gap-1.5">
                      {category.apps.map((app) => (
                        <span
                          key={app.slug}
                          className="inline-flex items-center rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5"
                        >
                          {app.name}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {category.apps.length} workflow{category.apps.length !== 1 ? "s" : ""}
                        </span>
                        {stats.pausedItems > 0 && (
                          <span className="font-mono text-[11px] font-medium text-amber-600">
                            {stats.pausedItems} paused
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
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
