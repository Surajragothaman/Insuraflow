"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Inbox,
  ListChecks,
  FileOutput,
  ArrowLeft,
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
      {/* Brand */}
      <div className="flex h-12 shrink-0 items-center border-b px-4">
        <Link href="/" className="text-sm font-semibold tracking-[-0.025em]">
          Insura<span className="text-primary">Flow</span>
        </Link>
      </div>

      {/* Back + current app */}
      <div className="px-3 pt-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Dashboard
        </Link>
        <div className="mt-3 px-3 pb-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Workflow
          </p>
          <p className="text-xs font-semibold tracking-[-0.025em] mt-0.5 truncate">{appName}</p>
        </div>
      </div>

      <div className="mx-3 border-t" />

      {/* Primary nav — Intake, Actions, Output only */}
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
    </aside>
  );
}
