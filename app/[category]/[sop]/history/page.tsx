"use client";

import { use, useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { getAppBySlug, generateMockTasks, type MockTask } from "@/lib/mock-data";
import { TaskTable } from "@/components/workflow/task-table";
import { TaskDetail } from "@/components/workflow/task-detail";

export default function HistoryPage({ params }: { params: Promise<{ category: string; sop: string }> }) {
  const { category, sop } = use(params);
  const app = getAppBySlug(category, sop);
  if (!app) notFound();

  const tasks = useMemo(() => generateMockTasks(sop, 12), [sop]);
  const [selectedTask, setSelectedTask] = useState<MockTask | null>(null);

  if (selectedTask) {
    return <TaskDetail task={selectedTask} app={app} stage="history" onBack={() => setSelectedTask(null)} />;
  }

  return <TaskTable tasks={tasks} filterStage="done" onSelectTask={setSelectedTask} selectedTaskId={undefined} />;
}
