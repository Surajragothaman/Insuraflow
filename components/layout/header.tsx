"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Layers, LayoutGrid, GitBranch, PauseCircle } from "lucide-react";
import { UserMenu } from "./user-menu";
import { categories, getCategoryStats } from "@/lib/mock-data";

export function Header() {
  const pathname = usePathname();
  const isFlowView = pathname === "/flow";

  const totalOpen = categories.reduce((sum, c) => sum + getCategoryStats(c).openItems, 0);
  const totalPaused = categories.reduce((sum, c) => sum + getCategoryStats(c).pausedItems, 0);
  const totalWorkflows = categories.reduce((sum, c) => sum + c.apps.length, 0);

  return (
    <header className="border-b border-border bg-card sticky top-0 z-20 w-full">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Insura<span className="text-primary">Flow</span>
        </h1>

        {/* Right side - Stats, User, and View Toggle */}
        <div className="flex items-center gap-4">
          {/* Stats - Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold tabular-nums text-foreground">{totalOpen}</span>
              <span className="text-xs text-muted-foreground">open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PauseCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold tabular-nums text-foreground">{totalPaused}</span>
              <span className="text-xs text-muted-foreground">paused</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold tabular-nums text-foreground">{totalWorkflows}</span>
              <span className="text-xs text-muted-foreground">workflows</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* User Menu */}
          <UserMenu />

          {/* Divider */}
          <div className="h-8 w-px bg-border" />

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
            <Link
              href="/"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                !isFlowView
                  ? "bg-card font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </Link>
            <Link
              href="/flow"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                isFlowView
                  ? "bg-card font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Flow</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
