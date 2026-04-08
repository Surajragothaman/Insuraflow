"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, GitBranch } from "lucide-react";

interface ViewToggleProps {
  title?: string;
  subtitle?: string;
  showBorder?: boolean;
}

export function ViewToggle({ title, subtitle, showBorder = false }: ViewToggleProps) {
  const pathname = usePathname();
  const isFlowView = pathname === "/flow";

  return (
    <div className={`bg-background sticky top-16 z-20 w-full ${showBorder ? "border-b border-border" : ""}`}>
      <div className="flex py-3 items-center justify-between pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8">
        {/* Title */}
        {title && (
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* View toggle - sliding switcher */}
        <div className="relative flex items-center ml-auto -mt-2 -mr-2 bg-muted rounded-full p-1">
          {/* Sliding background indicator */}
          <div 
            className={`absolute h-7 bg-card rounded-full shadow-sm transition-all duration-200 ease-in-out ${
              isFlowView 
                ? "left-[calc(50%)] w-[calc(50%-4px)]" 
                : "left-1 w-[calc(50%-4px)]"
            }`}
          />
          
          <Link
            href="/"
            className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors rounded-full ${
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
            className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors rounded-full ${
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
