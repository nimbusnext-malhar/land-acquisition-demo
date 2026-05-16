import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import { Button } from "./ui/button";

const NEXT_STEPS = {
  "/workspace":    { label: "Review Title Validation", to: "/validation", icon: "ShieldCheck" },
  "/rag-pipeline": { label: "Review Title Validation", to: "/validation", icon: "ShieldCheck" },
  "/chatbot":      { label: "Review Title Validation", to: "/validation", icon: "ShieldCheck" },
  "/validation":   { label: "Manage Approvals",        to: "/workflow",   icon: "GitBranch"   },
  "/workflow":     { label: "Calculate Compensation",  to: "/valuation",  icon: "Calculator"  },
  "/valuation":    { label: "Export Reports",          to: "/reports",    icon: "FileBarChart"},
  "/reports":      { label: "Back to Dashboard",       to: "/dashboard",  icon: "LayoutDashboard", back: true },
};

export function NextStepButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const step = NEXT_STEPS[location.pathname];

  if (!step) return null;

  const Icon = Icons[step.icon] || Icons.ArrowRight;

  return (
    <Button
      onClick={() => navigate(step.to)}
      className={
        step.back
          ? "border border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
          : "bg-[#0A2540] hover:bg-[#0F365A] text-white shadow-sm"
      }
      variant={step.back ? "outline" : "default"}
      data-testid="next-step-btn"
    >
      {step.back ? (
        <>
          <Icons.ArrowLeft className="h-4 w-4 mr-2" />
          {step.label}
        </>
      ) : (
        <>
          {step.label}
          <Icon className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  );
}

export default NextStepButton;
