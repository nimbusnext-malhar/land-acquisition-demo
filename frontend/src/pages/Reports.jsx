import React, { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useActiveProject } from "../lib/projectContext";
import { REPORTS } from "../data/mockData";
import { WorkflowProgressBar } from "../components/WorkflowProgressBar";
import { NextStepButton } from "../components/NextStepButton";

export default function Reports() {
  const { project } = useActiveProject();
  const [busy, setBusy] = useState({});

  const fakeExport = (id, kind, name) => {
    const key = `${id}-${kind}`;
    setBusy((b) => ({ ...b, [key]: true }));
    setTimeout(() => {
      setBusy((b) => ({ ...b, [key]: false }));
      toast.success(`${name} exported as ${kind.toUpperCase()}`);
    }, 1000);
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6" data-testid="reports-page">
        <WorkflowProgressBar />
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              {project.id} · Document Bundle
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">Reports</h1>
            <p className="text-slate-500 mt-1">
              Auto-generated reports for {project.name}. Citations link back to indexed documents.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => toast.success("Bundle queued — share link sent to Legal Team")} data-testid="reports-share-btn">
              <Icons.Share2 className="h-4 w-4 mr-2" /> Share with Legal Team
            </Button>
            <Button className="bg-[#0A2540] hover:bg-[#0F365A] text-white" onClick={() => toast.success("All 4 reports bundled for download")} data-testid="reports-bundle-btn">
              <Icons.Package className="h-4 w-4 mr-2" /> Download Full Bundle
            </Button>
            <NextStepButton />
          </div>
        </div>

        {/* Yavi.ai banner */}
        <Card className="ai-panel ai-grid-bg border-cyan-400/30 p-5 overflow-hidden" data-testid="reports-banner">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-10 w-10 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Icons.Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-cyan-300">Yavi.ai Citation Trace</div>
              <div className="text-sm text-cyan-50/90 mt-0.5">
                Every report includes inline citations linking each claim to the originating document chunk and government API response.
              </div>
            </div>
            <Badge className="bg-cyan-950 text-cyan-300 hover:bg-cyan-950 border border-cyan-700 text-[10px]">
              165 chunks · 6 docs
            </Badge>
          </div>
        </Card>

        {/* Reports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="reports-grid">
          {REPORTS.map((r) => {
            const Icon = Icons[r.icon] || Icons.FileText;
            const pdfBusy = busy[`${r.id}-pdf`];
            const xlsxBusy = busy[`${r.id}-xlsx`];
            return (
              <Card key={r.id} className="p-6 bg-white border-slate-200" data-testid={`report-card-${r.id}`}>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-md bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg font-semibold text-slate-900">{r.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{r.pages} pages</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{r.desc}</p>
                    <div className="mt-3 flex items-center gap-4 text-[11px] mono text-slate-500">
                      <span><Icons.Clock className="h-3 w-3 inline mr-1" />Last generated {r.lastGenerated}</span>
                      <span><Icons.HardDrive className="h-3 w-3 inline mr-1" />{r.size}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={pdfBusy}
                    onClick={() => fakeExport(r.id, "pdf", r.name)}
                    data-testid={`report-pdf-${r.id}`}
                  >
                    {pdfBusy ? <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Icons.FileDown className="h-4 w-4 mr-2" />}
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={xlsxBusy}
                    onClick={() => fakeExport(r.id, "xlsx", r.name)}
                    data-testid={`report-xlsx-${r.id}`}
                  >
                    {xlsxBusy ? <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Icons.Sheet className="h-4 w-4 mr-2" />}
                    Export Excel
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toast.success(`${r.name} preview opened`)}
                    data-testid={`report-preview-${r.id}`}
                  >
                    <Icons.Eye className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Audit log mock */}
        <Card className="p-6 bg-white border-slate-200" data-testid="reports-audit-card">
          <h3 className="font-display text-lg font-semibold text-slate-900">Recent Exports</h3>
          <p className="text-sm text-slate-500 mb-4">Audit trail of report exports and shares.</p>
          <div className="divide-y divide-slate-100 -mx-6">
            {AUDIT.map((a, i) => {
              const Icon = Icons[a.icon] || Icons.FileText;
              return (
                <div key={i} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <Icon className="h-4 w-4 text-slate-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-800">{a.label}</div>
                    <div className="text-[11px] mono text-slate-500">{a.user} · {a.time}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{a.kind}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

const AUDIT = [
  { icon: "FileDown",  label: "Title Validation Report — exported PDF",   user: "Adv. Rohini Deshmukh", time: "Today · 10:42",  kind: "PDF" },
  { icon: "Share2",    label: "Risk Assessment Report — shared with Legal", user: "Adv. Rohini Deshmukh", time: "Today · 09:18",  kind: "SHARE" },
  { icon: "Sheet",     label: "Valuation Report — exported Excel",          user: "Mr. Anil Bhonsle",     time: "Yesterday · 17:34", kind: "XLSX" },
  { icon: "FileDown",  label: "Ownership Summary — exported PDF",            user: "Ms. Priya Joshi",      time: "11 Jan · 14:02", kind: "PDF" },
];
