"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, getCategoryStats, generateMockTasks } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Activity,
  LayoutGrid,
  GitBranch,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

// ─── Flow phases from wiki ───────────────────────────────────────

interface FlowNode {
  slug: string;
  daysBefore?: number; // for renewal countdown
}

interface FlowPhase {
  id: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  type: "pipeline" | "grid" | "countdown" | "exception";
  nodes: FlowNode[];
  transitionLabel?: string; // label on the arrow to next phase
}

const phases: FlowPhase[] = [
  {
    id: "new-business",
    label: "New Business Pipeline",
    description: "Sequential — each step gates the next",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-500",
    type: "pipeline",
    nodes: [
      { slug: "prospecting" },
      { slug: "quoting" },
      { slug: "application" },
      { slug: "binding" },
      { slug: "policy-setup" },
      { slug: "policy-checking" },
    ],
    transitionLabel: "Policy active & issued",
  },
  {
    id: "servicing",
    label: "Active Policy Servicing",
    description: "Parallel — triggered by requests while policy is active",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-500",
    type: "grid",
    nodes: [
      { slug: "certificates" },
      { slug: "endorsements" },
      { slug: "carrier-downloads" },
      { slug: "invoicing" },
      { slug: "payment" },
    ],
    transitionLabel: "Approaching expiration",
  },
  {
    id: "exceptions",
    label: "Exceptions",
    description: "Cancellation branch — reinstatement loops back to active",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    dotColor: "bg-red-500",
    type: "exception",
    nodes: [
      { slug: "cancellation" },
      { slug: "reinstatements" },
    ],
  },
  {
    id: "renewal",
    label: "Renewal Countdown",
    description: "Timed sequence — starts 175 days before policy expiration",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-500",
    type: "countdown",
    nodes: [
      { slug: "loss-runs", daysBefore: 175 },
      { slug: "renewal-marketing", daysBefore: 150 },
      { slug: "renewal-processing", daysBefore: 30 },
      { slug: "renewal-proposal", daysBefore: 15 },
      { slug: "renewal-certificates", daysBefore: 0 },
    ],
    transitionLabel: "Renewed — lifecycle repeats",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

function getCat(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// ─── Component ───────────────────────────────────────────────────

export default function FlowPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const totalOpen = categories.reduce((sum, c) => sum + getCategoryStats(c).openItems, 0);

  const selectedCategory = selectedNode ? getCat(selectedNode) : null;
  const selectedTasks = selectedCategory
    ? selectedCategory.apps.flatMap((app) => generateMockTasks(app.slug, 6))
    : [];
  const intakeCount = selectedTasks.filter((t) => t.stage === "intake").length;
  const actionsCount = selectedTasks.filter((t) => t.stage === "actions").length;
  const outputCount = selectedTasks.filter((t) => t.status === "approved").length;
  const pausedCount = selectedTasks.filter((t) => t.status === "paused").length;
  const failedCount = selectedTasks.filter((t) => t.status === "failed").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header — same as landing page */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Insura<span className="text-primary">Flow</span>
            </h1>

            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Grid
                </Link>
                <div className="flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
                  <GitBranch className="h-3.5 w-3.5" />
                  Flow
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 shadow-sm">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-medium uppercase leading-none tracking-wider text-muted-foreground">Open</span>
                  <span className="font-mono text-sm font-semibold leading-tight tabular-nums">{totalOpen}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-background py-1 pl-1 pr-3 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  DF
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="text-sm font-medium leading-tight">Demo User</span>
                  <span className="text-[10px] leading-none text-muted-foreground">Operator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex">
        {/* Flow area */}
        <div className={`flex-1 transition-all ${selectedNode ? "mr-[340px]" : ""}`}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-tight">Policy Lifecycle</h2>
              <p className="text-sm text-muted-foreground">
                Insurance operations flow — dependencies from SOPs
              </p>
            </div>

            {/* Phases */}
            <div className="space-y-4">
              {phases.map((phase, phaseIdx) => {
                const phaseCats = phase.nodes
                  .map((n) => getCat(n.slug))
                  .filter(Boolean) as typeof categories;
                const phaseOpen = phaseCats.reduce((sum, c) => sum + getCategoryStats(c).openItems, 0);

                return (
                  <div key={phase.id}>
                    {/* Phase card */}
                    <div className={`rounded-xl border ${phase.borderColor} ${phase.bgColor} p-4`}>
                      {/* Phase header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${phase.dotColor}`} />
                          <h3 className={`text-sm font-semibold ${phase.color}`}>{phase.label}</h3>
                          <span className="text-[10px] text-muted-foreground">— {phase.description}</span>
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">{phaseOpen} open</span>
                      </div>

                      {/* Pipeline layout (sequential with arrows) */}
                      {phase.type === "pipeline" && (
                        <div className="flex items-stretch gap-0 overflow-x-auto pb-1">
                          {phaseCats.map((cat, i) => (
                            <div key={cat.slug} className="flex items-center">
                              <FlowCard
                                cat={cat}
                                isSelected={selectedNode === cat.slug}
                                onClick={() => setSelectedNode(selectedNode === cat.slug ? null : cat.slug)}
                              />
                              {i < phaseCats.length - 1 && (
                                <div className="flex items-center px-1.5 shrink-0">
                                  <div className="w-4 h-px bg-border" />
                                  <ArrowRight className="h-3 w-3 text-muted-foreground/40 -ml-0.5" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Grid layout (parallel servicing) */}
                      {phase.type === "grid" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                          {phaseCats.map((cat) => (
                            <FlowCard
                              key={cat.slug}
                              cat={cat}
                              isSelected={selectedNode === cat.slug}
                              onClick={() => setSelectedNode(selectedNode === cat.slug ? null : cat.slug)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Exception layout (cancellation ↔ reinstatement) */}
                      {phase.type === "exception" && (
                        <div className="flex items-center gap-0">
                          {phaseCats.map((cat, i) => (
                            <div key={cat.slug} className="flex items-center">
                              <FlowCard
                                cat={cat}
                                isSelected={selectedNode === cat.slug}
                                onClick={() => setSelectedNode(selectedNode === cat.slug ? null : cat.slug)}
                              />
                              {i === 0 && (
                                <div className="flex flex-col items-center px-2 shrink-0">
                                  <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
                                  <span className="text-[8px] text-muted-foreground my-0.5">payment</span>
                                  <RotateCcw className="h-3 w-3 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>
                          ))}
                          <div className="flex items-center pl-3 shrink-0">
                            <div className="rounded-full border border-border/40 bg-card px-2.5 py-1">
                              <span className="text-[9px] text-muted-foreground">→ back to active</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Countdown layout (timed sequence with day markers) */}
                      {phase.type === "countdown" && (
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-amber-300/50" />

                          <div className="space-y-2">
                            {phase.nodes.map((node, i) => {
                              const cat = getCat(node.slug);
                              if (!cat) return null;
                              return (
                                <div key={node.slug} className="flex items-center gap-3">
                                  {/* Day marker */}
                                  <div className="w-[44px] text-right shrink-0">
                                    <span className="font-mono text-[11px] font-semibold text-amber-700">
                                      {node.daysBefore === 0 ? "0d" : `${node.daysBefore}d`}
                                    </span>
                                  </div>
                                  {/* Timeline dot */}
                                  <div className="relative z-10 flex h-4 w-4 items-center justify-center shrink-0">
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                                  </div>
                                  {/* Card */}
                                  <div className="flex-1">
                                    <FlowCard
                                      cat={cat}
                                      isSelected={selectedNode === cat.slug}
                                      onClick={() => setSelectedNode(selectedNode === cat.slug ? null : cat.slug)}
                                      compact
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phase transition arrow */}
                    {phase.transitionLabel && phaseIdx < phases.length - 1 && (
                      <div className="flex items-center justify-center py-2">
                        <div className="flex items-center gap-2">
                          <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
                          <span className="text-[10px] text-muted-foreground">{phase.transitionLabel}</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Lifecycle loop */}
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card px-4 py-1.5 shadow-sm">
                  <RotateCcw className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] text-muted-foreground">
                    Renewal completes → policy lifecycle repeats
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail sidebar */}
        {selectedCategory && (
          <div className="fixed right-0 top-[56px] bottom-0 w-[340px] border-l border-border bg-card overflow-auto z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-card">
              <div className="flex items-center gap-2 min-w-0">
                {(() => { const Icon = selectedCategory.icon; return <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />; })()}
                <h3 className="text-sm font-semibold tracking-tight truncate">{selectedCategory.name}</h3>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Pipeline counts */}
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Pipeline</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-2 text-center">
                  <p className="text-lg font-bold font-mono text-blue-700">{intakeCount}</p>
                  <p className="text-[9px] font-medium text-blue-600">Intake</p>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-2 text-center">
                  <p className="text-lg font-bold font-mono text-amber-700">{actionsCount}</p>
                  <p className="text-[9px] font-medium text-amber-600">Actions</p>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2 text-center">
                  <p className="text-lg font-bold font-mono text-emerald-700">{outputCount}</p>
                  <p className="text-[9px] font-medium text-emerald-600">Output</p>
                </div>
              </div>
            </div>

            {/* Issues */}
            {(pausedCount > 0 || failedCount > 0) && (
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Issues</p>
                <div className="space-y-1.5">
                  {pausedCount > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                      <span className="text-xs text-amber-700">Paused</span>
                      <span className="font-mono text-sm font-bold text-amber-700">{pausedCount}</span>
                    </div>
                  )}
                  {failedCount > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                      <span className="text-xs text-red-700">Failed</span>
                      <span className="font-mono text-sm font-bold text-red-700">{failedCount}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Workflows */}
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Workflows</p>
              <div className="space-y-1.5">
                {selectedCategory.apps.map((app) => {
                  const appTasks = generateMockTasks(app.slug, 6);
                  const ai = appTasks.filter((t) => t.stage === "intake").length;
                  const aa = appTasks.filter((t) => t.stage === "actions").length;

                  return (
                    <Link
                      key={app.slug}
                      href={`/${selectedCategory.slug}/${app.slug}/intake`}
                      className="group flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{app.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{app.platforms[0]}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          <span className="font-mono text-[10px]">{ai}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span className="font-mono text-[10px]">{aa}</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Process steps */}
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Process Steps ({selectedCategory.apps[0]?.processSteps.length || 0})
              </p>
              <div className="space-y-1">
                {selectedCategory.apps[0]?.processSteps.slice(0, 5).map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="font-mono text-muted-foreground/50 shrink-0 w-3 text-right">{i + 1}</span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
                {(selectedCategory.apps[0]?.processSteps.length || 0) > 5 && (
                  <p className="text-[10px] text-muted-foreground/50 pl-5">
                    +{selectedCategory.apps[0].processSteps.length - 5} more
                  </p>
                )}
              </div>
            </div>

            {/* Open button */}
            <div className="px-4 py-3">
              <Link
                href={
                  selectedCategory.apps.length === 1
                    ? `/${selectedCategory.slug}/${selectedCategory.apps[0].slug}/intake`
                    : `/${selectedCategory.slug}`
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full"
              >
                Open Workflow
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Flow Card (matches landing page card style) ─────────────────

function FlowCard({
  cat,
  isSelected,
  onClick,
  compact,
}: {
  cat: (typeof categories)[0];
  isSelected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const stats = getCategoryStats(cat);
  const Icon = cat.icon;

  return (
    <button onClick={onClick} className="text-left w-full">
      <Card
        className={`group cursor-pointer transition-all duration-200 ${
          isSelected
            ? "border-primary/40 shadow-md ring-1 ring-primary/20"
            : "border-border/60 shadow-sm hover:border-primary/30 hover:shadow-md"
        }`}
      >
        <CardContent className={compact ? "p-3" : "p-3 min-w-[160px]"}>
          {/* Icon + badge */}
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
            </div>
            {stats.openItems > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {stats.openItems}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="text-[11px] font-semibold leading-snug tracking-tight text-foreground">
            {cat.name}
          </h4>

          {/* Pills */}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {cat.apps.map((app) => (
              <span
                key={app.slug}
                className="inline-flex items-center rounded border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
              >
                {app.name}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-1.5 flex items-center gap-2 pt-1 border-t border-border/30">
            <span className="font-mono text-[9px] text-muted-foreground">
              {cat.apps.length} workflow{cat.apps.length !== 1 ? "s" : ""}
            </span>
            {stats.pausedItems > 0 && (
              <span className="font-mono text-[9px] font-medium text-amber-600">
                {stats.pausedItems} paused
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
