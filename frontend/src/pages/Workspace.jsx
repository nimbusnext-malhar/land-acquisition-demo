import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import { useProjectData } from "../lib/projectContext";
import { WorkflowProgressBar } from "../components/WorkflowProgressBar";
import { NextStepButton } from "../components/NextStepButton";

const STATUS_STYLE = {
  Indexed:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Verified: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Flagged:  "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Workspace() {
  const { project, data } = useProjectData();
  const { documents, ownershipChain, validationChecks, riskFlags } = data;
  const [activeId, setActiveId] = useState(documents[0].id);
  const [loading, setLoading] = useState(true);

  // Reset selected document when active project changes
  useEffect(() => { setActiveId(documents[0].id); }, [project.id, documents]);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const active = documents.find((d) => d.id === activeId) || documents[0];

  return (
    <AppShell>
      <div className="p-6 lg:p-8" data-testid="workspace-page">
        <WorkflowProgressBar />
        {/* Project header */}
        <Card className="p-6 bg-white border-slate-200 mb-6" data-testid="project-header">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
                <Icons.FolderKanban className="h-3.5 w-3.5" />
                {project.id}
              </div>
              <h1 className="font-display text-3xl font-bold text-slate-900 mt-2">{project.name}</h1>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <Meta icon="MapPin" label={`${project.village}, ${project.taluka}, ${project.district}`} />
                <Meta icon="Hash" label={`Survey ${project.surveyNumber}`} />
                <Meta icon="Square" label={project.area} />
                <Meta icon="UserCheck" label={project.officer} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${
                project.status === "Clear" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200" :
                project.status === "Disputed" ? "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200" :
                "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200"
              }`} data-testid="title-status-badge">
                <Icons.AlertCircle className="h-3 w-3 mr-1" /> Title: {project.status}
              </Badge>
              <Link to="/rag-pipeline">
                <Button variant="outline" data-testid="view-pipeline-btn">
                  <Icons.Workflow className="h-4 w-4 mr-2" /> View Pipeline
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white" data-testid="ask-ai-btn">
                  <Icons.Sparkles className="h-4 w-4 mr-2" /> Ask Yavi.ai
                </Button>
              </Link>
              <NextStepButton />
            </div>
          </div>
        </Card>

        {/* 3-panel grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: documents */}
          <Card className="lg:col-span-3 bg-white border-slate-200 overflow-hidden" data-testid="doc-list-card">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-display font-semibold text-slate-900">Documents</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{documents.length} indexed · {project.chunksCount} chunks</div>
              </div>
              <Button size="icon" variant="outline" data-testid="upload-doc-btn">
                <Icons.Upload className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[640px]">
              <div className="p-3 space-y-2">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-md border border-slate-200 bg-white space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))
                ) : (
                  documents.map((d) => {
                    const Icon = d.status === "Flagged" ? Icons.FileWarning : Icons.FileText;
                    const isActive = d.id === activeId;
                    return (
                      <button
                        key={d.id}
                        data-testid={`doc-item-${d.id}`}
                        onClick={() => setActiveId(d.id)}
                        className={`w-full text-left p-3 rounded-md border transition-all ${
                          isActive
                            ? "bg-cyan-50 border-cyan-300 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className={`h-4 w-4 mt-0.5 ${
                            d.status === "Flagged" ? "text-amber-600" : isActive ? "text-cyan-700" : "text-slate-500"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-800 truncate">{d.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 mono">{d.uploadedAt}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-[10px] ${STATUS_STYLE[d.status]} border`} variant="outline">
                                {d.status}
                              </Badge>
                              <span className="text-[10px] text-slate-500 mono">{d.chunks} chunks</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Center: viewer */}
          <Card className="lg:col-span-6 bg-white border-slate-200" data-testid="doc-viewer-card">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-display font-semibold text-slate-900">{active.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 mono">
                  {active.type} · {active.pages} page(s) · confidence {active.confidence}%
                </div>
              </div>
              <Badge className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50 border border-cyan-200">
                <Icons.Sparkles className="h-3 w-3 mr-1" /> Yavi.ai indexed
              </Badge>
            </div>

            <Tabs defaultValue="ocr" className="px-6 pt-4">
              <TabsList data-testid="viewer-tabs">
                <TabsTrigger value="ocr" data-testid="tab-ocr">OCR Text</TabsTrigger>
                <TabsTrigger value="meta" data-testid="tab-meta">Extracted Metadata</TabsTrigger>
                <TabsTrigger value="chain" data-testid="tab-chain">Ownership Chain</TabsTrigger>
              </TabsList>

              <TabsContent value="ocr" className="mt-4">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-5 max-h-[500px] overflow-y-auto thin-scroll">
                  <pre className="text-[13px] leading-relaxed whitespace-pre-wrap text-slate-700 mono" data-testid="ocr-text">
                    {active.ocr}
                  </pre>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 mono">
                  <Icons.CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Indexed into Yavi.ai · Embeddings generated · Semantic validation complete
                </div>
              </TabsContent>

              <TabsContent value="meta" className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(active.meta).map(([k, v]) => (
                    <div key={k} className="rounded-md border border-slate-200 p-3 bg-white">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
                      <div className="text-sm font-semibold text-slate-800 mt-1 mono">{v}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chain" className="mt-4 pb-6">
                <div className="relative">
                  <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-200" />
                  <div className="space-y-4">
                    {ownershipChain.map((c, i) => (
                      <div key={i} className="relative pl-12" data-testid={`chain-entry-${i}`}>
                        <div className={`absolute left-2 top-1 h-7 w-7 rounded-full flex items-center justify-center border-2 bg-white ${
                          c.status === "warn" ? "border-amber-400 text-amber-600" :
                          c.status === "bad"  ? "border-rose-400 text-rose-600" :
                          c.status === "info" ? "border-cyan-500 text-cyan-600" :
                          "border-emerald-500 text-emerald-600"
                        }`}>
                          {c.status === "warn" ? <Icons.AlertTriangle className="h-3.5 w-3.5" /> :
                           c.status === "bad"  ? <Icons.AlertOctagon className="h-3.5 w-3.5" /> :
                           c.status === "info" ? <Icons.Sparkles className="h-3.5 w-3.5" /> :
                           <Icons.CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div className="text-xs mono text-slate-500">{c.year}</div>
                        <div className="text-sm font-semibold text-slate-800">{c.owner}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{c.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Right: AI Validation Summary */}
          <Card className="lg:col-span-3 ai-panel border-cyan-400/30 overflow-hidden" data-testid="ai-summary-card">
            <div className="px-5 py-4 border-b border-cyan-400/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-cyan-300">Yavi.ai · Summary</div>
                <div className="font-display font-semibold text-white mt-0.5">AI Validation</div>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 glow-pulse" />
            </div>

            <div className="p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-100/70">Confidence</span>
                  <span className="text-cyan-200 font-bold mono">{project.confidence.toFixed(1)}%</span>
                </div>
                <Progress value={project.confidence} className="mt-2 h-2 bg-cyan-950" />
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-cyan-300 mb-2 font-bold">Checks</div>
                <div className="space-y-2">
                  {validationChecks.slice(0, 5).map((c) => (
                    <div key={c.id} className="flex items-start gap-2 text-xs" data-testid={`check-${c.id}`}>
                      {c.pass ? (
                        <Icons.CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Icons.AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <span className={c.pass ? "text-cyan-100/85" : "text-amber-200"}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-cyan-300 mb-2 font-bold">Risk Flags</div>
                <div className="space-y-2">
                  {riskFlags.map((r) => {
                    const Icon = Icons[r.icon] || Icons.AlertTriangle;
                    const tone = r.level === "high"   ? "bg-rose-500/10 text-rose-300 border-rose-500/30" :
                                 r.level === "medium" ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
                                                        "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
                    return (
                      <div key={r.id} className={`rounded-md border p-2.5 text-xs ${tone}`} data-testid={`risk-${r.id}`}>
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Icon className="h-3.5 w-3.5" /> {r.label}
                        </div>
                        <div className="text-[10px] mt-1 opacity-70 mono">src: {r.source}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link to="/validation">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white" data-testid="open-validation-btn">
                  Full Validation
                  <Icons.ArrowRight className="h-3.5 w-3.5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

const Meta = ({ icon, label }) => {
  const Icon = Icons[icon] || Icons.Circle;
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span>{label}</span>
    </div>
  );
};
