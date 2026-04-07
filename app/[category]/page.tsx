"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryStats, generateMockTasks } from "@/lib/mock-data";
import { ArrowRight, Cpu, Globe, LayoutGrid } from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = use(params);
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  if (category.apps.length === 1) {
    return (
      <meta
        httpEquiv="refresh"
        content={`0; url=/${slug}/${category.apps[0].slug}/intake`}
      />
    );
  }

  const Icon = category.icon;
  const stats = getCategoryStats(category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo + Category */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
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
                <span className="text-lg font-semibold tracking-tight text-foreground">InsuraFlow</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-foreground">{category.name}</h1>
                  <p className="text-xs text-muted-foreground">
                    {category.apps.length} workflows &middot; {stats.openItems} open
                  </p>
                </div>
              </div>
            </div>

            {/* All Workflows Link */}
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">All Workflows</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Apps grid */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Select a Workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a workflow to view and manage tasks
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.apps.map((app) => {
            const tasks = generateMockTasks(app.slug, 8);
            const intakeCount = tasks.filter((t) => t.stage === "intake").length;
            const actionsCount = tasks.filter((t) => t.stage === "actions").length;
            const doneCount = tasks.filter((t) => t.stage === "done").length;

            return (
              <Link key={app.slug} href={`/${slug}/${app.slug}/intake`} className="block h-full">
                <div className="group h-full flex flex-col rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                  <div className="flex flex-col p-5">
                    {/* Header: Title + Arrow */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{app.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{app.description}</p>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary transition-all group-hover:bg-primary">
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary-foreground" />
                      </div>
                    </div>

                    {/* Approach badge */}
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          app.approach === "Hybrid"
                            ? "bg-sky-50 text-sky-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {app.approach}
                      </span>
                    </div>
                  </div>

                  {/* Stage pipeline */}
                  <div className="flex flex-wrap gap-2 px-5 pb-4">
                    <div className="flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span className="text-[11px] text-sky-700">Intake</span>
                      <span className="text-[11px] font-semibold text-sky-900">{intakeCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-[11px] text-amber-700">Actions</span>
                      <span className="text-[11px] font-semibold text-amber-900">{actionsCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-emerald-700">Done</span>
                      <span className="text-[11px] font-semibold text-emerald-900">{doneCount}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between px-5 py-3 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>{app.processSteps.length} steps</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{app.platforms.length} platforms</span>
                    </div>
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
