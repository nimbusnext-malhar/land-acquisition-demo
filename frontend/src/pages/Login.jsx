import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, Lock, User } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { login } from "../lib/auth";
import { toast } from "sonner";

const ROLE_NAMES = {
  legal:        { name: "Adv. Rohini Deshmukh",   role: "Legal Officer" },
  acquisition:  { name: "Mr. Anil Bhonsle",        role: "Acquisition Officer" },
  survey:       { name: "Ms. Priya Joshi",         role: "Survey Officer" },
  admin:        { name: "Suresh Kale (Admin)",     role: "Admin" },
};

const BG_IMG = "https://images.unsplash.com/photo-1705675451865-2a0b7ec9fc50?crop=entropy&cs=srgb&fm=jpg&q=85";

export default function Login() {
  const [username, setUsername] = useState("officer");
  const [password, setPassword] = useState("mmrda@2026");
  const [role, setRole] = useState("legal");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }
    const u = ROLE_NAMES[role];
    login({ username, ...u });
    toast.success(`Welcome, ${u.name}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2" data-testid="login-screen">
      {/* Left: branding background */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_IMG})` }}
        />
        <div className="absolute inset-0 bg-[#0A2540]/85" />
        <div className="absolute inset-0 ai-grid-bg opacity-30" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-6 w-6 text-[#0A2540]" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-tight">MMRDA</div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-cyan-300">
              Mumbai Metropolitan Region Development Authority
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-xs font-semibold mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Yavi.ai RAG Engine
          </div>
          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
            AI-Powered Land Title Validation &<br />
            <span className="text-cyan-300">Acquisition Platform</span>
          </h1>
          <p className="mt-5 text-white/75 text-base leading-relaxed max-w-md">
            Index land documents, validate ownership through semantic retrieval, and
            reconcile against MahaBhulekh, UIDAI, IGRS, and GIS — all in one
            government-grade workspace.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <Stat label="Docs indexed" value="1,284" />
            <Stat label="Avg confidence" value="92.7%" />
            <Stat label="APIs online" value="6 / 6" />
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-white/50">
          © 2026 MMRDA · GovTech AI Demo · v0.9.1
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-md bg-[#0A2540] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="font-display font-bold text-lg">MMRDA</div>
          </div>

          <h2 className="font-display text-3xl font-bold text-slate-900">Officer Sign-in</h2>
          <p className="text-sm text-slate-500 mt-2">
            Enter your credentials to access the AI workspace.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" data-testid="login-form">
            <div className="space-y-2">
              <Label htmlFor="role">Login as</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger data-testid="login-role-select" id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal">Legal Officer</SelectItem>
                  <SelectItem value="acquisition">Acquisition Officer</SelectItem>
                  <SelectItem value="survey">Survey Officer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="user"
                  data-testid="login-username-input"
                  className="pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="officer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pwd">Password</Label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="pwd"
                  type="password"
                  data-testid="login-password-input"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              data-testid="login-submit-btn"
              className="w-full bg-[#0A2540] hover:bg-[#0F365A] text-white h-11"
            >
              Sign in to Workspace
            </Button>

            <div className="text-[11px] text-slate-400 text-center mono">
              Demo credentials are pre-filled · any input is accepted
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-md bg-white/5 border border-white/10 px-3 py-2">
    <div className="text-lg font-display font-bold text-cyan-300">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
  </div>
);
