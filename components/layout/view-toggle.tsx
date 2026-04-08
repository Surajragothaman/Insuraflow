"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, GitBranch } from "lucide-react";

interface ViewToggleProps {
  title?: string;
  subtitle?: string;
}

export function ViewToggle({ title, subtitle }: ViewToggleProps) {
  const pathname = usePathname();
  const isFlowView = pathname === "/flow";

  return (
    <div className="bg-background sticky top-16 z-20 w-full">
      <div className="flex h-12 items-center justify-between pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8">
        {/* Title */}
        {title && (
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* View toggle */}
        <div className="flex items-center gap-1 ml-auto">
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
