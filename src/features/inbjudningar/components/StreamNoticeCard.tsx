import React from "react";
import { ExternalLink } from "lucide-react";
import { ActiveAlert } from "../../mission_router";

interface StreamNoticeCardProps {
  key?: string;
  item: ActiveAlert;
  onSelectAlert: (id: string) => void;
}

export function StreamNoticeCard({ item, onSelectAlert }: StreamNoticeCardProps) {
  return (
    <div
      onClick={() => onSelectAlert(item.id)}
      className="bg-white rounded-2xl p-6 border border-brand-ink/5 hover:border-brand-accent/30 transition-all shadow-xs hover:shadow-md cursor-pointer space-y-3 group relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 bg-emerald-800 text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-tr-2xl rounded-bl-xl shadow-2xs">
        {item.category || "Vara en vän"}
      </div>

      <div className="flex items-center justify-[flex-end] pt-1">
        <span className="font-mono text-[10px] text-brand-ink/50 font-light pr-24">
          {item.time || "Fast tid ej angiven"}
        </span>
      </div>

      <div>
        <h3 className="font-serif italic text-xl text-brand-ink font-medium group-hover:text-brand-accent transition-colors">
          {item.area}
        </h3>
        <p className="text-xs text-brand-ink/80 font-light line-clamp-2 mt-1 leading-relaxed">
          {item.scrubbedText || item.rawText}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-brand-ink/5 text-[10px] font-mono text-brand-ink/50 uppercase tracking-wider">
        <span>{item.responsibleParty || "Arrangör"}</span>
        <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-brand-accent font-semibold">
          <span>Visa detaljer</span>
          <ExternalLink size={12} />
        </span>
      </div>
    </div>
  );
}
