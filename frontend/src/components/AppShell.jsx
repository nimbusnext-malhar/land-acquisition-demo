import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, Bell, Search, ShieldCheck } from "lucide-react";
import * as Icons from "lucide-react";
import { SIDEBAR_NAV } from "../data/mockData";
import { getUser, logout } from "../lib/auth";
import { useActiveProject } from "../lib/projectContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const AppShell = ({ children }) => {
  const user = getUser() || { name: "Demo Officer", role: "Legal Officer" };
  const navigate = useNavigate();
  const { project, projects, setActiveId } = useActiveProject();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" data-testid="app-shell">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0A2540] text-white flex flex-col" data-testid="app-sidebar">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-5 w-5 text-[#0A2540]" />
            </div>
            <div>
              <div className="font-display font-bold leading-tight">MMRDA</div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-cyan-300">Land · Title · AI</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 thin-scroll overflow-y-auto">
          {SIDEBAR_NAV.map((item) => {
            const Icon = Icons[item.icon] || Icons.Circle;
            if (item.disabled) {
              return (
                <div
                  key={item.to}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/40 cursor-not-allowed"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <Badge className="ml-auto bg-white/5 text-white/40 text-[10px] hover:bg-white/5">soon</Badge>
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-200 border border-cyan-400/30"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="rounded-lg bg-cyan-500/10 border border-cyan-400/20 p-3" data-testid="yavi-badge">
            <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Yavi.ai
            </div>
            <p className="text-[11px] text-white/60 mt-1 leading-snug">
              RAG engine indexing 1,284 docs · 165 chunks live
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30" data-testid="app-header">
          <div className="relative w-72 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search projects, survey numbers…"
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-cyan-500"
              data-testid="global-search"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Select value={project.id} onValueChange={setActiveId}>
              <SelectTrigger className="w-[280px] h-9 bg-white border-slate-200" data-testid="project-switcher">
                <div className="flex items-center gap-2 text-left">
                  <Icons.FolderKanban className="h-4 w-4 text-cyan-700 shrink-0" />
                  <div className="min-w-0">
                    <SelectValue />
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} data-testid={`switch-project-${p.id}`}>
                    <div className="flex flex-col leading-tight py-0.5">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="text-[10px] text-slate-500 mono">{p.id} · {p.status}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200" data-testid="env-badge">
              ● Demo Environment
            </Badge>
            <Button variant="ghost" size="icon" aria-label="Notifications" data-testid="notifications-btn">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200" data-testid="user-pill">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-[#0A2540] text-white text-xs">
                  {user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                <div className="text-[11px] text-slate-500">{user.role}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout" data-testid="logout-btn">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
