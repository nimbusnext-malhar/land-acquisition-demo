import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import { useActiveProject } from "../lib/projectContext";
import { PROJECTS } from "../data/mockData";

const STAGES = [
  { label: "Documents",  icon: "FileText",     route: "/workspace"  },
  { label: "Validation", icon: "ShieldCheck",  route: "/validation" },
  { label: "Approvals",  icon: "GitBranch",    route: "/workflow"   },
  { label: "Valuation",  icon: "Calculator",   route: "/valuation"  },
  { label: "Reports",    icon: "FileBarChart", route: "/reports"    },
];

// Routes that map to a stage index
const ROUTE_TO_STAGE = {
  "/workspace":    0,
  "/rag-pipeline": 0,
  "/chatbot":      0,
  "/validation":   1,
  "/workflow":     2,
  "/valuation":    3,
  "/reports":      4,
};

// How many stages are "done" (completed) based on project.progress
function getCompletedCount(progress) {
  if (progress >= 90) return 4;
  if (progress >= 70) return 3;
  if (progress >= 45) return 2;
  if (progress >= 20) return 1;
  return 0;
}

export function WorkflowProgressBar({ projectId }) {
  const project = PROJECTS.find((p) => p.id === projectId);
  const progress = project ? project.progress : 0;

  const currentStage = ROUTE_TO_STAGE[location.pathname] ?? -1;
  const completedCount = getCompletedCount(progress);

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg px-5 pt-3 pb-4 mb-6"
      data-testid="workflow-progress-bar"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-4">
        <Icons.FolderKanban className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
        <span className="font-mono font-semibold text-cyan-700">{project?.id || "Unknown Project"}</span>
      </div>

      {/* Stage stepper */}
      <div className="flex items-start">
        {STAGES.map((stage, idx) => {
          const done = idx < completedCount;
          const active = idx === currentStage;
          const clickable = done && !active;
          const Icon = Icons[stage.icon] || Icons.Circle;

          return (
            <React.Fragment key={stage.route}>
              {/* Stage node */}
              <button
                onClick={() => clickable && navigate(stage.route)}
                disabled={!clickable}
                title={clickable ? `Go to ${stage.label}` : stage.label}
                className={`flex flex-col items-center gap-1.5 min-w-[72px] transition-opacity ${
                  clickable ? "cursor-pointer hover:opacity-75" : "cursor-default"
                }`}
                data-testid={`wfstage-${idx}`}
              >
                <div
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    active
                      ? "bg-[#0A2540] border-[#0A2540] text-white shadow-sm"
                      : done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {done && !active ? (
                    <Icons.Check className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-wide leading-tight text-center ${
                    active
                      ? "text-[#0A2540]"
                      : done
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {stage.label}
                </span>
              </button>

              {/* Connector line */}
              {idx < STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-4 transition-colors ${
                    idx < completedCount ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowProgressBar;
