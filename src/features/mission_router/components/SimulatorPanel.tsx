// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";
import { Terminal, Send, Trash2, Check, RefreshCw, UserCheck, AlertTriangle } from "lucide-react";
import { ActiveAlert, SimLog } from "../types";

export default function SimulatorPanel() {
  const [sender, setSender] = useState<string>("0701112222");
  const [text, setText] = useState<string>("");
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [logs, setLogs] = useState<SimLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const handleSimulateSms = async (overrideText?: string, overrideSender?: string) => {
    setLoading(true);
    setResponseMsg(null);
    const payloadSender = overrideSender || sender;
    const payloadText = overrideText || text;

    if (!payloadSender.trim() || !payloadText.trim()) {
      setResponseMsg({ type: "error", text: "Både avsändarnummer och SMS-text måste fyllas i." });
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
          text: data.message || `SMS levererat framgångsrikt! Skapade/ändrade inbjudan.`
        });
        if (!overrideText) {
          setText(""); // Only clear form if it wasn't a direct preset click
        }
        fetchSystemState();
      } else {
        setResponseMsg({
          type: "error",
          text: data.error || "Kunde inte bearbeta SMS:et."
        });
      }
    } catch (err: any) {
      setResponseMsg({ type: "error", text: "Nätverksfel vid sändning av simulerat SMS." });
    } finally {
      setLoading(false);
    }
  };

  const fillAdminNumber = () => {
    setSender("0700000000"); // Standard authorized admin number in server.ts
  };

  const fillExampleSms = () => {
    setText("[Kortedala] [18:00] [Måltid] [Sallad & pizza i församlingshemmet. Ta gärna med en vän!] [Hjälpföreningen] [0701112222]");
  };

  return (
    <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl p-6 font-mono text-xs shadow-2xl space-y-6 text-left">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Terminal size={18} className="text-teal-400" />
          <h3 className="font-bold text-sm tracking-wide uppercase text-slate-200">
            SMS-Gateway Simulator
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSystemState}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Uppdatera konsolens tillstånd"
          >
            <RefreshCw size={14} />
          </button>
          <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full border border-teal-500/20 font-bold tracking-wider uppercase">
            Active RAM Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SMS Form Input (Left Column) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            1. Skicka Simulerat SMS
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">
                Avsändarnummer (Telefonnummer / ID)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="t.ex. 0701112222"
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 flex-1 focus:outline-none focus:border-teal-500 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={fillAdminNumber}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2 rounded-lg transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <UserCheck size={12} className="text-teal-400" />
                  Admin-nr
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">
                SMS Innehåll (Text)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Skriv ett vanligt meddelande, eller kommandon som DEL <id> eller FULL <id>..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono resize-none"
              />
              <button
                type="button"
                onClick={fillExampleSms}
                className="mt-1 text-[10px] text-teal-400 hover:text-teal-300 hover:underline cursor-pointer"
              >
                + Fyll i giltigt exempel-SMS för inbjudan
              </button>
            </div>

            {responseMsg && (
              <div className={`p-3 rounded-xl border text-xs font-medium leading-normal ${
                responseMsg.type === "success" 
                  ? "bg-emerald-950/40 border-emerald-800 text-emerald-300" 
                  : "bg-rose-950/40 border-rose-800 text-rose-300"
              }`}>
                {responseMsg.text}
              </div>
            )}

            <button
              onClick={() => handleSimulateSms()}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={12} />
              {loading ? "Skickar..." : "Simulera Inkommande SMS"}
            </button>
          </div>
        </div>

        {/* Active RAM Announcements (Right Column) */}
        <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
          <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            2. Hantera aktiva RAM-inbjudningar
          </h4>

          {activeAlerts.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center text-slate-500">
              Inga aktiva inbjudningar finns i RAM just nu.
            </div>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {activeAlerts.map(alert => (
                <div key={alert.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-400">ID: {alert.id}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      alert.isFull 
                        ? "bg-rose-950/40 border border-rose-800 text-rose-300" 
                        : "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                    }`}>
                      {alert.isFull ? "FULLBOKAD" : "AKTIV"}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                    "{alert.scrubbedText}"
                  </p>

                  <div className="flex gap-2 pt-1 border-t border-slate-800/60">
                    <button
                      onClick={() => handleSimulateSms(`FULL ${alert.id}`, sender)}
                      className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 hover:text-amber-300 rounded text-[9px] transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <AlertTriangle size={10} />
                      Simulera FULL
                    </button>
                    <button
                      onClick={() => handleSimulateSms(`DEL ${alert.id}`, sender)}
                      className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 hover:text-rose-400 rounded text-[9px] transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Trash2 size={10} />
                      Simulera DEL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Terminal Live logs (Bottom section) */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Loggström (Mottagna SMS och systemhändelser)
          </span>
          <span className="text-[9px] text-slate-500">Uppdateras live</span>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 h-44 overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">Inga simuleringsloggar tillgängliga än.</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex gap-2 items-start hover:bg-slate-850/60 py-0.5 rounded transition-all">
                <span className="text-slate-600 shrink-0 select-none">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span className={`px-1.5 rounded text-[8px] font-bold tracking-wider shrink-0 select-none uppercase ${
                  log.type === "incoming" 
                    ? "bg-blue-950/60 text-blue-300 border border-blue-800" 
                    : log.type === "outgoing"
                    ? "bg-amber-950/60 text-amber-300 border border-amber-800"
                    : "bg-teal-950/60 text-teal-300 border border-teal-800"
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-300 whitespace-pre-wrap break-words flex-1">
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
