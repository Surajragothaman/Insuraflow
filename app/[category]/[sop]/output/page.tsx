"use client";

import { use, useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { getAppBySlug, generateMockTasks, type MockTask } from "@/lib/mock-data";
import { TaskTable } from "@/components/workflow/task-table";
import { TaskDetail } from "@/components/workflow/task-detail";

export default function OutputPage({ params }: { params: Promise<{ category: string; sop: string }> }) {
  const { category, sop } = use(params);
  const app = getAppBySlug(category, sop);
  if (!app) notFound();

  const tasks = useMemo(() => {
    return generateMockTasks(sop, 12).map((t) =>
      t.status === "approved" ? { ...t, stage: "output" as const } : t
    );
  }, [sop]);
  const [selectedTask, setSelectedTask] = useState<MockTask | null>(null);

  if (selectedTask) {
    return <TaskDetail task={selectedTask} app={app} stage="output" onBack={() => setSelectedTask(null)} />;
  }

  return <TaskTable tasks={tasks} filterStage="output" onSelectTask={setSelectedTask} selectedTaskId={undefined} />;
}
