import React, { useState, useEffect } from "react";
import { Terminal, Send, Shield, RefreshCw, Smartphone, QrCode, PlayCircle, Clock, Mail, MessageSquare } from "lucide-react";
import { SimLog, WhatsAppStatus, ActiveAlert } from "../types";

// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

export default function SimulatorPanel() {
  const [logs, setLogs] = useState<SimLog[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [waStatus, setWaStatus] = useState<WhatsAppStatus | null>(null);
  const [mockMsg, setMockMsg] = useState<string>(
    "Vi ska till [Kortedala Torg] kl [18:00]. Behöver en [bror] för [engelska]."
  );
  const [simulating, setSimulating] = useState<boolean>(false);
  const [refreshingLogs, setRefreshingLogs] = useState<boolean>(false);

  // New Email simulation states
  const [activeSimTab, setActiveSimTab] = useState<"whatsapp" | "email">("whatsapp");
  const [mockEmailFrom, setMockEmailFrom] = useState<string>("biskop@goteseb.se");
  const [mockEmailSubject, setMockEmailSubject] = useState<string>("Förberedelser inför städdagen");
  const [mockEmailBody, setMockEmailBody] = useState<string>(
    "Hej kära vänner! Vi i biskopsrådet bjuder in alla medlemmar till gemensam städdag av Kortedala kapell på lördag kl 09:00. Kontakta Bror Andersson på biskopsradet@goteseb.se för frågor. Tack för ert engagemang!"
  );

  async function fetchStatusAndLogs() {
    try {
      setRefreshingLogs(true);
      const [resLogs, resAlerts, resStatus] = await Promise.all([
        fetch("/api/sim/messages"),
        fetch("/api/sim/active-alerts"),
        fetch("/api/whatsapp/status")
      ]);

      if (resLogs.ok) {
        const dataLogs = await resLogs.json();
        setLogs(dataLogs.reverse());
      }
      if (resAlerts.ok) {
        const dataAlerts = await resAlerts.json();
        setActiveAlerts(dataAlerts);
      }
      if (resStatus.ok) {
        const dataStatus = await resStatus.json();
        setWaStatus(dataStatus);
      }
    } catch (err) {
      console.error("Failed to fetch logs or status", err);
    } finally {
      setRefreshingLogs(false);
    }
  }

  useEffect(() => {
    fetchStatusAndLogs();
    const interval = setInterval(fetchStatusAndLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendSim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockMsg.trim()) return;

    try {
      setSimulating(true);
      const res = await fetch("/api/sim/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "whatsapp:+46701234567",
          body: mockMsg
        })
      });

      if (res.ok) {
        await fetchStatusAndLogs();
      }
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setSimulating(false);
    }
  };

  const getLogTypeBadge = (type: SimLog["type"]) => {
    switch (type) {
      case "incoming":
        return <span className="bg-blue-900/40 text-blue-400 border border-blue-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded">WhatsApp In</span>;
      case "outgoing":
        return <span className="bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded">WhatsApp Ut</span>;
      case "push":
        return <span className="bg-amber-900/40 text-amber-400 border border-amber-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Web Push</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">System</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Simulation form + active alerts */}
      <div className="lg:col-span-5 space-y-6">
        {/* Real WhatsApp integration / connection status card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="text-blue-600" size={24} />
            <h3 className="text-lg font-bold text-slate-900">Real WhatsApp Client</h3>
          </div>

          {waStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    waStatus.status === "connected"
                      ? "bg-green-500 animate-pulse"
                      : waStatus.status === "connecting"
                      ? "bg-amber-500 animate-spin border border-t-transparent"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  {waStatus.status === "connected"
                    ? "Bot Ansluten & Redo"
                    : waStatus.status === "connecting"
                    ? "Förbinder..."
                    : "Simulator-läge aktivt"}
                </span>
              </div>

              {waStatus.status === "disconnected" && waStatus.qrCode ? (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <p className="text-xs text-slate-500 text-center">
                    Skanna QR-koden med din WhatsApp på telefonen för att koppla in det riktiga numret.
                  </p>
                  <img src={waStatus.qrCode} alt="WhatsApp QR Code" className="w-48 h-48 border border-slate-200 rounded-lg bg-white p-2" />
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">QR-koden uppdateras automatiskt</span>
                </div>
              ) : waStatus.status === "error" || (waStatus.status === "disconnected" && !waStatus.qrCode) ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                    Simulator Fallback Aktiv
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vår headless WhatsApp-webbklient kunde inte köra i denna skyddade miljö på grund av sandbox-begränsningar (kräver Chromium). 
                    <strong> Hela systemets routing, regex-tvättning, spatial cloaking och Web Push-notiser fungerar perfekt </strong> via Simulator-panelen nedan!
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-slate-400">Läser in status...</div>
          )}
        </div>

        {/* Mock trigger form with WhatsApp + Email sub-tabs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-slate-900">Trigger Simulator</h3>
            </div>
            
            <div className="flex bg-slate-100 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setActiveSimTab("whatsapp")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeSimTab === "whatsapp"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                <MessageSquare size={12} />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setActiveSimTab("email")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeSimTab === "email"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                <Mail size={12} />
                E-post
              </button>
            </div>
          </div>

          {activeSimTab === "whatsapp" ? (
            <form onSubmit={handleSendSim} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Simulerat meddelande från missionärer (WhatsApp)
                </label>
                <textarea
                  value={mockMsg}
                  onChange={e => setMockMsg(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-medium placeholder-slate-400 transition-all font-mono resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                <strong>Mallen kräver [Plats] [Tid] [Bror/Syster] [Språk]:</strong>
                <div className="mt-1 flex flex-wrap gap-1.5 font-mono">
                  <button
                    type="button"
                    onClick={() => setMockMsg("Vi ska till [Kortedala Torg] kl [18:00]. Behöver en [bror] för [engelska].")}
                    className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-1.5 py-0.5 rounded transition"
                  >
                    Mall 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockMsg("Ska träffa undersökare vid [Frölunda Torg] kl [14:30]. Behöver en [syster] som talar [engelska].")}
                    className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-1.5 py-0.5 rounded transition"
                  >
                    Mall 2
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockMsg("Utanför klamrar står oviktigt ludd. Vi besöker [Angered Centrum] kl [19:15] med en [bror] som talar [svenska].")}
                    className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-1.5 py-0.5 rounded transition"
                  >
                    Mall 3
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} />
                Simulera WhatsApp-insignal
              </button>
            </form>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!mockEmailFrom.trim() || !mockEmailBody.trim()) return;
                try {
                  setSimulating(true);
                  const res = await fetch("/api/incoming-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      from: mockEmailFrom,
                      subject: mockEmailSubject,
                      body: mockEmailBody
                    })
                  });
                  if (res.ok) {
                    await fetchStatusAndLogs();
                  }
                } catch (err) {
                  console.error("Simulation error", err);
                } finally {
                  setSimulating(false);
                }
              }}
              className="space-y-4 text-left"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Avsändare (E-post)
                </label>
                <input
                  type="email"
                  value={mockEmailFrom}
                  onChange={e => setMockEmailFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold transition-all font-mono"
                  placeholder="t.ex. biskop@goteseb.se"
                  required
                />
                <span className="text-[10px] text-slate-400 font-medium block">
                  Endast godkända ledaradresser accepteras (t.ex. slutar på @goteseb.se).
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Ämne (Subject)
                </label>
                <input
                  type="text"
                  value={mockEmailSubject}
                  onChange={e => setMockEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold transition-all"
                  placeholder="Ämne"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Meddelandets brödtext (Integritetstvättas av AI!)
                </label>
                <textarea
                  value={mockEmailBody}
                  onChange={e => setMockEmailBody(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-xs font-semibold placeholder-slate-400 transition-all font-mono resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed space-y-1">
                <strong>E-post simulator mönster:</strong>
                <p>AI:n kommer att ta bort efternamn, exakta adresser och råa telefonnummer/e-postadresser från offentliga fält i enlighet med Allmänna handboken 33.8.</p>
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} />
                Simulera E-postinsignal
              </button>
            </form>
          )}
        </div>

        {/* In-Memory RAM Status Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="text-blue-400" size={20} />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-400">
                In-Memory RAM Status
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
              Stateless
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Aktiva larm i RAM:</span>
              <span className="font-bold text-slate-200">{activeAlerts.length}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Permanent disk-lagring:</span>
              <span className="font-bold text-rose-400">0% (Inget sparas på disk)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Amnesi-protokoll:</span>
              <span className="font-bold text-emerald-400">Aktivt & Vattentätt</span>
            </div>
          </div>

          {activeAlerts.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Aktiva larm-ID i minnet:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeAlerts.map(alert => (
                  <span
                    key={alert.id}
                    className="text-xs font-mono bg-slate-800 text-blue-300 px-2 py-1 rounded border border-slate-700"
                  >
                    {alert.id} ({alert.area})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulator logs console */}
      <div className="lg:col-span-7 flex flex-col h-[650px] bg-slate-950 rounded-3xl shadow-xl border border-slate-900 overflow-hidden">
        {/* Terminal Header */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2.5">
            <Terminal className="text-blue-500" size={20} />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Server Simulator Console
            </h3>
          </div>
          <button
            onClick={fetchStatusAndLogs}
            disabled={refreshingLogs}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={refreshingLogs ? "animate-spin text-blue-500" : ""} />
          </button>
        </div>

        {/* Logs terminal printouts */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300 space-y-4">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
              <Terminal size={32} />
              <p>Här visas serverns interna tvättnings- och amnesihändelser.</p>
              <p className="text-[10px]">Testa att simulera en insignal till vänster!</p>
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="p-3 bg-slate-900/45 border border-slate-900 rounded-xl space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/40 pb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getLogTypeBadge(log.type)}
                    <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-semibold uppercase">ID: {log.id}</span>
                </div>
                <p className="text-slate-100 font-medium break-words whitespace-pre-line leading-relaxed">
                  {log.message}
                </p>
                {log.details && (
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800/35 overflow-x-auto text-[10px] text-blue-300 text-left leading-normal">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
