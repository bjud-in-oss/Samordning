import React, { useState, useEffect } from "react";
import { Send, ShieldCheck } from "lucide-react";

export default function AdminConsole() {
  const [apiSecret, setApiSecret] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setApiSecret(localStorage.getItem("admin_api_secret") || "");
    setPhoneNumber(localStorage.getItem("admin_phone_number") || "");
  }, []);

  const sendSms = async () => {
    if (!apiSecret || !phoneNumber || !message.trim()) return;
    localStorage.setItem("admin_api_secret", apiSecret);
    localStorage.setItem("admin_phone_number", phoneNumber);

    const res = await fetch("/api/incoming-sms", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-secret": apiSecret 
      },
      body: JSON.stringify({ sender: phoneNumber, text: message })
    });
    
    const data = await res.json();
    setLogs(prev => [`${phoneNumber}: ${message}`, `Gemma: ${data.replyMessage || JSON.stringify(data)}`, ...prev]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-12 font-sans text-brand-ink selection:bg-brand-accent/20">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif italic text-brand-ink font-medium tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="text-brand-accent shrink-0" size={28} />
            Admin SMS Konsol
          </h1>
          <p className="text-brand-ink/60 text-xs font-mono uppercase tracking-wider mt-1.5">
            Simulerat administratörsgränssnitt för testning av SMS-flöden
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 shadow-xs space-y-5">
          <div className="font-mono text-[9px] uppercase tracking-wider text-brand-accent font-semibold">
            Inställningar (Sparas lokalt)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                API Secret
              </label>
              <input 
                type="password"
                className="w-full p-3 bg-white/60 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors font-light text-brand-ink" 
                placeholder="Ange x-api-secret..." 
                value={apiSecret} 
                onChange={e => setApiSecret(e.target.value)} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                Telefonnummer
              </label>
              <input 
                type="text"
                className="w-full p-3 bg-white/60 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors font-light text-brand-ink" 
                placeholder="t.ex. 0736108997" 
                value={phoneNumber} 
                onChange={e => setPhoneNumber(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 shadow-xs space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
              Skriv simulerat SMS-meddelande
            </label>
            <textarea 
              rows={3}
              className="w-full p-4 bg-white/60 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors resize-none leading-relaxed text-brand-ink font-light" 
              placeholder="Svara med t.ex. .ja ID eller skriv en ny inbjudan..." 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
            />
          </div>
          <div className="flex justify-end">
            <button 
              onClick={sendSms} 
              disabled={!apiSecret || !phoneNumber || !message.trim()}
              className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-white bg-brand-accent hover:opacity-90 disabled:opacity-40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Skicka SMS</span>
              <Send size={10} />
            </button>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-brand-accent">
              SMS-historik & Svar
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {logs.map((log, i) => {
                const isUser = !log.startsWith("Gemma:");
                const content = isUser ? log : log.substring(6).trim();
                return (
                  <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm font-light leading-relaxed border ${
                      isUser 
                        ? "bg-brand-accent text-white border-brand-accent/20 rounded-tr-none" 
                        : "bg-brand-paper text-brand-ink border-brand-ink/5 rounded-tl-none font-serif italic font-medium"
                    }`}>
                      <div className="font-mono text-[8px] uppercase tracking-wider opacity-65 mb-1.5">
                        {isUser ? `Du (${phoneNumber})` : "System / AI"}
                      </div>
                      <p className="whitespace-pre-wrap">{content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
