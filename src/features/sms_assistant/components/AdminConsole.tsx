// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";
import { Send, ShieldCheck, ArrowLeft, Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function AdminConsole() {
  const [apiSecret, setApiSecret] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<{isUser: boolean, text: string}[]>([]);

  useEffect(() => {
    setApiSecret(localStorage.getItem("admin_api_secret") || "");
    setPhoneNumber(localStorage.getItem("admin_phone_number") || "");
  }, []);

  const sendSms = async (customText?: string) => {
    const textToSend = customText || message.trim();
    if (!apiSecret || !phoneNumber || !textToSend) return;
    
    localStorage.setItem("admin_api_secret", apiSecret);
    localStorage.setItem("admin_phone_number", phoneNumber);

    setLogs(prev => [{ isUser: true, text: textToSend }, ...prev]);
    if (!customText) setMessage("");

    try {
      const res = await fetch("/api/incoming-sms", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-secret": apiSecret 
        },
        body: JSON.stringify({ sender: phoneNumber, text: textToSend })
      });
      
      const data = await res.json();
      setLogs(prev => [{ isUser: false, text: data.replyMessage || JSON.stringify(data) }, ...prev]);
    } catch (e: any) {
      setLogs(prev => [{ isUser: false, text: "Nätverksfel eller ogiltigt svar." }, ...prev]);
    }
  };

  const insertTemplate = () => {
    setMessage("Tid: Idag kl 18:00\nMötesplats: Kortedala Torg\nAktivitet: Gemensam fika och samtal om tro\nBjud in från områden: Kortedala\nMålgrupp: Alla");
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#F0F2F5] font-sans text-brand-ink">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-brand-ink/10 flex items-center justify-between shadow-xs shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.href = "/"}
            className="p-2 -ml-2 text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">Webbapp</span>
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand-accent shrink-0" size={24} />
            <div>
              <h1 className="text-lg font-serif italic text-brand-ink font-medium tracking-tight leading-none">
                SMS Konsol
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <button
            onClick={() => sendSms(".status")}
            className="px-2.5 py-1 bg-brand-bg hover:bg-brand-ink/5 border border-brand-ink/10 rounded-lg text-brand-ink/80 transition-colors cursor-pointer"
          >
            .status
          </button>
          <button
            onClick={() => sendSms(".mall")}
            className="px-2.5 py-1 bg-brand-bg hover:bg-brand-ink/5 border border-brand-ink/10 rounded-lg text-brand-ink/80 transition-colors cursor-pointer"
          >
            .mall
          </button>
          <button
            onClick={insertTemplate}
            className="px-2.5 py-1 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <FileText size={12} />
            <span>Infoga 5-raders mall</span>
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white px-4 py-2.5 border-b border-brand-ink/5 shrink-0 z-10 shadow-xs flex gap-3 text-xs">
         <input 
            type="password"
            className="w-1/2 p-2 bg-brand-bg rounded-lg border border-brand-ink/10 focus:border-brand-accent focus:outline-none transition-colors font-mono text-xs" 
            placeholder="API Secret (t.ex. samordning-secret-2026)" 
            value={apiSecret} 
            onChange={e => setApiSecret(e.target.value)} 
          />
          <input 
            type="text"
            className="w-1/2 p-2 bg-brand-bg rounded-lg border border-brand-ink/10 focus:border-brand-accent focus:outline-none transition-colors font-mono text-xs" 
            placeholder="Ditt nummer (+46...)" 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)} 
          />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col-reverse gap-4">
        {logs.map((log, i) => (
          <div key={i} className={`flex ${log.isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-light leading-relaxed shadow-xs ${
              log.isUser 
                ? "bg-[#D9FDD3] text-brand-ink rounded-tr-none font-mono text-xs" 
                : "bg-white text-brand-ink rounded-tl-none border border-brand-ink/5 font-mono text-xs"
            }`}>
              <div className="font-mono text-[8px] uppercase tracking-wider opacity-50 mb-1">
                {log.isUser ? `Du (${phoneNumber})` : "System / AI"}
              </div>
              <p className="whitespace-pre-wrap">{log.text}</p>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-brand-ink/40 text-xs font-mono uppercase tracking-widest my-auto pb-12 space-y-2">
            <p>Skicka ett meddelande för att starta simulerat test</p>
            <p className="text-[10px] text-brand-ink/30 font-sans normal-case">Tips: Använd snabbknappen "Infoga 5-raders mall" ovan för att testa universell inbjudningsmall.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#F0F2F5] p-3 shrink-0 flex gap-2">
        <textarea 
          rows={2}
          className="flex-1 p-3 bg-white rounded-2xl border-none focus:ring-0 shadow-xs resize-none text-xs font-mono leading-relaxed" 
          placeholder="Skriv simulerat SMS..." 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendSms();
            }
          }}
        />
        <button 
          onClick={() => sendSms()} 
          disabled={!apiSecret || !phoneNumber || !message.trim()}
          className="w-11 h-11 bg-brand-accent text-white rounded-full flex items-center justify-center shrink-0 shadow-xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed self-end cursor-pointer"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
