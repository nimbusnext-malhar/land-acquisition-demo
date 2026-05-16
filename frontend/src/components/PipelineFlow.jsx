import React from "react";
import * as Icons from "lucide-react";
import { PROJECTS } from "../data/mockData";

// Horizontal animated pipeline visualization
export const PipelineFlow = ({ activeIndex = 8, projectId }) => {
  const project = PROJECTS.find((p) => p.id === projectId);
  const pipelineNodes = project ? [
    { id: "documents", label: "Documents", icon: "FileText" },
    { id: "validation", label: "Validation", icon: "ShieldCheck" },
    { id: "approvals", label: "Approvals", icon: "GitBranch" },
    { id: "valuation", label: "Valuation", icon: "Calculator" },
    { id: "reports", label: "Reports", icon: "FileBarChart" },
  ] : [];

  return (
    <div className="ai-panel ai-grid-bg rounded-xl p-8 relative overflow-x-auto thin-scroll" data-testid="rag-pipeline-flow">
      <div className="flex items-stretch gap-3 min-w-[1100px]">
        {pipelineNodes.map((node, i) => {
          const Icon = Icons[node.icon] || Icons.Circle;
          const isActive = i <= activeIndex;
          const isFinal = i === pipelineNodes.length - 1;
          return (
            <React.Fragment key={node.id}>
              <div
                className={`flex-1 min-w-[110px] rounded-lg p-3 border transition-all ${
                  isActive
                    ? "border-cyan-400/50 bg-cyan-500/5 shadow-[0_0_24px_rgba(6,182,212,0.15)]"
                    : "border-white/10 bg-white/5"
                }`}
                data-testid={`pipeline-node-${node.id}`}
              >
                <div
                  className={`h-9 w-9 rounded-md flex items-center justify-center mb-2 ${
                    isActive ? "bg-cyan-500/20 text-cyan-300 animate-ai-pulse" : "bg-white/10 text-white/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className={`text-[11px] font-semibold ${isActive ? "text-cyan-100" : "text-white/60"}`}>
                  {node.label}
                </div>
                {isFinal && isActive && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-300 font-semibold">
                    <Icons.CheckCircle2 className="h-3 w-3" /> Done
                  </div>
                )}
              </div>
              {i < pipelineNodes.length - 1 && (
                <svg className="w-6 self-center" height="40" viewBox="0 0 24 40" fill="none">
                  <line
                    x1="0" y1="20" x2="24" y2="20"
                    stroke={i < activeIndex ? "#06B6D4" : "rgba(255,255,255,0.15)"}
                    strokeWidth="2"
                    className={i < activeIndex ? "data-flow" : ""}
                  />
                </svg>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-4 text-[11px] text-cyan-200/80 mono">
        <span>● Stream: live</span>
        <span>chunks: 165</span>
        <span>dim: 768</span>
        <span>top-k: 8</span>
        <span className="ml-auto">Yavi.ai · v2.4</span>
      </div>
    </div>
  );
};

export default PipelineFlow;
