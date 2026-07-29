import React from "react";

interface AdminLogsAreaProps {
  logs: { isUser: boolean; text: string }[];
  phoneNumber: string;
}

export function AdminLogsArea({ logs, phoneNumber }: AdminLogsAreaProps) {
  return (
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
  );
}
