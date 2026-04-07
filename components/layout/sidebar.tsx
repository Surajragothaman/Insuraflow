"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Inbox,
  ListChecks,
  FileOutput,
  LayoutGrid,
} from "lucide-react";

interface AppSidebarProps {
  currentPath: string;
  basePath: string;
  appName: string;
}

export function AppSidebar({ currentPath, basePath, appName }: AppSidebarProps) {
  const mainNavItems = [
    { label: "Intake", href: `${basePath}/intake`, icon: Inbox },
    { label: "Actions", href: `${basePath}/actions`, icon: ListChecks },
    { label: "Output", href: `${basePath}/output`, icon: FileOutput },
  ];

  return (
    <aside className="flex h-full w-[220px] flex-col border-r bg-card">
      {/* Brand Header */}
      <div className="shrink-0 border-b px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-primary-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground">InsuraFlow</span>
            <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Workflow Name */}
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-medium text-foreground truncate">{appName}</p>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 pt-3">
        <div className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - All Workflows */}
      <div className="shrink-0 border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>All Workflows</span>
        </Link>
      </div>
    </aside>
  );
}
