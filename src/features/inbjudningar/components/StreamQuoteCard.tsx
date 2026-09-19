import React from "react";

export interface StreamQuoteCardProps {
  className?: string;
}

export function StreamQuoteCard({ className = "" }: StreamQuoteCardProps) {
  return (
    <div className={`py-6 px-4 text-center select-none ${className}`}>
      <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-brand-ink/90 leading-relaxed max-w-xl mx-auto text-balance">
        <span className="text-brand-ink/40">”</span>När ni är i era medmänniskors tjänst är ni endast i er Guds tjänst.<span className="text-brand-ink/40">”</span>
      </blockquote>
      <p className="tracking-widest uppercase text-[11px] text-brand-ink/40 font-mono mt-2">
        Mosiah 2:17
      </p>
    </div>
  );
}
