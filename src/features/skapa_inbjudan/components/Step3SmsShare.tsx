import React from "react";
import { Send, Copy, Check, ArrowRight } from "lucide-react";
import { GATEWAY_NUMBER } from "../domain/constants";

interface Step3SmsShareProps {
  isMobile: boolean;
  smsHref: string;
  qrUrl: string;
  copied: boolean;
  onCopyText: () => void;
  onNext: () => void;
}

export function Step3SmsShare({
  isMobile,
  smsHref,
  qrUrl,
  copied,
  onCopyText,
  onNext
}: Step3SmsShareProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
          <Send size={22} />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
            3. SMS & Delning
          </h3>
          <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
            Skicka till mottagaren
          </span>
        </div>
      </div>

      {isMobile ? (
        <a
          href={smsHref}
          className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 font-bold shadow-md cursor-pointer"
        >
          <Send size={15} />
          <span>Öppna SMS-app för insändning ({GATEWAY_NUMBER})</span>
        </a>
      ) : (
        <div className="p-4 bg-brand-paper/50 rounded-2xl border border-brand-ink/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-xs">
          <img src={qrUrl} alt="SMS QR Code" className="w-28 h-28 rounded-xl border border-brand-ink/10 shrink-0 bg-white p-1" />
          <div className="space-y-1.5 text-xs text-brand-ink/80 font-light leading-relaxed">
            <span className="font-mono text-xs uppercase font-semibold text-brand-ink block">
              Skanna med mobil för att skicka
            </span>
            <p>
              QR-Koden öppnar din SMS-app med din inbjudan i ett färdigt SMS till numret {GATEWAY_NUMBER}.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onCopyText}
        className="w-full py-2.5 bg-brand-paper hover:bg-brand-ink/10 border border-brand-ink/15 text-brand-ink font-mono text-xs uppercase font-semibold tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {copied ? <Check size={14} className="text-emerald-800" /> : <Copy size={14} />}
        <span>{copied ? "Text kopierad till urklipp!" : "Kopiera SMS-text / direktlänk"}</span>
      </button>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Fortsätt till SMS-avstämning</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
