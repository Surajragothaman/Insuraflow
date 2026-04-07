"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MockTask, Status } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface TaskTableProps {
  tasks: MockTask[];
  onSelectTask?: (task: MockTask) => void;
  selectedTaskId?: string;
  filterStage?: MockTask["stage"];
}

const filterTabs: { label: string; filter: Status | "all" }[] = [
  { label: "All", filter: "all" },
  { label: "Needs Attention", filter: "extracted" },
  { label: "Paused", filter: "paused" },
  { label: "Approved", filter: "approved" },
];

export function TaskTable({ tasks, onSelectTask, selectedTaskId, filterStage }: TaskTableProps) {
  const [activeFilter, setActiveFilter] = useState<Status | "all">("all");

  const filteredTasks = tasks
    .filter((t) => !filterStage || t.stage === filterStage)
    .filter((t) => activeFilter === "all" || t.status === activeFilter);

  return (
    <div className="flex h-full flex-col">
      {/* Filter tabs */}
      <div className="flex gap-1 border-b px-4 py-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.filter}
            onClick={() => setActiveFilter(tab.filter)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs transition-colors",
              activeFilter === tab.filter
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Task ID</th>
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">Subject</th>
              <th className="px-4 py-2 font-medium">AMS</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onSelectTask?.(task)}
                className={cn(
                  "cursor-pointer border-b text-sm transition-colors hover:bg-accent/50",
                  selectedTaskId === task.id && "bg-accent"
                )}
              >
                <td className="px-4 py-2.5 font-mono text-xs">{task.id}</td>
                <td className="px-4 py-2.5 font-medium">{task.clientName}</td>
                <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">
                  {task.subject}
                </td>
                <td className="px-4 py-2.5">
                  {task.amsMatch ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {format(new Date(task.receivedAt), "MMM dd")}
                </td>
                <td className="px-4 py-2.5">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No items match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
