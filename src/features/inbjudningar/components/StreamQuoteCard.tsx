import React from "react";

export interface StreamQuoteCardProps {
  className?: string;
}

export function StreamQuoteCard({ className = "" }: StreamQuoteCardProps) {
  return (
    <div className={`py-6 px-4 text-center select-none ${className}`}>
      <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-brand-ink/90 leading-relaxed max-w-xl mx-auto">
        ”När ni är i era medmänniskors tjänst är ni endast i er Guds tjänst.”
      </blockquote>
      <p className="font-mono text-xs sm:text-sm text-brand-ink/50 mt-2 tracking-wide">
        Mosiah 2:17
      </p>
    </div>
  );
}
