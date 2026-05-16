import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { useActiveProject } from "../lib/projectContext";
import { getNextProjectId, createProjectFromForm } from "../data/mockData";

const STAGES = [
  "Generating Project ID",
  "Provisioning Yavi.ai workspace",
  "Creating dummy RAG index",
  "Connecting MahaBhulekh + UIDAI + IGRS",
  "Workspace ready",
];

export default function NewProject() {
  const navigate = useNavigate();
  const { projects, addProject } = useActiveProject();
  const [form, setForm] = useState({
    name: "",
    village: "",
    taluka: "",
    district: "Thane",
    surveyNumber: "",
    landType: "agri-class1",
    acquisitionType: "section-11",
    officer: "legal",
    area: "",
  });
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.village || !form.surveyNumber || !form.area) {
      toast.error("Please complete all required fields");
      return;
    }
    setCreating(true);
    setStageIdx(0);
    setProgress(0);

    let s = 0;
    const interval = setInterval(() => {
      s += 1;
      setStageIdx(s);
      setProgress(Math.min(100, (s / STAGES.length) * 100));
      if (s >= STAGES.length) {
        clearInterval(interval);
        setDone(true);
        // Create project and navigate to its workspace
        const newId = getNextProjectId(projects);
        const newProject = createProjectFromForm(form, newId);
        addProject(newProject);
        toast.success(`✨ Project ${newId} created — workspace is ready`);
        setTimeout(() => navigate("/workspace"), 600);
      }
    }, 700);
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-8" data-testid="new-project-page">
        <div className="max-w-5xl">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              New Acquisition · Section 11 RFCTLARR
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">Start New Project</h1>
            <p className="text-slate-500 mt-1">Initialise a Yavi.ai-powered AI workspace for a new land parcel.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Form */}
            <Card className="lg:col-span-2 p-6 bg-white border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="new-project-form">
                <Section title="Project Identity">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Project ID" hint="Auto-generated">
                      <Input value="MMRDA-2026-0143" disabled className="mono" data-testid="np-project-id" />
                    </Field>
                    <Field label="Project Name *">
                      <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Bhayandar Coastal Road — Phase 1"
                        data-testid="np-name"
                      />
                    </Field>
                  </div>
                </Section>

                <Section title="Land Location">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Village *">
                      <Input value={form.village} onChange={(e) => set("village", e.target.value)} placeholder="Kharbav" data-testid="np-village" />
                    </Field>
                    <Field label="Taluka *">
                      <Input value={form.taluka} onChange={(e) => set("taluka", e.target.value)} placeholder="Bhiwandi" data-testid="np-taluka" />
                    </Field>
                    <Field label="District *">
                      <Select value={form.district} onValueChange={(v) => set("district", v)}>
                        <SelectTrigger data-testid="np-district"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Thane">Thane</SelectItem>
                          <SelectItem value="Raigad">Raigad</SelectItem>
                          <SelectItem value="Palghar">Palghar</SelectItem>
                          <SelectItem value="Mumbai City">Mumbai City</SelectItem>
                          <SelectItem value="Mumbai Suburban">Mumbai Suburban</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Field label="Survey / CTS Number *">
                      <Input value={form.surveyNumber} onChange={(e) => set("surveyNumber", e.target.value)} placeholder="247/3B" data-testid="np-survey" />
                    </Field>
                    <Field label="Area (Hectares) *">
                      <Input type="number" step="0.01" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="4.86" data-testid="np-area" />
                    </Field>
                  </div>
                </Section>

                <Section title="Acquisition">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Land Type">
                      <Select value={form.landType} onValueChange={(v) => set("landType", v)}>
                        <SelectTrigger data-testid="np-landtype"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agri-class1">Agricultural — Class I</SelectItem>
                          <SelectItem value="agri-class2">Agricultural — Class II</SelectItem>
                          <SelectItem value="non-agri">Non-Agricultural</SelectItem>
                          <SelectItem value="residential">Urban Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Acquisition Type">
                      <Select value={form.acquisitionType} onValueChange={(v) => set("acquisitionType", v)}>
                        <SelectTrigger data-testid="np-acqtype"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="section-11">Section 11 — RFCTLARR Act, 2013</SelectItem>
                          <SelectItem value="section-19">Section 19 — Notification</SelectItem>
                          <SelectItem value="negotiated">Negotiated Purchase</SelectItem>
                          <SelectItem value="urgency">Urgency Provision (Sec. 40)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Officer Assigned">
                      <Select value={form.officer} onValueChange={(v) => set("officer", v)}>
                        <SelectTrigger data-testid="np-officer"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="legal">Adv. Rohini Deshmukh — Legal</SelectItem>
                          <SelectItem value="acquisition">Mr. Anil Bhonsle — Acquisition</SelectItem>
                          <SelectItem value="survey">Ms. Priya Joshi — Survey</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </Section>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={creating}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white h-11 px-6"
                    data-testid="np-create-btn"
                  >
                    {creating ? (
                      <><Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating workspace…</>
                    ) : (
                      <><Icons.Sparkles className="h-4 w-4 mr-2" /> Create AI Workspace</>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/projects")} disabled={creating} data-testid="np-cancel-btn">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>

            {/* Progress panel */}
            <Card className="ai-panel ai-grid-bg border-cyan-400/30 p-6 overflow-hidden" data-testid="np-progress-card">
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-cyan-300">
                Workspace Initialisation
              </div>
              <div className="font-display text-xl font-semibold text-white mt-1">Yavi.ai Provisioning</div>

              {!creating && !done && (
                <p className="text-xs text-cyan-100/70 mt-4 leading-relaxed">
                  Submit the form to initialise the AI workspace. Yavi.ai will create a dedicated
                  RAG index, connect to government APIs, and prepare the document ingestion pipeline.
                </p>
              )}

              {(creating || done) && (
                <>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cyan-100/70">Progress</span>
                      <span className="text-cyan-200 mono font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="mt-2 h-2 bg-cyan-950" />
                  </div>
                  <div className="mt-5 space-y-2">
                    {STAGES.map((s, i) => {
                      const state = i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
                      return (
                        <div key={s} className="flex items-center gap-2 text-xs" data-testid={`np-stage-${i}`}>
                          {state === "done" ? <Icons.CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> :
                           state === "active" ? <Icons.Loader2 className="h-3.5 w-3.5 text-cyan-300 animate-spin" /> :
                           <Icons.Circle className="h-3.5 w-3.5 text-white/30" />}
                          <span className={state === "pending" ? "text-white/40" : state === "done" ? "text-cyan-100" : "text-cyan-300"}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {done && (
                <div className="mt-6 fade-in-up">
                  <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/15">
                    Ready to use
                  </Badge>
                  <Button onClick={() => navigate("/workspace")} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white" data-testid="np-open-workspace">
                    Open Workspace <Icons.ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const Section = ({ title, children }) => (
  <div>
    <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500 mb-3">{title}</div>
    {children}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-slate-700">{label}</Label>
    {children}
    {hint && <div className="text-[10px] text-slate-400 mono">{hint}</div>}
  </div>
);
