// [src/features/sms_assistant/components/AdminLogsArea.tsx] - Enhanced Admin Log Buffer with Filtering

import React, { useState, useMemo } from "react";
import { Search, Trash2, Filter, AlertTriangle, Info, AlertCircle, X } from "lucide-react";
import { LogEntry, LogLevel, classifyLogLevel, filterLogs } from "../domain/adminLogic";

interface AdminLogsAreaProps {
  logs: LogEntry[];
  phoneNumber: string;
  onClearLogs?: () => void;
}

export function AdminLogsArea({ logs, phoneNumber, onClearLogs }: AdminLogsAreaProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel>("ALLA");

  // Local clear override if parent doesn't handle clear or for quick local reset
  const [localCleared, setLocalCleared] = useState(false);

  const activeLogs = localCleared ? [] : logs;

  const counts = useMemo(() => {
    let info = 0;
    let warn = 0;
    let error = 0;
    activeLogs.forEach(log => {
      const lvl = classifyLogLevel(log);
      if (lvl === "INFO") info++;
      else if (lvl === "WARN") warn++;
      else if (lvl === "ERROR") error++;
    });
    return {
      ALLA: activeLogs.length,
      INFO: info,
      WARN: warn,
      ERROR: error
    };
  }, [activeLogs]);

  const filtered = useMemo(() => {
    return filterLogs(activeLogs, searchQuery, levelFilter);
  }, [activeLogs, searchQuery, levelFilter]);

  const handleClear = () => {
    setLocalCleared(true);
    if (onClearLogs) onClearLogs();
  };

  // If new logs come in after local clear, reset local cleared flag
  if (localCleared && logs.length > 0 && activeLogs.length === 0) {
    setLocalCleared(false);
  }

  const getLevelBadge = (level: "INFO" | "WARN" | "ERROR") => {
    switch (level) {
      case "ERROR":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle size={10} />
            ERROR
          </span>
        );
      case "WARN":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle size={10} />
            WARN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Info size={10} />
            INFO
          </span>
        );
    }
  };

  const getCardStyle = (log: LogEntry, level: "INFO" | "WARN" | "ERROR") => {
    if (log.isUser) {
      return "bg-brand-paper text-brand-ink rounded-tr-none border border-brand-accent/20";
    }
    switch (level) {
      case "ERROR":
        return "bg-rose-50/90 text-rose-950 rounded-tl-none border border-rose-200";
      case "WARN":
        return "bg-amber-50/90 text-amber-950 rounded-tl-none border border-amber-200";
      default:
        return "bg-white text-brand-ink rounded-tl-none border border-brand-ink/10";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-brand-ink/10 space-y-3">
      {/* Log Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-b border-brand-ink/5 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="text-brand-accent shrink-0" size={18} />
          <h3 className="font-semibold text-xs tracking-wider uppercase">System & Händelseloggar</h3>
          <span className="text-[10px] font-mono bg-brand-bg px-2 py-0.5 rounded-full border border-brand-ink/10">
            {filtered.length} / {activeLogs.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeLogs.length > 0 && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Töm loggbufferten"
            >
              <Trash2 size={13} />
              <span>Rensa loggar</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Sök i loggar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 bg-brand-bg rounded-lg border border-brand-ink/10 text-xs font-mono focus:outline-none focus:border-brand-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {(["ALLA", "INFO", "WARN", "ERROR"] as LogLevel[]).map(lvl => {
            const isActive = levelFilter === lvl;
            const count = counts[lvl];
            return (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-brand-accent text-white border-brand-accent font-bold"
                    : "bg-brand-bg text-slate-600 border-brand-ink/10 hover:bg-slate-100"
                }`}
              >
                <span>{lvl}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs Display List */}
      <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2 pt-1">
        {filtered.map((log, i) => {
          const level = classifyLogLevel(log);
          return (
            <div key={i} className={`flex ${log.isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-150`}>
              <div className={`max-w-[90%] rounded-2xl px-3.5 py-2 text-xs font-light leading-relaxed shadow-2xs ${getCardStyle(log, level)}`}>
                <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-wider opacity-75 mb-1 pb-1 border-b border-black/5">
                  <span className="font-semibold">
                    {log.isUser ? `Du (${phoneNumber})` : "System / AI"}
                  </span>
                  <div className="flex items-center gap-1">
                    {log.timestamp && <span>{log.timestamp}</span>}
                    {!log.isUser && getLevelBadge(level)}
                  </div>
                </div>
                <p className="whitespace-pre-wrap font-mono text-[11px] leading-snug">{log.text}</p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center text-brand-ink/40 text-xs font-mono py-8 space-y-1">
            {activeLogs.length === 0 ? (
              <>
                <p className="uppercase tracking-widest font-semibold">Loggbufferten är tom</p>
                <p className="text-[10px] text-brand-ink/30 font-sans normal-case">Skicka ett meddelande i konsolen nedan för att starta tester.</p>
              </>
            ) : (
              <>
                <p className="uppercase tracking-widest font-semibold">Inga loggar matchar din filtrering</p>
                <p className="text-[10px] text-brand-ink/30 font-sans normal-case">Prova att rensa sökfältet eller ändra nivåfilter.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
