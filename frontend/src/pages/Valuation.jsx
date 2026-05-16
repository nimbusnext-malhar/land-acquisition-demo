import React, { useMemo, useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useActiveProject } from "../lib/projectContext";
import { LAND_CATEGORIES, RR_ZONES, USAGE_TYPES } from "../data/mockData";
import { WorkflowProgressBar } from "../components/WorkflowProgressBar";
import { NextStepButton } from "../components/NextStepButton";

const fmtINR = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmtCr = (n) => `₹${(n / 1e7).toFixed(2)} Cr`;

export default function Valuation() {
  const { project } = useActiveProject();

  const initial = useMemo(() => {
    const zone = RR_ZONES.find((z) => z.rate === project.rrRate) || RR_ZONES[2];
    const cat = LAND_CATEGORIES.find((c) => c.label.toLowerCase().includes((project.landType || "").split(" ")[0].toLowerCase())) || LAND_CATEGORIES[0];
    return {
      area: String(project.areaHa),
      zone: zone.value,
      rrRate: zone.rate,
      category: cat.value,
      fsi: String(project.fsi),
      usage: project.usage?.toLowerCase().includes("agri") ? "agricultural"
            : project.usage?.toLowerCase().includes("residential") ? "residential"
            : project.usage?.toLowerCase().includes("commercial") ? "commercial"
            : "mixed",
      urbanRural: project.urbanRural || "rural",
    };
  }, [project]);

  const [f, setF] = useState(initial);
  useEffect(() => { setF(initial); }, [initial]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const onZoneChange = (val) => {
    const z = RR_ZONES.find((x) => x.value === val);
    setF((s) => ({ ...s, zone: val, rrRate: z ? z.rate : s.rrRate }));
  };

  // RFCTLARR-style calc (simplified for demo)
  const calc = useMemo(() => {
    const area = parseFloat(f.area) || 0;
    const rrRate = Number(f.rrRate) || 0;
    const fsi = parseFloat(f.fsi) || 1;
    const cat = LAND_CATEGORIES.find((c) => c.value === f.category) || LAND_CATEGORIES[0];
    const baseMarket = rrRate * area;
    const fsiAdjusted = baseMarket * (fsi >= 1 ? 1 + (fsi - 1) * 0.4 : fsi);
    const ruralFactor = f.urbanRural === "rural" ? 2.0 : 1.0; // RFCTLARR multiplier
    const categoryAdj = fsiAdjusted * cat.baseMultiplier;
    const multiplied = categoryAdj * ruralFactor;
    const solatium = multiplied * 1.0; // 100% solatium per Sec. 30
    const interest12pct = multiplied * 0.12;
    const finalAmount = multiplied + solatium + interest12pct;
    return { area, rrRate, baseMarket, fsiAdjusted, categoryAdj, multiplied, solatium, interest12pct, finalAmount, ruralFactor, cat };
  }, [f]);

  const breakdownChart = [
    { label: "Base Market",  value: calc.multiplied,    color: "#0E7490" },
    { label: "Solatium",     value: calc.solatium,      color: "#06B6D4" },
    { label: "Interest 12%", value: calc.interest12pct, color: "#67E8F9" },
  ];

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6" data-testid="valuation-page">
        <WorkflowProgressBar />
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              Ready Reckoner · RFCTLARR 2013
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">Land Valuation</h1>
            <p className="text-slate-500 mt-1">{project.name} · {project.village}, {project.district}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => toast.success("Valuation report queued for PDF export")} data-testid="val-export-btn">
              <Icons.FileDown className="h-4 w-4 mr-2" /> Export Valuation
            </Button>
            <NextStepButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <Card className="lg:col-span-5 p-6 bg-white border-slate-200" data-testid="val-inputs-card">
            <h3 className="font-display text-lg font-semibold text-slate-900">Valuation Inputs</h3>
            <p className="text-sm text-slate-500">Adjust to recompute compensation in real-time.</p>

            <div className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <FieldBox label="Area (Hectares)">
                  <Input type="number" step="0.01" value={f.area} onChange={(e) => set("area", e.target.value)} data-testid="val-area" />
                </FieldBox>
                <FieldBox label="FSI">
                  <Input type="number" step="0.1" value={f.fsi} onChange={(e) => set("fsi", e.target.value)} data-testid="val-fsi" />
                </FieldBox>
              </div>

              <FieldBox label="Land Category">
                <Select value={f.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger data-testid="val-category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LAND_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label} · ×{c.baseMultiplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldBox>

              <FieldBox label="Ready Reckoner Zone">
                <Select value={f.zone} onValueChange={onZoneChange}>
                  <SelectTrigger data-testid="val-zone"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RR_ZONES.map((z) => (
                      <SelectItem key={z.value} value={z.value}>
                        {z.label} · ₹{(z.rate / 1e7).toFixed(2)} Cr/Ha
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldBox>

              <div className="grid grid-cols-2 gap-4">
                <FieldBox label="Usage Type">
                  <Select value={f.usage} onValueChange={(v) => set("usage", v)}>
                    <SelectTrigger data-testid="val-usage"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {USAGE_TYPES.map((u) => (
                        <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldBox>
                <FieldBox label="Location">
                  <Select value={f.urbanRural} onValueChange={(v) => set("urbanRural", v)}>
                    <SelectTrigger data-testid="val-urbanrural"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rural">Rural · ×2.0 multiplier</SelectItem>
                      <SelectItem value="urban">Urban · ×1.0 multiplier</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldBox>
              </div>

              <div className="rounded-md bg-cyan-50 border border-cyan-200 p-3 text-xs text-cyan-800">
                <div className="flex items-start gap-2">
                  <Icons.Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <p className="leading-relaxed">
                    Compensation per RFCTLARR Act, 2013 — Section 26 (RR rate) +
                    Section 30 (100% solatium) + 12% interest. Rural areas get 2× multiplier.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Outputs */}
          <Card className="lg:col-span-7 ai-panel ai-grid-bg border-cyan-400/30 p-6 overflow-hidden" data-testid="val-output-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-cyan-300">Compensation Estimate</div>
                <div className="font-display text-xl font-semibold text-white mt-1">Final Payable Amount</div>
              </div>
              <Badge className="bg-cyan-950 text-cyan-300 hover:bg-cyan-950 border border-cyan-700 text-[10px]">
                <Icons.Sparkles className="h-3 w-3 mr-1" /> Auto-calculated
              </Badge>
            </div>

            <div className="mt-5">
              <div className="font-display text-5xl font-bold text-cyan-200">
                ₹{fmtINR(calc.finalAmount)}
              </div>
              <div className="text-cyan-100/70 text-sm mt-1 mono">≈ {fmtCr(calc.finalAmount)} · {calc.area} Ha</div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3" data-testid="val-breakdown">
              <Out k="Ready Reckoner Rate"  v={`₹${fmtINR(calc.rrRate)} / Ha`} />
              <Out k="Base Market Value"    v={`₹${fmtINR(calc.baseMarket)}`}  hint="RR × Area" />
              <Out k="FSI-Adjusted Value"   v={`₹${fmtINR(calc.fsiAdjusted)}`} hint={`FSI ${f.fsi}`} />
              <Out k="Category Multiplier"  v={`×${calc.cat.baseMultiplier}`} hint={calc.cat.label} />
              <Out k={`${f.urbanRural === "rural" ? "Rural" : "Urban"} Multiplier`} v={`×${calc.ruralFactor}`} />
              <Out k="Sec. 26 Multiplied Value" v={`₹${fmtINR(calc.multiplied)}`} />
              <Out k="Sec. 30 Solatium (100%)"  v={`₹${fmtINR(calc.solatium)}`} />
              <Out k="Interest @ 12%"           v={`₹${fmtINR(calc.interest12pct)}`} />
            </div>

            <div className="mt-6">
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-cyan-300 mb-2">
                Compensation Breakdown
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={breakdownChart} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid stroke="rgba(6,182,212,0.1)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#67E8F9" }} tickFormatter={(v) => `₹${(v/1e7).toFixed(1)}Cr`} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: "#E2F4F9" }} width={90} />
                  <Tooltip cursor={{ fill: "rgba(6,182,212,0.06)" }} formatter={(v) => `₹${fmtINR(v)}`} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {breakdownChart.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

const FieldBox = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-slate-700">{label}</Label>
    {children}
  </div>
);

const Out = ({ k, v, hint }) => (
  <div className="rounded-md border border-cyan-400/20 bg-white/5 p-3" data-testid={`val-out-${k.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
    <div className="text-[10px] uppercase tracking-wider text-cyan-100/60">{k}</div>
    <div className="text-sm font-semibold text-cyan-100 mt-1 mono">{v}</div>
    {hint && <div className="text-[10px] text-cyan-300/60 mt-0.5">{hint}</div>}
  </div>
);
