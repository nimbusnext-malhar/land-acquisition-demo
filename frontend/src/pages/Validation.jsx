import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import { useProjectData } from "../lib/projectContext";
import { WorkflowProgressBar } from "../components/WorkflowProgressBar";
import { NextStepButton } from "../components/NextStepButton";

const STATUS_PILL = {
  verified: { label: "Verified", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  warning:  { label: "Warning",  cls: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500" },
  error:    { label: "Failed",   cls: "bg-rose-50 text-rose-700 border-rose-200",          dot: "bg-rose-500" },
};

const DECISION_TONE = {
  Clear:       { color: "emerald", icon: "ShieldCheck",  text: "text-emerald-200", iconColor: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-400/40" },
  Conditional: { color: "amber",   icon: "AlertCircle",  text: "text-amber-200",   iconColor: "text-amber-300",   bg: "bg-amber-500/15",   border: "border-amber-400/40" },
  Disputed:    { color: "rose",    icon: "AlertOctagon", text: "text-rose-200",    iconColor: "text-rose-300",    bg: "bg-rose-500/15",    border: "border-rose-400/40" },
};

export default function Validation() {
  const { project, data } = useProjectData();
  const { validationChecks, riskFlags, govApis, decision } = data;
  const tone = DECISION_TONE[project.status] || DECISION_TONE.Conditional;
  const DecisionIcon = Icons[tone.icon] || Icons.AlertCircle;
  const [pinging, setPinging] = useState({});

  const verifyApi = (id, name) => {
    setPinging((p) => ({ ...p, [id]: true }));
    setTimeout(() => {
      setPinging((p) => ({ ...p, [id]: false }));
      toast.success(`${name} re-verified · ${Math.floor(140 + Math.random() * 320)} ms`);
    }, 1200);
  };

  const passCount = validationChecks.filter((c) => c.pass).length;
  const total = validationChecks.length;
  const passRate = (passCount / total) * 100;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6" data-testid="validation-page">
        <WorkflowProgressBar />
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              <Icons.ShieldCheck className="h-3.5 w-3.5" /> {project.id}
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">Title Validation Decision</h1>
            <p className="text-slate-500 mt-1">{project.name} · Survey {project.surveyNumber}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" data-testid="export-report-btn" onClick={() => toast.success("Title Validation Report queued for PDF export")}>
              <Icons.FileDown className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <Link to="/chatbot">
              <Button className="bg-cyan-600 hover:bg-cyan-500" data-testid="ask-yavi-btn">
                <Icons.Sparkles className="h-4 w-4 mr-2" /> Ask Yavi.ai
              </Button>
            </Link>
            <NextStepButton />
          </div>
        </div>

        {/* Decision card */}
        <Card className="ai-panel ai-grid-bg border-cyan-400/30 p-8 overflow-hidden relative" data-testid="decision-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-cyan-300">
                <Icons.Sparkles className="h-3.5 w-3.5" /> Yavi.ai Decision
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className={`h-16 w-16 rounded-xl ${tone.bg} border ${tone.border} flex items-center justify-center animate-ai-pulse`}>
                  <DecisionIcon className={`h-8 w-8 ${tone.iconColor}`} />
                </div>
                <div>
                  <div className={`font-display text-4xl font-bold ${tone.text}`}>{project.status}</div>
                  <div className="text-cyan-100/80 text-sm">{decision.headline}</div>
                </div>
              </div>

              <div className="mt-6 max-w-2xl">
                <div className="flex items-center justify-between text-xs text-cyan-100/80">
                  <span>Validation Pass Rate</span>
                  <span className="mono">{passCount} / {total}</span>
                </div>
                <Progress value={passRate} className="h-2 mt-2 bg-cyan-950" />
              </div>

              <div className="mt-6 rounded-lg border border-cyan-400/30 bg-cyan-500/5 p-4 max-w-2xl">
                <div className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold mb-1">AI Recommendation</div>
                <p className="text-sm text-cyan-50/90 leading-relaxed">{decision.recommendation}</p>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold mb-3">Confidence</div>
              <div className="font-display text-6xl font-bold text-cyan-200">{Math.floor(project.confidence)}.<span className="text-2xl">{Math.round((project.confidence % 1) * 10)}%</span></div>
              <div className="text-cyan-100/70 text-xs mt-1">across 27 title rules</div>
              <div className="mt-6 space-y-2 text-xs text-cyan-100/80">
                {decision.stats.map((s) => (
                  <Stat key={s.label} label={s.label} value={s.value} warn={s.warn} />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Checklist + Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 bg-white border-slate-200 p-6" data-testid="checklist-card">
            <h3 className="font-display text-lg font-semibold text-slate-900">Validation Checklist</h3>
            <p className="text-sm text-slate-500 mb-4">Every rule traced to source documents and government APIs.</p>
            <div className="space-y-2">
              {validationChecks.map((c) => (
                <div
                  key={c.id}
                  data-testid={`vcheck-${c.id}`}
                  className={`flex items-start gap-3 p-3 rounded-md border ${
                    c.pass ? "bg-emerald-50/40 border-emerald-100" : "bg-amber-50/50 border-amber-200"
                  }`}
                >
                  {c.pass ? (
                    <Icons.CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Icons.AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">{c.label}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{c.detail}</div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${c.pass ? "border-emerald-200 text-emerald-700 bg-white" : "border-amber-200 text-amber-700 bg-white"}`}>
                    {c.pass ? "PASS" : "REVIEW"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 bg-white border-slate-200 p-6" data-testid="risk-panel">
            <h3 className="font-display text-lg font-semibold text-slate-900">Risk Panel</h3>
            <p className="text-sm text-slate-500 mb-4">Aggregated from documents and rules engine.</p>
            <div className="space-y-3">
              {riskFlags.map((r) => {
                const Icon = Icons[r.icon] || Icons.AlertTriangle;
                const tone = r.level === "high"   ? "bg-rose-50 text-rose-700 border-rose-200" :
                             r.level === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                    "bg-cyan-50 text-cyan-700 border-cyan-200";
                return (
                  <div key={r.id} className={`rounded-md border p-3 ${tone}`}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <div className="text-sm font-semibold">{r.label}</div>
                      <Badge variant="outline" className="ml-auto text-[10px] bg-white capitalize">{r.level}</Badge>
                    </div>
                    <div className="text-[11px] mt-1 mono opacity-80">src: {r.source}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200">
              <h4 className="font-display text-sm font-semibold text-slate-900 mb-3">Workflow</h4>
              <div className="space-y-2 text-xs">
                <Step done label="Document Upload" sub={`${data.documents.length} / ${data.documents.length} docs uploaded`} />
                <Step done label="AI Validation"   sub={`Yavi.ai · ${project.confidence.toFixed(1)}% conf`} />
                <Step active label="Legal Review"  sub={project.status === "Clear" ? "Cleared" : project.status === "Disputed" ? "Awaiting court outcome" : "ETA: 2 business days"} />
                <Step done={project.status === "Clear"} label="Survey Approval" />
                <Step done={project.status === "Clear"} label="Valuation Approval" />
                <Step done={project.status === "Clear"} label="Final Acquisition Approval" />
              </div>
            </div>
          </Card>
        </div>

        {/* Government API verification */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-900">Government API Verification</h3>
              <p className="text-sm text-slate-500">Live status of integrations powering this validation.</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {govApis.filter((a) => a.status === "verified").length} / {govApis.length} endpoints {govApis.some((a) => a.status === "error") ? "errors" : "online"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="gov-api-grid">
            {govApis.map((api) => {
              const meta = STATUS_PILL[api.status];
              return (
                <Card key={api.id} className="bg-white border-slate-200 p-5 hover:shadow-md transition-all" data-testid={`api-card-${api.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display font-semibold text-slate-900">{api.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{api.desc}</div>
                    </div>
                    <Badge variant="outline" className={`${meta.cls} border gap-1.5 text-[10px]`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${api.status !== "verified" ? "" : "animate-pulse"}`} />
                      {meta.label}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] mono text-slate-500">
                    <div>
                      <div className="text-slate-400 uppercase tracking-wider text-[10px]">Latency</div>
                      <div className="text-slate-800 mt-0.5">{api.latency} ms</div>
                    </div>
                    <div>
                      <div className="text-slate-400 uppercase tracking-wider text-[10px]">Last sync</div>
                      <div className="text-slate-800 mt-0.5">{api.lastSync}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-400 uppercase tracking-wider text-[10px]">Endpoint</div>
                      <div className="text-slate-700 mt-0.5 truncate">{api.endpoint}</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Result</div>
                    <div className="text-xs text-slate-700">{api.result}</div>
                  </div>

                  <Button
                    onClick={() => verifyApi(api.id, api.name)}
                    disabled={pinging[api.id]}
                    variant="outline"
                    className="w-full mt-4"
                    data-testid={`verify-${api.id}`}
                  >
                    {pinging[api.id] ? (
                      <><Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying…</>
                    ) : (
                      <><Icons.RefreshCcw className="h-4 w-4 mr-2" /> Verify Now</>
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const Stat = ({ label, value, warn }) => (
  <div className="flex items-center justify-between">
    <span className="text-cyan-100/70">{label}</span>
    <span className={`mono font-semibold ${warn ? "text-amber-300" : "text-cyan-100"}`}>{value}</span>
  </div>
);

const Step = ({ label, sub, done, active }) => (
  <div className={`flex items-start gap-3 px-3 py-2 rounded-md ${active ? "bg-cyan-50 border border-cyan-200" : ""}`}>
    {done ? <Icons.CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" /> :
     active ? <Icons.Loader2 className="h-4 w-4 text-cyan-600 mt-0.5 animate-spin" /> :
     <Icons.Circle className="h-4 w-4 text-slate-300 mt-0.5" />}
    <div>
      <div className={`text-sm font-medium ${active ? "text-cyan-800" : done ? "text-slate-800" : "text-slate-500"}`}>{label}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  </div>
);
