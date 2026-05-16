import React from "react";
import * as Icons from "lucide-react";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useActiveProject } from "../lib/projectContext";
import { WORKFLOW_STAGES, PENDING_ACTIONS } from "../data/mockData";
import { WorkflowProgressBar } from "../components/WorkflowProgressBar";
import { NextStepButton } from "../components/NextStepButton";

const stageStateForProject = (idx, project) => {
  // Map project.progress (%) to stage states
  // Each stage = ~14% (7 stages); doc & ai always done; legal active; rest pending unless progress > threshold
  if (project.status === "Clear" && project.progress >= 95) {
    return idx < WORKFLOW_STAGES.length - 1 ? "done" : "active";
  }
  if (project.status === "Disputed") {
    if (idx <= 1) return "done";
    if (idx === 2) return "blocked";
    return "pending";
  }
  // Conditional / default
  if (idx <= 2) return "done";
  if (idx === 3) return "active";
  return "pending";
};

const STATE_META = {
  done:    { icon: "CheckCircle2", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Completed", dot: "bg-emerald-500" },
  active:  { icon: "Loader2",      color: "text-cyan-600",     bg: "bg-cyan-50 border-cyan-200",      label: "In Progress", dot: "bg-cyan-500", spin: true },
  pending: { icon: "Clock",         color: "text-slate-400",    bg: "bg-slate-50 border-slate-200",     label: "Pending",     dot: "bg-slate-400" },
  blocked: { icon: "AlertOctagon", color: "text-rose-600",     bg: "bg-rose-50 border-rose-200",      label: "Escalated",   dot: "bg-rose-500" },
};

export default function Workflow() {
  const { project } = useActiveProject();
  const completedCount = WORKFLOW_STAGES.filter((_, i) => stageStateForProject(i, project) === "done").length;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6" data-testid="workflow-page">
        <WorkflowProgressBar />
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              {project.id} · Acquisition Workflow
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">Workflow & Approvals</h1>
            <p className="text-slate-500 mt-1">{project.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-[11px] gap-1">
              <Icons.Timer className="h-3 w-3" /> SLA on track
            </Badge>
            <Badge className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50 border border-cyan-200 text-[11px]">
              {completedCount} / {WORKFLOW_STAGES.length} stages complete
            </Badge>
            <NextStepButton />
          </div>
        </div>

        {/* Overall progress */}
        <Card className="p-6 bg-white border-slate-200" data-testid="workflow-progress-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Overall Progress</div>
              <div className="font-display text-3xl font-bold text-slate-900 mt-1">{project.progress}%</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Next Action</div>
              <div className="text-sm font-semibold text-slate-800 mt-1 max-w-md text-right">{project.nextAction}</div>
            </div>
          </div>
          <Progress value={project.progress} className="mt-4 h-2.5" />
        </Card>

        {/* Stages timeline */}
        <Card className="p-6 bg-white border-slate-200" data-testid="workflow-stages-card">
          <h3 className="font-display text-lg font-semibold text-slate-900">Workflow Stages</h3>
          <p className="text-sm text-slate-500 mb-5">From document upload to final commissioner sign-off.</p>

          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-200" />
            <div className="space-y-3">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const state = stageStateForProject(idx, project);
                const meta = STATE_META[state];
                const Icon = Icons[meta.icon] || Icons.Circle;
                return (
                  <div key={stage.id} className="relative pl-16" data-testid={`stage-${stage.id}`}>
                    <div className={`absolute left-2 top-1 h-9 w-9 rounded-full border-2 bg-white flex items-center justify-center ${meta.color} border-current`}>
                      <Icon className={`h-4 w-4 ${meta.spin ? "animate-spin" : ""}`} />
                    </div>
                    <div className={`rounded-md border p-4 ${meta.bg}`}>
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-display font-semibold text-slate-900">{stage.label}</div>
                            <Badge variant="outline" className="text-[10px] bg-white">{meta.label}</Badge>
                            {state === "blocked" && <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border border-rose-300 text-[10px]">SLA Breached</Badge>}
                          </div>
                          <div className="text-xs text-slate-600 mt-1">{stage.action}</div>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] mono text-slate-500">
                            <span><Icons.User className="h-3 w-3 inline mr-1" />{stage.owner}</span>
                            <span><Icons.Timer className="h-3 w-3 inline mr-1" />SLA {stage.sla}</span>
                            {stage.started && <span><Icons.PlayCircle className="h-3 w-3 inline mr-1" />Started {stage.started}</span>}
                            {stage.finished && <span><Icons.CheckCircle2 className="h-3 w-3 inline mr-1" />Done {stage.finished}</span>}
                            {stage.eta && !stage.finished && <span className="text-cyan-700"><Icons.CalendarClock className="h-3 w-3 inline mr-1" />ETA {stage.eta}</span>}
                          </div>
                        </div>
                        {state === "active" && (
                          <Button size="sm" variant="outline" className="shrink-0" data-testid={`escalate-${stage.id}`}>
                            <Icons.ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Escalate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Pending actions */}
        <Card className="p-6 bg-white border-slate-200" data-testid="workflow-pending-card">
          <h3 className="font-display text-lg font-semibold text-slate-900">Pending Actions</h3>
          <p className="text-sm text-slate-500 mb-4">Items requiring officer attention to unblock the workflow.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PENDING_ACTIONS.map((a) => {
              const tone = a.priority === "high" ? "rose" : a.priority === "medium" ? "amber" : "slate";
              const cls = {
                rose: "bg-rose-50 border-rose-200 text-rose-700",
                amber: "bg-amber-50 border-amber-200 text-amber-700",
                slate: "bg-slate-50 border-slate-200 text-slate-700",
              }[tone];
              return (
                <div key={a.id} className={`rounded-md border p-4 ${cls}`} data-testid={`pending-action-${a.id}`}>
                  <div className="flex items-start gap-2">
                    <Icons.AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{a.label}</div>
                      <div className="text-[11px] mono mt-1 opacity-80">{a.assignee} · {a.sla}</div>
                    </div>
                    <Badge variant="outline" className="bg-white text-[10px] capitalize">{a.priority}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
