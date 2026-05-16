import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { KPIS, ZONE_CHART, TITLE_PIE, VERIFICATION_TREND } from "../data/mockData";
import { useActiveProject } from "../lib/projectContext";

export default function Dashboard() {
  const { project: PROJECT, projects, setActiveId } = useActiveProject();
  const [loading, setLoading] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell>
      <div className="p-8 space-y-8" data-testid="dashboard-page">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              MMRDA · Land Acquisition Console
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">
              Good morning, Officer.
            </h1>
            <p className="text-slate-500 text-base mt-1">
              47 active projects · 1,284 documents indexed · Yavi.ai is online.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" aria-label="Export brief" data-testid="dashboard-export-btn">
              <Icons.Download className="h-4 w-4 mr-2" /> Export Brief
            </Button>
            <Link to="/projects/new">
              <Button className="bg-[#0A2540] hover:bg-[#0F365A]" aria-label="Start new land acquisition" data-testid="dashboard-new-project-btn">
                <Icons.Plus className="h-4 w-4 mr-2" /> New Acquisition
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="kpi-grid-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5 bg-white border-slate-200">
                <Skeleton className="h-9 w-9 rounded-md mb-4" />
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="kpi-grid">
            {KPIS.map((k) => {
              const Icon = Icons[k.icon] || Icons.Circle;
              const isAi = k.id === "ai-confidence";
              return (
                <Card
                  key={k.id}
                  data-testid={`kpi-${k.id}`}
                  className={`p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isAi
                      ? "ai-panel border-cyan-400/30"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`h-9 w-9 rounded-md flex items-center justify-center ${
                      isAi ? "bg-cyan-500/15 text-cyan-300" : "bg-slate-100 text-slate-700"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {isAi && (
                      <Badge className="bg-cyan-950 text-cyan-300 hover:bg-cyan-950 border border-cyan-700 text-[10px]">
                        AI
                      </Badge>
                    )}
                  </div>
                  <div className={`mt-4 font-display text-3xl font-bold ${isAi ? "text-cyan-200" : "text-slate-900"}`}>
                    {k.value}
                  </div>
                  <div className={`text-xs mt-1 ${isAi ? "text-cyan-100/70" : "text-slate-500"}`}>
                    {k.label}
                  </div>
                  <div className={`text-[11px] mt-2 mono ${isAi ? "text-cyan-300/80" : "text-emerald-600"}`}>
                    {k.delta}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Charts row */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="p-6 col-span-1 lg:col-span-7 bg-white border-slate-200">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-80 mb-6" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </Card>
            <Card className="p-6 col-span-1 lg:col-span-5 bg-white border-slate-200">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-60 mb-6" />
              <Skeleton className="h-60 w-full rounded-lg" />
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="p-6 col-span-1 lg:col-span-7 bg-white border-slate-200" data-testid="zone-chart-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    Acquisition Status by Zone
                  </h3>
                  <p className="text-sm text-slate-500">Cleared, disputed, and pending titles across MMR.</p>
                </div>
                <Badge variant="outline" className="text-[10px]">Q1 2026</Badge>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ZONE_CHART} barGap={4}>
                  <CartesianGrid stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="zone" tick={{ fontSize: 11, fill: "#475569" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                  <Tooltip cursor={{ fill: "rgba(6,182,212,0.06)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="cleared" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="disputed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 col-span-1 lg:col-span-5 bg-white border-slate-200" data-testid="title-pie-card">
              <h3 className="font-display text-xl font-semibold text-slate-900">
                Clear vs Disputed Titles
              </h3>
              <p className="text-sm text-slate-500">YTD distribution across all projects.</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={TITLE_PIE} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                    {TITLE_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Trend + active project highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="p-6 col-span-1 lg:col-span-8 bg-white border-slate-200" data-testid="trend-chart-card">
            <h3 className="font-display text-xl font-semibold text-slate-900">
              Document Verification Trend
            </h3>
            <p className="text-sm text-slate-500 mb-2">Verified vs flagged this week.</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={VERIFICATION_TREND}>
                <defs>
                  <linearGradient id="ok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                <Tooltip />
                <Area type="monotone" dataKey="verified" stroke="#06B6D4" strokeWidth={2} fill="url(#ok)" />
                <Area type="monotone" dataKey="flagged"  stroke="#EF4444" strokeWidth={2} fill="url(#bad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 col-span-1 lg:col-span-4 ai-panel border-cyan-400/30" data-testid="featured-project-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-[0.18em] uppercase">
                <Icons.Sparkles className="h-3.5 w-3.5" /> Active AI Workspace
              </div>
              <Badge className="bg-cyan-950 text-cyan-300 hover:bg-cyan-950 border border-cyan-700 text-[10px]">
                {PROJECT.status}
              </Badge>
            </div>
            <h3 className="font-display text-xl font-semibold text-white mt-3">
              {PROJECT.name}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] mono text-cyan-100/80">
              <Field label="Project ID"  value={PROJECT.id} />
              <Field label="Survey No."  value={PROJECT.surveyNumber} />
              <Field label="Village"     value={PROJECT.village} />
              <Field label="Area"        value={PROJECT.area} />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-100/70">AI Validation Confidence</span>
                <span className="text-cyan-200 font-semibold">{PROJECT.confidence.toFixed(1)}%</span>
              </div>
              <Progress value={PROJECT.confidence} className="mt-2 h-2 bg-cyan-950" />
            </div>
            <Link to="/workspace">
              <Button className="w-full mt-5 bg-cyan-600 hover:bg-cyan-500 text-white" data-testid="open-workspace-btn">
                Open Workspace <Icons.ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* All projects grid */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-900">All Active Projects</h3>
              <p className="text-sm text-slate-500">Click any project to switch the active AI workspace.</p>
            </div>
            <Link to="/projects" className="text-sm text-cyan-700 font-semibold hover:underline" data-testid="all-projects-link">
              View all projects →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="projects-grid">
            {projects.map((p) => {
              const isActive = p.id === PROJECT.id;
              const tone = p.status === "Clear" ? "emerald" : p.status === "Disputed" ? "rose" : "amber";
              return (
                <Card
                  key={p.id}
                  data-testid={`project-card-${p.id}`}
                  onClick={() => setActiveId(p.id)}
                  className={`p-5 bg-white border cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isActive ? "border-cyan-400 ring-2 ring-cyan-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mono text-slate-500">{p.id}</div>
                      <div className="font-display font-semibold text-slate-900 mt-1 leading-snug line-clamp-2">{p.name}</div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] bg-${tone}-50 text-${tone}-700 border-${tone}-200`}>
                      {p.status}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] mono text-slate-500">
                    <div><span className="text-slate-400">survey</span> {p.surveyNumber}</div>
                    <div><span className="text-slate-400">area</span> {p.area}</div>
                    <div className="col-span-2 truncate"><span className="text-slate-400">village</span> {p.village}, {p.taluka}</div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>AI Confidence</span>
                      <span className="text-slate-800 font-semibold mono">{p.confidence.toFixed(1)}%</span>
                    </div>
                    <Progress value={p.confidence} className="mt-1.5 h-1.5" />
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 truncate">
                    Next: <span className="text-slate-700">{p.nextAction}</span>
                  </div>
                  {isActive && (
                    <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-700">
                      <Icons.CheckCircle2 className="h-3 w-3" /> Currently active
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const Field = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-cyan-100/50">{label}</div>
    <div className="text-cyan-100 mt-0.5 truncate">{value}</div>
  </div>
);
