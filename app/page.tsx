"use client";

import Link from "next/link";
import { categories, getCategoryStats } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { ViewToggle } from "@/components/layout/view-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />
      
      {/* View Toggle with Title */}
      <ViewToggle 
        title="Process Categories" 
        subtitle={`${categories.length} categories across insurance operations`} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
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
        </div>
      </main>
    </div>
  );
}
