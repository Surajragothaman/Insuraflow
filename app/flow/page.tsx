"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, getCategoryStats, generateMockTasks } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Activity,
  Layers,
  LayoutGrid,
  GitBranch,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

// ─── Flow phases ───────────────────────────────────────────────────

interface FlowPhase {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  type: "sequential" | "parallel" | "timed" | "exception";
  nodes: { slug: string; daysBefore?: number }[];
}

const phases: FlowPhase[] = [
  {
    id: "new-business",
    label: "New Business",
    shortLabel: "Acquisition",
    description: "Sequential pipeline from prospect to policy",
    type: "sequential",
    nodes: [
      { slug: "prospecting" },
      { slug: "quoting" },
      { slug: "application" },
      { slug: "binding" },
      { slug: "policy-setup" },
      { slug: "policy-checking" },
    ],
  },
  {
    id: "servicing",
    label: "Policy Servicing",
    shortLabel: "Active",
    description: "Parallel processes during policy lifecycle",
    type: "parallel",
    nodes: [
      { slug: "certificates" },
      { slug: "endorsements" },
      { slug: "carrier-downloads" },
      { slug: "invoicing" },
      { slug: "payment" },
    ],
  },
  {
    id: "renewal",
    label: "Renewal",
    shortLabel: "Renew",
    description: "Timed countdown to policy expiration",
    type: "timed",
    nodes: [
      { slug: "loss-runs", daysBefore: 175 },
      { slug: "renewal-marketing", daysBefore: 150 },
      { slug: "renewal-processing", daysBefore: 30 },
      { slug: "renewal-proposal", daysBefore: 15 },
      { slug: "renewal-certificates", daysBefore: 0 },
    ],
  },
  {
    id: "exceptions",
    label: "Exceptions",
    shortLabel: "Exception",
    description: "Cancellation and reinstatement handling",
    type: "exception",
    nodes: [
      { slug: "cancellation" },
      { slug: "reinstatements" },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

function getCat(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// ─── Component ───────────────────────────────────────────────────

export default function FlowPage() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>("new-business");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const totalOpen = categories.reduce((sum, c) => sum + getCategoryStats(c).openItems, 0);
  const totalWorkflows = categories.reduce((sum, c) => sum + c.apps.length, 0);

  const activePhase = phases.find((p) => p.id === selectedPhase);
  const selectedCategory = selectedNode ? getCat(selectedNode) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Insura<span className="text-primary">Flow</span>
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* View toggle */}
              <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </Link>
                <div className="flex items-center gap-1.5 rounded-md bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Flow</span>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6 px-4 border-x border-border">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Open</span>
                    <span className="text-sm font-semibold tabular-nums">{totalOpen}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Workflows</span>
                    <span className="text-sm font-semibold tabular-nums">{totalWorkflows}</span>
                  </div>
                </div>
              </div>

              {/* User */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  DF
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium">Demo User</span>
                  <span className="text-xs text-muted-foreground">Operator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Phase Navigation - Full Width Banner */}
      <div className="border-b border-border bg-card/50">
        <div className="grid grid-cols-4 divide-x divide-border">
          {phases.map((phase) => {
            const phaseCats = phase.nodes.map((n) => getCat(n.slug)).filter(Boolean);
            const phaseOpen = phaseCats.reduce((sum, c) => sum + getCategoryStats(c!).openItems, 0);
            const isActive = selectedPhase === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => {
                  setSelectedPhase(phase.id);
                  setSelectedNode(null);
                }}
                className={`relative flex flex-col items-center justify-center py-5 transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground hover:bg-secondary/50"
                }`}
              >
                <span className="text-sm font-semibold">{phase.shortLabel}</span>
                <span className={`text-xs mt-0.5 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {phaseCats.length} processes
                </span>
                {phaseOpen > 0 && (
                  <span className={`absolute top-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive ? "bg-card text-primary" : "bg-primary text-primary-foreground"
                  }`}>
                    {phaseOpen}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Process List */}
        <div className={`flex-1 transition-all ${selectedNode ? "mr-[380px]" : ""}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {activePhase && (
              <>
                {/* Phase Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold tracking-tight">{activePhase.label}</h2>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      activePhase.type === "sequential" ? "bg-blue-50 text-blue-700" :
                      activePhase.type === "parallel" ? "bg-emerald-50 text-emerald-700" :
                      activePhase.type === "timed" ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      {activePhase.type === "sequential" && "Sequential"}
                      {activePhase.type === "parallel" && "Parallel"}
                      {activePhase.type === "timed" && <><Clock className="h-3 w-3" /> Timed</>}
                      {activePhase.type === "exception" && <><AlertCircle className="h-3 w-3" /> Exception</>}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activePhase.description}</p>
                </div>

                {/* Process Cards */}
                {activePhase.type === "sequential" && (
                  <div className="space-y-3">
                    {activePhase.nodes.map((node, idx) => {
                      const cat = getCat(node.slug);
                      if (!cat) return null;
                      const stats = getCategoryStats(cat);
                      const Icon = cat.icon;
                      const isSelected = selectedNode === cat.slug;

                      return (
                        <div key={node.slug} className="flex items-start gap-4">
                          {/* Step indicator */}
                          <div className="flex flex-col items-center shrink-0 pt-4">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                              isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                            }`}>
                              {idx + 1}
                            </div>
                            {idx < activePhase.nodes.length - 1 && (
                              <div className="w-px h-full min-h-[40px] bg-border mt-2" />
                            )}
                          </div>
                          
                          {/* Card */}
                          <button
                            onClick={() => setSelectedNode(isSelected ? null : cat.slug)}
                            className="flex-1 text-left"
                          >
                            <Card className={`transition-all ${
                              isSelected 
                                ? "border-primary shadow-md ring-1 ring-primary/20" 
                                : "border-border hover:border-primary/40 hover:shadow-sm"
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-semibold">{cat.name}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                        {cat.apps.length} workflow{cat.apps.length !== 1 ? "s" : ""}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    {stats.pausedItems > 0 && (
                                                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                        {stats.pausedItems} paused
                                                      </span>
                                                    )}
                                                    {stats.openItems > 0 && (
                                                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        {stats.openItems} open
                                                      </span>
                                                    )}
                                                    <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? "text-primary rotate-90" : "text-muted-foreground"}`} />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activePhase.type === "parallel" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activePhase.nodes.map((node) => {
                      const cat = getCat(node.slug);
                      if (!cat) return null;
                      const stats = getCategoryStats(cat);
                      const Icon = cat.icon;
                      const isSelected = selectedNode === cat.slug;

                      return (
                        <button
                          key={node.slug}
                          onClick={() => setSelectedNode(isSelected ? null : cat.slug)}
                          className="text-left"
                        >
                          <Card className={`h-full transition-all ${
                            isSelected 
                              ? "border-primary shadow-md ring-1 ring-primary/20" 
                              : "border-border hover:border-primary/40 hover:shadow-sm"
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                                  <Icon className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
                                </div>
                                {stats.openItems > 0 && (
                                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
                                    {stats.openItems}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-semibold">{cat.name}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {cat.apps.length} workflow{cat.apps.length !== 1 ? "s" : ""}
                                {stats.pausedItems > 0 && (
                                  <span className="text-amber-600"> · {stats.pausedItems} paused</span>
                                )}
                              </p>
                            </CardContent>
                          </Card>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activePhase.type === "timed" && (
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-[60px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-400 to-amber-200" />
                    
                    <div className="space-y-4">
                      {activePhase.nodes.map((node, idx) => {
                        const cat = getCat(node.slug);
                        if (!cat) return null;
                        const stats = getCategoryStats(cat);
                        const Icon = cat.icon;
                        const isSelected = selectedNode === cat.slug;

                        return (
                          <div key={node.slug} className="flex items-center gap-4">
                            {/* Day marker */}
                            <div className="w-[48px] text-right shrink-0">
                              <span className="font-mono text-sm font-bold text-amber-600">
                                {node.daysBefore}d
                              </span>
                            </div>
                            
                            {/* Timeline dot */}
                            <div className="relative z-10 shrink-0">
                              <div className="h-4 w-4 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                            </div>
                            
                            {/* Card */}
                            <button
                              onClick={() => setSelectedNode(isSelected ? null : cat.slug)}
                              className="flex-1 text-left"
                            >
                              <Card className={`transition-all ${
                                isSelected 
                                  ? "border-primary shadow-md ring-1 ring-primary/20" 
                                  : "border-border hover:border-amber-300 hover:shadow-sm"
                              }`}>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                                        <Icon className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-semibold">{cat.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                          {cat.apps.length} workflow{cat.apps.length !== 1 ? "s" : ""}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {stats.pausedItems > 0 && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
                                          {stats.pausedItems} paused
                                        </span>
                                      )}
                                      {stats.openItems > 0 && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                          {stats.openItems} open
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activePhase.type === "exception" && (
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    {activePhase.nodes.map((node, idx) => {
                      const cat = getCat(node.slug);
                      if (!cat) return null;
                      const stats = getCategoryStats(cat);
                      const Icon = cat.icon;
                      const isSelected = selectedNode === cat.slug;

                      return (
                        <div key={node.slug} className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => setSelectedNode(isSelected ? null : cat.slug)}
                            className="flex-1 text-left"
                          >
                            <Card className={`h-full transition-all ${
                              isSelected 
                                ? "border-red-400 shadow-md ring-1 ring-red-200" 
                                : "border-border hover:border-red-300 hover:shadow-sm"
                            }`}>
                              <CardContent className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100">
                                    <Icon className="h-5 w-5 text-red-600" strokeWidth={1.5} />
                                  </div>
                                  {stats.openItems > 0 && (
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                      {stats.openItems}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-sm font-semibold">{cat.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {cat.apps.length} workflow{cat.apps.length !== 1 ? "s" : ""}
                                  {stats.pausedItems > 0 && (
                                    <span className="text-amber-600"> · {stats.pausedItems} paused</span>
                                  )}
                                </p>
                              </CardContent>
                            </Card>
                          </button>
                          
                          {idx === 0 && (
                            <div className="flex flex-col items-center gap-1 shrink-0">
                              <ArrowRight className="h-4 w-4 text-muted-foreground/50 rotate-0 sm:rotate-0" />
                              <span className="text-[9px] text-muted-foreground">resolve</span>
                              <RotateCcw className="h-4 w-4 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Detail Sidebar */}
        {selectedCategory && (
          <div className="fixed right-0 top-16 bottom-0 w-[380px] border-l border-border bg-card overflow-auto z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card">
              <div className="flex items-center gap-3 min-w-0">
                {(() => { 
                  const Icon = selectedCategory.icon; 
                  return (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    </div>
                  );
                })()}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">{selectedCategory.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedCategory.apps.length} workflows</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)} 
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Pipeline Stats */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3">Pipeline Overview</p>
              {(() => {
                const tasks = selectedCategory.apps.flatMap((app) => generateMockTasks(app.slug, 6));
                const intakeCount = tasks.filter((t) => t.stage === "intake").length;
                const actionsCount = tasks.filter((t) => t.stage === "actions").length;
                const outputCount = tasks.filter((t) => t.status === "approved").length;

                return (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-center">
                      <p className="text-2xl font-bold text-blue-700">{intakeCount}</p>
                      <p className="text-[10px] font-medium text-blue-600 mt-0.5">Intake</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-3 text-center">
                      <p className="text-2xl font-bold text-amber-700">{actionsCount}</p>
                      <p className="text-[10px] font-medium text-amber-600 mt-0.5">Actions</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-700">{outputCount}</p>
                      <p className="text-[10px] font-medium text-emerald-600 mt-0.5">Output</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Workflows List */}
            <div className="px-5 py-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Workflows</p>
              <div className="space-y-2">
                {selectedCategory.apps.map((app) => {
                  const appTasks = generateMockTasks(app.slug, 6);
                  const openCount = appTasks.filter((t) => t.stage !== "done").length;

                  return (
                    <Link
                      key={app.slug}
                      href={`/${selectedCategory.slug}/${app.slug}/intake`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/50 transition-all group"
                    >
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium truncate">{app.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{app.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {openCount > 0 && (
                          <span className="text-xs font-medium text-muted-foreground">{openCount} open</span>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
