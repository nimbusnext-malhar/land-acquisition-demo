import React, { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import AppShell from "../components/AppShell";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { SUGGESTED_PROMPTS } from "../data/mockData";
import { useProjectData } from "../lib/projectContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Scripted fallback when the live LLM is unreachable
function findScriptedResponse(query, chatResponses, fallback) {
  const q = query.toLowerCase();
  for (const r of chatResponses) {
    if (r.keys.some((k) => q.includes(k))) return r;
  }
  return fallback;
}

async function callLiveLLM(projectId, message) {
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_id: projectId, message }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM API ${res.status}: ${err.slice(0, 120)}`);
  }
  return res.json();
}

export default function Chatbot() {
  const { project, data } = useProjectData();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const scrollRef = useRef(null);

  // Greet (and reset history) whenever the active project changes
  useEffect(() => {
    setMessages([{
      role: "assistant",
      text: `Hi — I'm Yavi.ai, indexed on ${data.documents.length} documents for ${project.name} (${project.id}). Ask me anything — ownership, encumbrances, mutation history, why the title is ${project.status.toLowerCase()}, even free-form questions.`,
      confidence: null,
      citations: [],
      mode: liveMode ? "live" : "scripted",
    }]);
    setInput("");
    setTyping(false);
  }, [project.id, project.name, project.status, data.documents.length, liveMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = async (text) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);

    if (liveMode) {
      try {
        const r = await callLiveLLM(project.id, t);
        setMessages((m) => [...m, {
          role: "assistant",
          text: r.answer,
          confidence: r.confidence,
          citations: r.citations || [],
          mode: "live",
          model: r.model,
        }]);
        setTyping(false);
        return;
      } catch (err) {
        // Live LLM failed — surface a small note, then fall back to scripted
        setMessages((m) => [...m, {
          role: "assistant",
          text: `_Live LLM unavailable (${err.message}). Falling back to scripted response._`,
          confidence: null,
          citations: [],
          mode: "system",
        }]);
        // continue to scripted
      }
    }

    // Scripted path (also used as fallback when live fails)
    setTimeout(() => {
      const r = findScriptedResponse(t, data.chatResponses, data.fallbackChat);
      setMessages((m) => [...m, {
        role: "assistant",
        text: r.answer,
        confidence: r.confidence,
        citations: r.citations || [],
        mode: "scripted",
      }]);
      setTyping(false);
    }, 700);
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-4rem)]" data-testid="chatbot-page">
        {/* Chat area */}
        <Card className="lg:col-span-8 bg-white border-slate-200 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-[#0B1521] border border-cyan-400/40 flex items-center justify-center ai-glow">
                <Icons.Sparkles className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <div className="font-display font-semibold text-slate-900">Yavi.ai Title Assistant</div>
                <div className="text-[11px] text-slate-500 mono">
                  RAG · {project.chunksCount} chunks · {data.documents.length} docs ·{" "}
                  {liveMode ? <span className="text-cyan-700 font-semibold">Claude Sonnet 4.5</span> : <span>scripted</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiveMode((v) => !v)}
                data-testid="live-mode-toggle"
                aria-label={`Toggle ${liveMode ? "live" : "scripted"} mode`}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors font-semibold ${
                  liveMode
                    ? "bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {liveMode ? <><Icons.Zap className="h-3 w-3 inline mr-1" /> Live LLM</> : <>Scripted</>}
              </button>
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> online
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1" data-testid="chat-scroll">
            <div ref={scrollRef} className="px-6 py-6 space-y-5 overflow-y-auto thin-scroll" style={{ maxHeight: "calc(100vh - 22rem)" }}>
              {messages.map((m, i) => (
                <Message key={`${m.role}-${i}-${m.text.slice(0, 20)}`} m={m} />
              ))}
              {typing && (
                <div className="flex items-start gap-3" data-testid="typing-indicator">
                  <div className="h-8 w-8 rounded-md bg-[#0B1521] border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <Icons.Sparkles className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 typing-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 typing-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 typing-dot" />
                    <span className="text-xs text-slate-500 ml-2">
                      {liveMode ? "Claude Sonnet 4.5 reasoning over Yavi.ai corpus…" : "Retrieving from Yavi.ai…"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested prompts */}
          <div className="px-6 pb-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3" data-testid="suggested-prompts">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                aria-label={`Send suggested prompt: ${p}`}
                className="text-[11px] px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-800 transition-colors"
                data-testid={`prompt-${p.slice(0, 18).toLowerCase().replace(/\s+/g, "-")}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            className="px-6 pb-6 pt-2 flex items-center gap-3"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about title status, encumbrance, mutation history…"
              className="flex-1 h-11"
              data-testid="chat-input"
            />
            <Button type="submit" aria-label="Send message" className="bg-[#0A2540] hover:bg-[#0F365A] h-11" data-testid="chat-send-btn">
              <Icons.SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        {/* Side: sources */}
        <Card className="lg:col-span-4 bg-white border-slate-200 overflow-hidden" data-testid="sources-card">
          <div className="px-5 py-4 border-b border-slate-200">
            <div className="font-display font-semibold text-slate-900">Indexed Sources</div>
            <div className="text-[11px] text-slate-500 mono">{project.id} · Yavi.ai semantic store</div>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-3">
              {data.documents.map((d) => (
                <div key={d.id} className="rounded-md border border-slate-200 p-3" data-testid={`source-${d.id}`}>
                  <div className="flex items-center gap-2">
                    <Icons.FileText className="h-4 w-4 text-slate-500" />
                    <div className="text-sm font-semibold text-slate-800 truncate">{d.name}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 mono">
                    {d.chunks} chunks · conf {d.confidence}%
                  </div>
                </div>
              ))}
              <div className="ai-panel border-cyan-400/30 rounded-md p-4 mt-3">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-[0.18em] uppercase">
                  <Icons.Sparkles className="h-3.5 w-3.5" /> Retrieval Engine
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 text-[11px] mono text-cyan-100/80">
                  <div><div className="text-cyan-300">model</div>yavi-rag v2.4</div>
                  <div><div className="text-cyan-300">embed</div>768-dim</div>
                  <div><div className="text-cyan-300">chunks</div>{project.chunksCount}</div>
                  <div><div className="text-cyan-300">conf</div>{project.confidence.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </AppShell>
  );
}

const Message = ({ m }) => {
  if (m.role === "user") {
    return (
      <div className="flex items-start gap-3 justify-end fade-in-up">
        <div className="bg-[#0A2540] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] text-sm leading-relaxed shadow-sm">
          {m.text}
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <Icons.User className="h-4 w-4 text-slate-600" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 fade-in-up">
      <div className="h-8 w-8 rounded-md bg-[#0B1521] border border-cyan-400/40 flex items-center justify-center shrink-0">
        <Icons.Sparkles className="h-4 w-4 text-cyan-300" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-slate-800">
          {m.text.split("**").map((part, i) =>
            i % 2 ? <strong key={i} className="font-semibold text-slate-900">{part}</strong> : <span key={i}>{part}</span>
          )}
        </div>
        {(m.confidence || (m.citations && m.citations.length > 0) || m.mode === "live") && (
          <div className="mt-2 flex items-center flex-wrap gap-2">
            {m.mode === "live" && (
              <Badge className="bg-cyan-950 text-cyan-300 hover:bg-cyan-950 border border-cyan-700 text-[10px] gap-1">
                <Icons.Zap className="h-3 w-3" /> Live · Claude Sonnet 4.5
              </Badge>
            )}
            {m.mode === "scripted" && (
              <Badge variant="outline" className="text-[10px] gap-1 bg-slate-50">
                <Icons.FileText className="h-3 w-3" /> Scripted
              </Badge>
            )}
            {m.confidence != null && (
              <Badge className="bg-cyan-950 text-cyan-300 hover:bg-cyan-950 border border-cyan-700 text-[10px] gap-1">
                <Icons.Sparkles className="h-3 w-3" /> conf {m.confidence}%
              </Badge>
            )}
            {m.citations?.map((c, j) => (
              <Badge key={j} variant="outline" className="text-[10px] gap-1 bg-white">
                <Icons.Quote className="h-3 w-3" /> {c.doc} · {c.chunk}
              </Badge>
            ))}
          </div>
        )}
        {m.confidence != null && m.citations?.length > 0 && (
          <div className="mt-2 rounded-md border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Cited snippet</div>
            <div className="text-xs text-slate-700 mono leading-relaxed">"{m.citations[0].line}"</div>
            <div className="mt-2 text-[10px] text-slate-500">Response generated from Yavi.ai semantic retrieval.</div>
          </div>
        )}
      </div>
    </div>
  );
};
