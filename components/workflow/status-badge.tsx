"use client";

import type { Status } from "@/lib/mock-data";

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "text-muted-foreground bg-muted" },
  extracted: { label: "Extracted", className: "bg-sky-100 text-sky-700" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  paused: { label: "Paused", className: "bg-amber-100 text-amber-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
  submitted: { label: "Submitted", className: "bg-emerald-100 text-emerald-700" },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
