"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryStats, generateMockTasks } from "@/lib/mock-data";
import { ArrowLeft, ArrowRight, Cpu, Globe } from "lucide-react";

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
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-[-0.025em]">{category.name}</h1>
              <p className="text-xs tracking-[-0.01em] text-muted-foreground">
                {category.apps.length} workflows &middot;{" "}
                <span className="font-mono">{stats.openItems}</span> open items
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Apps grid — full width, no sidebar */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.apps.map((app) => {
            const tasks = generateMockTasks(app.slug, 8);
            const intakeCount = tasks.filter((t) => t.stage === "intake").length;
            const actionsCount = tasks.filter((t) => t.stage === "actions").length;
            const doneCount = tasks.filter((t) => t.stage === "done").length;

            return (
              <Link key={app.slug} href={`/${slug}/${app.slug}/intake`}>
                <div className="group flex h-full cursor-pointer flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                  {/* Title + badge */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold tracking-[-0.025em]">{app.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        app.approach === "Hybrid"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {app.approach}
                    </span>
                  </div>
                  <p className="text-xs tracking-[-0.01em] text-muted-foreground mb-3">
                    {app.description}
                  </p>

                  {/* Stage pipeline */}
                  <div className="flex gap-3 text-[10px] mb-3">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span className="text-muted-foreground">Intake</span>
                      <span className="font-mono font-semibold">{intakeCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="text-muted-foreground">Actions</span>
                      <span className="font-mono font-semibold">{actionsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-muted-foreground">Done</span>
                      <span className="font-mono font-semibold">{doneCount}</span>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="flex items-start gap-1.5 mb-2">
                    <Globe className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {app.platforms.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[8px] font-medium text-muted-foreground"
                        >
                          {p}
                        </span>
                      ))}
                      {app.platforms.length > 3 && (
                        <span className="text-[8px] text-muted-foreground">
                          +{app.platforms.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <Cpu className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {app.processSteps.length} steps
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-mono">
                      {app.sopSources.length} SOP{app.sopSources.length > 1 ? "s" : ""}
                    </span>
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
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
