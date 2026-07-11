import React, { useState, useEffect, useRef } from "react";
import { Terminal, Send, Trash2, RefreshCw, UserCheck, AlertTriangle } from "lucide-react";
import { ActiveAlert, SimLog } from "../types";

// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

export default function SimulatorPanel() {
  const [sender, setSender] = useState<string>("0701112222");
  const [text, setText] = useState<string>("");
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [logs, setLogs] = useState<SimLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  async function fetchSystemState() {
    try {
      const [alertsRes, logsRes] = await Promise.all([
        fetch("/api/sim/active-alerts"),
        fetch("/api/sim/messages")
      ]);
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setActiveAlerts(data);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch simulator state:", err);
    }
  }

  useEffect(() => {
    fetchSystemState();
    const interval = setInterval(fetchSystemState, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleSimulateSms = async (overrideText?: string, overrideSender?: string) => {
    setLoading(true);
    setResponseMsg(null);
    const payloadSender = overrideSender || sender;
    const payloadText = overrideText || text;

    if (!payloadSender.trim() || !payloadText.trim()) {
      setResponseMsg({ type: "error", text: "Fyll i både avsändarnummer och SMS-text." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/incoming-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: payloadSender, text: payloadText })
      });

      const data = await res.json();
      if (res.ok) {
        setResponseMsg({
          type: "success",
          text: data.message || `SMS levererat!`
        });
        if (!overrideText) {
          setText(""); // Clear custom input
        }
        fetchSystemState();
      } else {
        setResponseMsg({
          type: "error",
          text: data.error || "Misslyckades."
        });
      }
    } catch (err: any) {
      setResponseMsg({ type: "error", text: "Nätverksfel vid SMS-simulering." });
    } finally {
      setLoading(false);
    }
  };

  const fillAdminNumber = () => {
    setSender("0700000000"); // Authorized Admin number in server.ts
  };

  const fillPresetNormal = () => {
    setText("[Kortedala Norra] [18:00] [Måltid & Gemenskap] [Middag hos familjen Andersson. Välkomna!] [Hjälpföreningen] [0701112222]");
  };

  const fillPresetFallback = () => {
    setText("Hej! Vi bjuder på fika och trevlig lektion i Lundby ikväll kl 19:30. Kom som du är! Syster Karin");
  };

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl text-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Terminal size={18} className="text-teal-400" />
          <h3 className="font-bold text-sm tracking-wide uppercase text-slate-100 font-mono">
            SMS-Gateway Simulator
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSystemState}
            className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-all cursor-pointer"
            title="Uppdatera tillstånd"
          >
            <RefreshCw size={14} />
          </button>
          <span className="text-[9px] bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full border border-teal-500/20 font-bold tracking-wider font-mono">
            STATELESS RAM MODE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Mock Controls (Left Column) */}
        <div className="lg:col-span-7 space-y-5 font-mono text-xs">
          <div>
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3">
              1. Simulera inkommande SMS
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1 font-bold">
                  Avsändarnummer
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="t.ex. 0701112222"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 flex-1 focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={fillAdminNumber}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-800 transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck size={12} className="text-teal-400" />
                    Admin-nr
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1 font-bold">
                  SMS Textmeddelande
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="Skriv t.ex. [Område] [Tid] [Kategori] [Text] [Arrangör] [Kontakt]..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono resize-none leading-relaxed"
                />
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  <button
                    type="button"
                    onClick={fillPresetNormal}
                    className="text-[10px] text-teal-400 hover:text-teal-300 hover:underline cursor-pointer"
                  >
                    + Mall-SMS (Strukturerat)
                  </button>
                  <button
                    type="button"
                    onClick={fillPresetFallback}
                    className="text-[10px] text-teal-400 hover:text-teal-300 hover:underline cursor-pointer"
                  >
                    + Råtext-SMS (AI Fallback)
                  </button>
                </div>
              </div>

              {responseMsg && (
                <div className={`p-3 rounded-xl border text-[11px] leading-relaxed font-medium ${
                  responseMsg.type === "success" 
                    ? "bg-emerald-950/20 border-emerald-900 text-emerald-400" 
                    : "bg-rose-950/20 border-rose-900 text-rose-400"
                }`}>
                  {responseMsg.text}
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSimulateSms()}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
              >
                <Send size={12} />
                {loading ? "Skickar..." : "Skicka simulerat SMS till gateway"}
              </button>
            </div>
          </div>

          {/* Active RAM list */}
          <div className="border-t border-slate-900 pt-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Mottagna inbjudningar i RAM-minnet
            </h4>

            {activeAlerts.length === 0 ? (
              <p className="text-slate-600 italic text-[11px]">
                Inga aktiva inbjudningar finns i RAM för tillfället. Skicka ett SMS ovan!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-teal-400">ID: {alert.id}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{alert.area}</span>
                        {alert.isFull && (
                          <span className="bg-rose-950 text-rose-400 border border-rose-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                            FULLBOKAD
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        "{alert.scrubbedText}"
                      </p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSimulateSms(`FULL ${alert.id}`, sender)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 hover:text-amber-300 rounded-lg transition-all cursor-pointer"
                        title="Simulera Fullbokad-kommando"
                      >
                        <AlertTriangle size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateSms(`DEL ${alert.id}`, sender)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                        title="Simulera Radera-kommando"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Smartphone Mockup with Chat Bubbles (Right Column) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[290px] border-[10px] border-slate-800 rounded-[3rem] bg-black shadow-2xl relative flex flex-col overflow-hidden h-[460px] select-none">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-950 rounded-full absolute right-4"></div>
            </div>

            {/* Smartphone screen header (iOS style) */}
            <div className="bg-[#121214]/90 border-b border-white/5 pt-9 pb-3 px-4 text-center shrink-0 backdrop-blur-md">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-teal-400">
                  ✉
                </div>
                <span className="text-[11px] font-bold text-slate-100 font-sans tracking-wide">
                  Missions-Gateway
                </span>
                <span className="text-[8px] text-teal-400 font-semibold font-mono tracking-wider uppercase">
                  ● Aktiv Tråd
                </span>
              </div>
            </div>

            {/* SMS bubble message stream (iMessage style) */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 flex flex-col bg-black font-sans text-xs leading-relaxed">
              {logs.length === 0 ? (
                <div className="my-auto text-center text-slate-500 px-4 space-y-1">
                  <div className="text-xs font-bold text-slate-400">Inga SMS ännu</div>
                  <p className="text-[10px] leading-normal text-slate-600">
                    Skicka ett SMS från vänster panel för att se konversationen flöda här live.
                  </p>
                </div>
              ) : (
                logs.map((log, idx) => {
                  if (log.type === "incoming") {
                    const isFromAdmin = log.text.startsWith("DEL ") || log.text.startsWith("FULL ");
                    const senderLabel = isFromAdmin ? "Admin" : log.text.match(/\[\d{7,}\]/) ? "Arrangör" : "Missionär";
                    return (
                      <div key={idx} className="self-start max-w-[85%] space-y-0.5">
                        <div className="text-[8px] text-slate-500 pl-2 font-semibold">
                          {senderLabel}
                        </div>
                        <div className="bg-[#1c1c1e] text-[#f4f4f5] p-2.5 rounded-2xl rounded-tl-sm shadow-sm break-words">
                          {log.text}
                        </div>
                      </div>
                    );
                  } else if (log.type === "outgoing") {
                    return (
                      <div key={idx} className="self-end max-w-[85%] space-y-0.5">
                        <div className="text-[8px] text-slate-500 pr-2 text-right font-semibold">
                          Svar
                        </div>
                        <div className="bg-[#0b84ff] text-white p-2.5 rounded-2xl rounded-tr-sm shadow-sm break-words font-medium">
                          {log.text}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="self-center py-1 max-w-[90%] text-center">
                        <span className="bg-[#1c1c1e]/55 text-[8px] text-slate-400 px-2.5 py-1 rounded-full border border-white/5 font-mono tracking-wide uppercase">
                          {log.text}
                        </span>
                      </div>
                    );
                  }
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Smart screen bottom tab bar */}
            <div className="h-6 bg-black flex items-center justify-center shrink-0">
              <div className="w-24 h-1.5 bg-slate-800 rounded-full"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
