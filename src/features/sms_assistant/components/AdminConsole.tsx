// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/sms_assistant/4_Produce]
import React, { useState, useEffect, useRef } from "react";
import { Smartphone, Send, Lock, User, Sparkles, AlertCircle, Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "gemma" | "system_error" | "system_info";
  text: string;
  timestamp: Date;
}

export default function AdminConsole() {
  const [apiSecret, setApiSecret] = useState<string>(() => {
    return localStorage.getItem("sms_assistant_api_secret") || "";
  });
  const [senderNum, setSenderNum] = useState<string>(() => {
    return localStorage.getItem("sms_assistant_sender_num") || "0736108997";
  });
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("sms_assistant_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "welcome",
        sender: "gemma",
        text: "Hej! Jag är Gemma, din digitala support-AI. Här kan du testa alla SMS-kommandon och ställa frågor direkt till mig.",
        timestamp: new Date()
      }
    ];
  });

  const [isSending, setIsSending] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("sms_assistant_api_secret", apiSecret);
  }, [apiSecret]);

  useEffect(() => {
    localStorage.setItem("sms_assistant_sender_num", senderNum);
  }, [senderNum]);

  useEffect(() => {
    localStorage.setItem("sms_assistant_chat_history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMsgText = inputMessage;
    setInputMessage("");

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "user",
      text: userMsgText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch("/api/incoming-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Secret": apiSecret
        },
        body: JSON.stringify({
          sender: senderNum,
          text: userMsgText
        })
      });

      if (!response.ok) {
        let errorText = `Felkod ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error) errorText = errData.error;
        } catch (_) {}
        
        throw new Error(errorText);
      }

      const data = await response.json();

      if (data.replyMessage) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            sender: "gemma",
            text: data.replyMessage,
            timestamp: new Date()
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            sender: "system_info",
            text: "Servern tog emot meddelandet men genererade inget SMS-svar.",
            timestamp: new Date()
          }
        ]);
      }
    } catch (err: any) {
      console.error("SMS simulation send failed:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: "system_error",
          text: `Kunde inte skicka: ${err.message || "Okänt nätverksfel"}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Vill du verkligen rensa hela chatthistoriken?")) {
      const initial = [
        {
          id: "welcome",
          sender: "gemma",
          text: "Hej! Jag är Gemma, din digitala support-AI. Här kan du testa alla SMS-kommandon och ställa frågor direkt till mig.",
          timestamp: new Date()
        }
      ] as ChatMessage[];
      setMessages(initial);
    }
  };

  return (
    <div id="admin-sms-console" className="min-h-screen bg-brand-sand font-sans flex flex-col max-w-lg mx-auto border-x border-brand-ink/10 shadow-xl bg-white">
      {/* Header */}
      <header className="bg-brand-ink text-white px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { window.location.href = "/"; }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Gå tillbaka till anslagstavlan"
          >
            <ArrowLeft className="w-5 h-5 text-brand-sand" />
          </button>
          <div>
            <h1 className="font-serif italic text-lg font-medium tracking-tight flex items-center gap-1.5">
              Gemma SMS-Simulator <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
            </h1>
            <p className="text-[10px] font-mono text-brand-sand/60">Interaktiv administratörskonsol</p>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="p-1.5 rounded-lg hover:bg-brand-error/20 hover:text-brand-error text-brand-sand/60 transition-colors"
          title="Rensa historik"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      {/* Config Form (Collapsible) */}
      <section className="bg-brand-sand/50 border-b border-brand-ink/5 px-4 py-3 space-y-3 transition-all duration-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-brand-ink/60 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-brand-accent" /> Gateway-Inställningar
          </h2>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-[10px] font-mono text-brand-accent hover:underline"
          >
            {showSettings ? "Dölj inställningar" : "Visa inställningar"}
          </button>
        </div>

        {showSettings && (
          <div className="grid grid-cols-2 gap-3 pt-1 animate-in fade-in duration-200">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-brand-ink/70 flex items-center gap-1">
                <Lock className="w-3 h-3 text-brand-ink/40" /> API Secret (X-API-Secret)
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Skriv hemlig API-nyckel"
                className="w-full text-xs font-mono bg-white border border-brand-ink/10 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-brand-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-brand-ink/70 flex items-center gap-1">
                <User className="w-3 h-3 text-brand-ink/40" /> Avsändarnummer (SMS)
              </label>
              <input
                type="text"
                value={senderNum}
                onChange={(e) => setSenderNum(e.target.value)}
                placeholder="Ex. 0736108997"
                className="w-full text-xs font-mono bg-white border border-brand-ink/10 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-brand-accent"
              />
            </div>
          </div>
        )}
      </section>

      {/* Chat Messages Log */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[300px]">
        {messages.map((msg) => {
          if (msg.sender === "user") {
            return (
              <div key={msg.id} className="flex justify-end animate-in slide-in-from-right-2 duration-200">
                <div className="max-w-[85%] space-y-1">
                  <div className="bg-brand-ink text-white px-3.5 py-2.5 rounded-2xl rounded-tr-xs text-sm leading-relaxed shadow-xs">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className="flex justify-end text-[9px] font-mono text-brand-ink/40">
                    Sänt av {senderNum} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          } else if (msg.sender === "gemma") {
            return (
              <div key={msg.id} className="flex justify-start animate-in slide-in-from-left-2 duration-200">
                <div className="max-w-[85%] space-y-1">
                  <div className="bg-brand-sand border border-brand-ink/5 text-brand-ink px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-sm leading-relaxed shadow-xs">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className="flex justify-start text-[9px] font-mono text-brand-accent font-medium flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Gemma (Support-AI) · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          } else if (msg.sender === "system_error") {
            return (
              <div key={msg.id} className="flex justify-center animate-in zoom-in-95 duration-200">
                <div className="bg-brand-error/10 border border-brand-error/20 rounded-xl px-4 py-2.5 max-w-[90%] flex items-start gap-2.5 text-brand-error">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Gateway-fel</p>
                    <p className="text-[11px] font-mono leading-tight">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          } else {
            // system_info
            return (
              <div key={msg.id} className="flex justify-center animate-in zoom-in-95 duration-200">
                <div className="bg-brand-ocean/10 border border-brand-ocean/20 rounded-xl px-4 py-2.5 max-w-[90%] flex items-start gap-2.5 text-brand-ocean">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Systeminfo</p>
                    <p className="text-[11px] leading-tight">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form Footer */}
      <footer className="border-t border-brand-ink/5 bg-white p-3 sticky bottom-0 z-40">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            placeholder={isSending ? "Bearbetar..." : "Skriv kommando eller fråga (t.ex. # Hur rensas utkast?)..."}
            className="flex-1 bg-brand-sand/40 border border-brand-ink/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-brand-accent focus:bg-white transition-all placeholder:text-brand-ink/40"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="bg-brand-ink hover:bg-brand-accent text-white disabled:bg-brand-ink/20 disabled:text-brand-ink/40 p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0"
            title="Skicka SMS"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[9px] font-mono text-center text-brand-ink/30 mt-1.5">
          Skriv utan prefix för att bygga ett utkast, starta med # för AI-support/frågor eller strikta kommandon.
        </p>
      </footer>
    </div>
  );
}
