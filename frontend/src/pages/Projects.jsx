import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { useActiveProject } from "../lib/projectContext";

export default function Projects() {
  const { projects, project, setActiveId } = useActiveProject();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const open = (id) => {
    setActiveId(id);
    navigate("/workspace");
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6" data-testid="projects-page">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              Acquisition Portfolio
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">Projects</h1>
            <p className="text-slate-500 mt-1">{projects.length} active land acquisition projects across MMR.</p>
          </div>
          <Link to="/projects/new">
            <Button className="bg-[#0A2540] hover:bg-[#0F365A]" data-testid="projects-new-btn">
              <Icons.Plus className="h-4 w-4 mr-2" /> Start New Project
            </Button>
          </Link>
        </div>

        {/* Summary row */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4 bg-white border-slate-200">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-7 w-8" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard icon="FolderKanban" label="Active Projects" value={projects.length} />
            <SummaryCard icon="ShieldCheck" label="Cleared" value={projects.filter((p) => p.status === "Clear").length} tone="emerald" />
            <SummaryCard icon="AlertCircle" label="Conditional" value={projects.filter((p) => p.status === "Conditional").length} tone="amber" />
            <SummaryCard icon="AlertTriangle" label="Disputed" value={projects.filter((p) => p.status === "Disputed").length} tone="rose" />
          </div>
        )}

        {/* Projects grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 bg-white border-slate-200">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" data-testid="projects-list">
            {projects.map((p) => {
              const tone = p.status === "Clear" ? "emerald" : p.status === "Disputed" ? "rose" : "amber";
              const isActive = p.id === project.id;
              return (
                <Card
                  key={p.id}
                  data-testid={`project-list-card-${p.id}`}
                  className={`p-6 bg-white border transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isActive ? "border-cyan-400 ring-2 ring-cyan-100" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider mono text-slate-500">{p.id}</div>
                      <h3 className="font-display text-lg font-semibold text-slate-900 mt-1 leading-snug">{p.name}</h3>
                    </div>
                    <Badge variant="outline" className={`text-[10px] bg-${tone}-50 text-${tone}-700 border-${tone}-200`}>
                      {p.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] mono text-slate-600">
                    <Field k="Survey" v={p.surveyNumber} />
                    <Field k="Area"   v={p.area} />
                    <Field k="Village" v={p.village} />
                    <Field k="District" v={p.district} />
                    <Field k="Owner"   v={p.ownerName} cls="col-span-2 truncate" />
                    <Field k="Officer" v={p.officer}   cls="col-span-2 truncate" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">AI Confidence</div>
                    <div className="font-display text-xl font-bold text-slate-900 mt-0.5">{p.confidence.toFixed(1)}%</div>
                    <Progress value={p.confidence} className="mt-1.5 h-1.5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Workflow Progress</div>
                    <div className="font-display text-xl font-bold text-slate-900 mt-0.5">{p.progress}%</div>
                    <Progress value={p.progress} className="mt-1.5 h-1.5" />
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Next Action</div>
                  <div className="text-xs text-slate-700 mt-0.5">{p.nextAction}</div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => open(p.id)}
                    className="flex-1 bg-[#0A2540] hover:bg-[#0F365A] text-white"
                    data-testid={`open-project-${p.id}`}
                  >
                    Open Workspace <Icons.ArrowRight className="h-3.5 w-3.5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setActiveId(p.id); navigate("/validation"); }}
                    data-testid={`open-validation-${p.id}`}
                  >
                    <Icons.ShieldCheck className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

const Field = ({ k, v, cls = "" }) => (
  <div className={cls}>
    <span className="text-slate-400">{k}</span> <span className="text-slate-700">{v}</span>
  </div>
);

const SummaryCard = ({ icon, label, value, tone = "cyan" }) => {
  const Icon = Icons[icon] || Icons.Circle;
  const cls = {
    cyan: "bg-cyan-50 text-cyan-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone];
  return (
    <Card className="p-5 bg-white border-slate-200">
      <div className={`h-9 w-9 rounded-md flex items-center justify-center ${cls}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 font-display text-3xl font-bold text-slate-900">{value}</div>
      <div className="text-xs mt-1 text-slate-500">{label}</div>
    </Card>
  );
};
