"use client";

import { useState } from "react";
import type { MockTask, SopApp } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Minus,
  Pause,
  MessageSquare,
  Send,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Pencil,
  Mail,
  Paperclip,
  FileText,
  ListChecks,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

interface TaskDetailProps {
  task: MockTask;
  app: SopApp;
  stage: "intake" | "actions" | "output" | "history";
  onBack: () => void;
}

function CheckIcon({ passed }: { passed: boolean | null }) {
  if (passed === true) return <Check className="w-3.5 h-3.5 text-gray-700" />;
  if (passed === false) return <X className="w-3.5 h-3.5 text-gray-400" />;
  return <Minus className="w-3.5 h-3.5 text-gray-300" />;
}

export function TaskDetail({ task, app, stage, onBack }: TaskDetailProps) {
  const [fieldsOpen, setFieldsOpen] = useState(true);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [instructOpen, setInstructOpen] = useState(false);
  const [instructText, setInstructText] = useState("");

  // Group extracted fields
  const fieldGroups: { label: string; fields: { key: string; label: string }[] }[] = [];
  const seen = new Set<string>();
  for (const field of app.extractedFields) {
    if (!seen.has(field.group)) {
      seen.add(field.group);
      fieldGroups.push({
        label: field.group,
        fields: app.extractedFields.filter((f) => f.group === field.group),
      });
    }
  }

  return (
    <div className="fixed inset-0 left-[220px] flex bg-white z-10">
      {/* Left panel — email content (60%) */}
      <div className="w-[60%] border-r border-gray-200 flex flex-col min-h-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <span className="text-xs text-gray-400">{task.clientName}</span>
          </div>
        </div>

        {/* Source Email header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b flex-shrink-0">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-700">Source Email</span>
        </div>

        {/* Email content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5">
            {/* Email metadata */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-3">{task.subject}</h2>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 w-12">From</span>
                  <span className="font-medium text-gray-800">{task.sender.split("@")[0].replace(".", " ")}</span>
                  <span className="text-gray-400">&lt;{task.sender}&gt;</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 w-12">Date</span>
                  <span className="text-gray-600">
                    {new Date(task.receivedAt).toLocaleString("en-US", {
                      weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Attachments bar */}
            <div className="mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Paperclip className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Attachments (2)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer">
                  <FileText className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">request_document.pdf</span>
                  <span className="text-[9px] text-gray-400">View</span>
                </button>
                <button className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer">
                  <FileText className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">policy_dec_page.pdf</span>
                  <span className="text-[9px] text-gray-400">View</span>
                </button>
              </div>
            </div>

            {/* Email body */}
            <pre className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap font-sans bg-transparent p-0 m-0 border-0">
{`Dear Team,

Please process the following request for ${task.clientName} regarding policy ${task.policyNumber}.

${app.processSteps[0] ? `This request requires: ${app.processSteps[0].toLowerCase()}.` : ""}

Please refer to the attached documentation for complete details.

Best regards,
${task.sender.split("@")[0].replace(".", " ")}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Right panel — checks + fields + actions (40%) */}
      <div className="w-[40%] flex flex-col min-h-0">
        {/* Task ID + Status */}
        <div className="px-4 py-2.5 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700 font-mono">{task.id}</span>
          <StatusBadge status={task.status} />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Extraction Checks */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Checks</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Sender Email</span>
                <CheckIcon passed={true} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Policy Identifier</span>
                <CheckIcon passed={true} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">AMS Match</span>
                <CheckIcon passed={task.amsMatch} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Confidence</span>
                <span className={`font-medium ${task.confidence === "high" ? "text-green-700" : "text-amber-700"}`}>
                  {task.confidence === "high" ? "High" : "Low"}
                </span>
              </div>
            </div>
          </div>

          {/* Extracted Fields — collapsible, default open */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setFieldsOpen(!fieldsOpen)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-500">Extracted Fields</span>
              <div className="flex items-center gap-2">
                {fieldsOpen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editMode && Object.keys(editedFields).length > 0) {
                        // save would go here
                      }
                      setEditMode(!editMode);
                    }}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700"
                  >
                    <Pencil className="w-3 h-3" />
                    {editMode ? "Done" : "Edit"}
                  </button>
                )}
                {fieldsOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
              </div>
            </button>
            {fieldsOpen && (
              <div className="px-4 py-3">
                {fieldGroups.map((group) => {
                  const hasValues = group.fields.some((f) => task.extractedData[f.key]);
                  if (!hasValues && !editMode) return null;
                  return (
                    <div key={group.label} className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        {group.label}
                      </p>
                      <div className="space-y-1">
                        {group.fields.map((f) => {
                          const val = task.extractedData[f.key];
                          if (!val && !editMode) return null;
                          return (
                            <div key={f.key} className="flex items-center justify-between text-xs py-0.5">
                              <span className="text-gray-500">{f.label}</span>
                              {editMode ? (
                                <input
                                  type="text"
                                  value={editedFields[f.key] ?? val ?? ""}
                                  onChange={(e) =>
                                    setEditedFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                                  }
                                  className="text-xs border border-gray-200 rounded px-1.5 py-0.5 w-full max-w-[55%] text-right focus:outline-none focus:ring-1 focus:ring-gray-400"
                                />
                              ) : (
                                <span className="text-gray-900 font-medium text-right max-w-[55%] truncate">
                                  {String(val)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Process Steps — collapsible, default collapsed */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setStepsOpen(!stepsOpen)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" />
                Process Steps
              </span>
              {stepsOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {stepsOpen && (
              <div className="px-4 py-3 space-y-2">
                {app.processSteps.map((step, i) => {
                  const isCompleted =
                    stage === "output" || stage === "history"
                      ? true
                      : stage === "actions"
                        ? i < Math.ceil(app.processSteps.length / 2)
                        : i === 0;
                  const isCurrent =
                    !isCompleted &&
                    (stage === "actions"
                      ? i === Math.ceil(app.processSteps.length / 2)
                      : stage === "intake"
                        ? i === 1
                        : false);

                  return (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? "bg-green-100" : isCurrent ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          {isCompleted ? (
                            <Check className="w-2.5 h-2.5 text-green-700" />
                          ) : isCurrent ? (
                            <Clock className="w-2.5 h-2.5 text-blue-600" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          )}
                        </div>
                        {i < app.processSteps.length - 1 && <div className="w-px h-4 bg-gray-200 mt-0.5" />}
                      </div>
                      <div className="flex-1 min-w-0 -mt-0.5">
                        <p className={`text-xs font-medium ${
                          isCompleted ? "text-gray-700" : isCurrent ? "text-gray-900" : "text-gray-500"
                        }`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instruct System */}
          {instructOpen && (
            <div className="px-4 py-3 border-b border-gray-100 space-y-2">
              <p className="text-[11px] font-medium text-gray-600">Modify planned actions</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Instruct the system to change how it processes this item.
              </p>
              <textarea
                autoFocus
                placeholder="e.g. Skip AMS lookup and manually process, or Re-extract focusing on the second attachment..."
                value={instructText}
                onChange={(e) => setInstructText(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs" disabled={!instructText.trim()}>
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => { setInstructOpen(false); setInstructText(""); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom action buttons — fixed */}
        {stage !== "history" && (
          <div className="px-3 py-2 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" className="h-6 text-[10px] px-1.5">
                <Pause className="w-2.5 h-2.5 mr-0.5" />
                Pause
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[10px] px-1.5"
                onClick={() => { setInstructOpen(!instructOpen); if (!instructOpen) setStepsOpen(true); }}
              >
                <MessageSquare className="w-2.5 h-2.5 mr-0.5" />
                Instruct
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-[10px] px-1.5">
                <Send className="w-2.5 h-2.5 mr-0.5" />
                Contact
              </Button>
              <div className="flex-1" />
              <Button size="sm" className="h-6 text-[10px] px-2">
                <Check className="w-2.5 h-2.5 mr-0.5" />
                {stage === "output" ? "Approve & Submit" : "Approve"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
