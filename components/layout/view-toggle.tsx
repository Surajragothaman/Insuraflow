"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, GitBranch } from "lucide-react";

export function ViewToggle() {
  const pathname = usePathname();
  const isFlowView = pathname === "/flow";

  return (
    <div className="border-b border-border bg-background sticky top-16 z-20 w-full">
      <div className="flex h-10 items-center justify-end pr-4 sm:pr-6 lg:pr-8">
        {/* View toggle */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors ${
              !isFlowView
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </Link>
          <Link
            href="/flow"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors ${
              isFlowView
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Flow</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
