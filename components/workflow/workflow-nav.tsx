"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Inbox, ListChecks, FileOutput, History } from "lucide-react";

const stages = [
  { key: "intake", label: "Intake", icon: Inbox },
  { key: "actions", label: "Actions", icon: ListChecks },
  { key: "output", label: "Output", icon: FileOutput },
  { key: "history", label: "History", icon: History },
];

interface WorkflowNavProps {
  basePath: string; // e.g. /certificates/coi-issuance
  counts?: Record<string, number>;
}

export function WorkflowNav({ basePath, counts }: WorkflowNavProps) {
  const pathname = usePathname();
  const activeStage = pathname.split("/").pop();

  return (
    <div className="flex border-b bg-card">
      {stages.map((stage) => {
        const isActive = activeStage === stage.key;
        const Icon = stage.icon;
        const count = counts?.[stage.key];

        return (
          <Link
            key={stage.key}
            href={`${basePath}/${stage.key}`}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors",
              isActive
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{stage.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
