import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import AppShell from "../components/AppShell";
import PipelineFlow from "../components/PipelineFlow";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { PIPELINE_NODES } from "../data/mockData";
import { useProjectData } from "../lib/projectContext";

// Tiny inline embedding visualization (random but deterministic)
function vec(seed, n = 32) {
  const arr = [];
  let x = seed;
  for (let i = 0; i < n; i++) {
    x = (x * 9301 + 49297) % 233280;
    arr.push(Math.abs((x / 233280) - 0.5) * 2);
  }
  return arr;
}

export default function RagPipeline() {
  const { project, data } = useProjectData();
  const sampleChunks = data.sampleChunks;
  const [activeIndex, setActiveIndex] = useState(0);

  // Replay animation when project changes
  useEffect(() => { setActiveIndex(0); }, [project.id]);

  useEffect(() => {
    if (activeIndex >= PIPELINE_NODES.length - 1) return;
    const t = setTimeout(() => setActiveIndex((i) => i + 1), 600);
    return () => clearTimeout(t);
  }, [activeIndex]);

  const replay = () => setActiveIndex(0);

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6" data-testid="rag-pipeline-page">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-cyan-700">
              <Icons.Sparkles className="h-3.5 w-3.5" /> Yavi.ai · RAG Pipeline
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 mt-2">
              Live Indexing & Semantic Validation
            </h1>
            <p className="text-slate-500 mt-1 max-w-2xl">
              From OCR'd Marathi land records to embeddings to a rules-based AI decision —
              traced end-to-end across the Yavi.ai retrieval engine.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={replay} data-testid="replay-btn">
              <Icons.RefreshCcw className="h-4 w-4 mr-2" /> Replay
            </Button>
            <Link to="/chatbot">
              <Button className="bg-cyan-600 hover:bg-cyan-500 text-white" data-testid="open-chat-btn">
                <Icons.Bot className="h-4 w-4 mr-2" /> Open Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Pipeline */}
        <PipelineFlow activeIndex={activeIndex} />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="Boxes"   label="Chunk count"      value={String(project.chunksCount)} sub="512 tokens / chunk" />
          <StatCard icon="Binary"  label="Embedding model"  value="text-embedding-3" sub="768-dim · cosine" highlight />
          <StatCard icon="Search"  label="Vector matches"   value={`${Math.floor(project.chunksCount * 0.25)} / ${project.chunksCount}`} sub="threshold > 0.78" />
          <StatCard icon="Sparkles" label="AI confidence"   value={`${project.confidence.toFixed(1)}%`} sub="across 27 rules" highlight />
        </div>

        {/* Chunks + embeddings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 bg-white border-slate-200 p-6" data-testid="chunks-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">Top semantic matches</h3>
                <p className="text-xs text-slate-500">Retrieved by cosine similarity over the project corpus.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">k = 8 · returned 5</Badge>
            </div>
            <div className="space-y-3">
              {sampleChunks.map((c, i) => (
                <div key={c.id} className="rounded-md border border-slate-200 p-4 hover:border-cyan-400/60 transition-colors fade-in-up" style={{ animationDelay: `${i * 60}ms` }} data-testid={`chunk-${c.id}`}>
                  <div className="flex items-center justify-between text-[11px] mono text-slate-500">
                    <span>{c.id} · {c.source}</span>
                    <span className="text-cyan-700 font-semibold">score {c.score.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">{c.text}</p>
                  <div className="mt-3">
                    <Progress value={c.score * 100} className="h-1.5 bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 ai-panel ai-grid-bg border-cyan-400/30 p-6 overflow-hidden" data-testid="embeddings-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-cyan-300">Embedding Space</div>
                <div className="font-display font-semibold text-white mt-1 text-lg">Vector Visualization</div>
              </div>
              <Badge className="bg-cyan-950 text-cyan-300 hover:bg-cyan-950 border border-cyan-700 text-[10px]">
                768-dim · sample 32
              </Badge>
            </div>

            <div className="mt-5 space-y-4">
              {sampleChunks.slice(0, 4).map((c, idx) => {
                const v = vec(idx + 7);
                return (
                  <div key={c.id} data-testid={`embedding-${c.id}`}>
                    <div className="flex items-center justify-between text-[11px] mono text-cyan-100/70 mb-1">
                      <span>{c.id}</span>
                      <span className="text-cyan-300">cos {c.score.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-[2px] h-6 items-end">
                      {v.map((val, j) => (
                        <div
                          key={j}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${10 + val * 90}%`,
                            background: `rgba(6,182,212,${0.25 + val * 0.65})`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-[11px] mono text-cyan-100/80">
              <div><div className="text-cyan-300">latency</div>418 ms</div>
              <div><div className="text-cyan-300">tokens in</div>84,330</div>
              <div><div className="text-cyan-300">recall@8</div>0.94</div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

const StatCard = ({ icon, label, value, sub, highlight }) => {
  const Icon = Icons[icon] || Icons.Circle;
  return (
    <Card
      data-testid={`pipeline-stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={`p-5 border ${highlight ? "ai-panel border-cyan-400/30" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-center justify-between">
        <div className={`h-9 w-9 rounded-md flex items-center justify-center ${highlight ? "bg-cyan-500/15 text-cyan-300" : "bg-slate-100 text-slate-700"}`}>
          <Icon className="h-4 w-4" />
        </div>
        {highlight && <Icons.Sparkles className="h-3.5 w-3.5 text-cyan-300" />}
      </div>
      <div className={`mt-3 text-2xl font-display font-bold ${highlight ? "text-cyan-200" : "text-slate-900"}`}>{value}</div>
      <div className={`text-[11px] uppercase tracking-wider mt-1 ${highlight ? "text-cyan-100/70" : "text-slate-500"}`}>{label}</div>
      <div className={`text-[11px] mt-1 mono ${highlight ? "text-cyan-300/80" : "text-slate-500"}`}>{sub}</div>
    </Card>
  );
};
