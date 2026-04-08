"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, GitBranch } from "lucide-react";

export function ViewToggle() {
  const pathname = usePathname();
  const isFlowView = pathname === "/flow";

  return (
    <div className="border-b border-border bg-card sticky top-16 z-20 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-end">
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
    </div>
  );
}
