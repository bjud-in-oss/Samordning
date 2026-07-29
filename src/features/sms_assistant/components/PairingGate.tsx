import React from "react";
import { ShieldCheck, ArrowLeft, Smartphone, RefreshCw, KeyRound } from "lucide-react";

interface PairingGateProps {
  deviceToken: string;
  smsHref: string;
  qrUrl: string;
  onDirectLoopbackPair: () => void;
  onCheckPairingStatus: () => void;
}

export function PairingGate({
  deviceToken,
  smsHref,
  qrUrl,
  onDirectLoopbackPair,
  onCheckPairingStatus
}: PairingGateProps) {
  return (
    <div className="h-[100dvh] flex flex-col bg-[#F0F2F5] font-sans text-brand-ink">
      <div className="bg-white px-4 py-3 border-b border-brand-ink/10 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.href = "/"}
            className="p-2 -ml-2 text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="text-xs font-mono uppercase tracking-wider">Webbapp</span>
          </button>
          <div className="flex items-center gap-2">
            <KeyRound className="text-brand-accent shrink-0" size={22} />
            <h1 className="text-lg font-serif italic text-brand-ink font-medium tracking-tight">
              Anonym Enhetsparning
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-brand-ink/10 shadow-md max-w-md w-full space-y-5 text-center">
          <div className="w-12 h-12 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto text-brand-accent">
            <ShieldCheck size={26} />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif italic text-xl font-medium text-brand-ink">Enheten saknar godkännande</h2>
            <p className="text-xs text-brand-ink/70 leading-relaxed font-light">
              PIN-koder har ersatts av anonym enhetsparning. Skicka ett verifierings-SMS från din administratörsmobil för att låsa upp denna enhet.
            </p>
          </div>

          <div className="p-3 bg-brand-bg rounded-xl border border-brand-ink/5 font-mono text-[11px] text-brand-ink/80 flex justify-between items-center">
            <span className="text-brand-ink/50 uppercase text-[9px]">Token ID:</span>
            <span className="font-semibold text-brand-accent">{deviceToken.substring(0, 16)}...</span>
          </div>

          <div className="space-y-3">
            <a 
              href={smsHref}
              className="w-full py-3 bg-brand-accent hover:opacity-90 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Smartphone size={16} />
              <span>Verifiera enhet via SMS (#PAIR)</span>
            </a>

            <div className="p-4 bg-brand-bg rounded-xl border border-brand-ink/5 flex flex-col items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-ink/60">
                Dator / Stationär enhet? Skanna med mobil:
              </span>
              <img src={qrUrl} alt="QR för #PAIR SMS" className="w-36 h-36 border border-brand-ink/10 rounded-lg bg-white p-1" />
              <span className="text-[10px] text-brand-ink/50 font-mono">Skickar: #PAIR {deviceToken.substring(0, 10)}...</span>
            </div>

            <button
              onClick={onDirectLoopbackPair}
              className="w-full py-2 bg-brand-bg hover:bg-brand-ink/5 border border-brand-ink/10 text-brand-ink/70 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Direktaktivera lokal enhet (Gateway / Dev)
            </button>

            <button
              onClick={onCheckPairingStatus}
              className="w-full py-1.5 text-brand-accent font-mono text-[11px] hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Uppdatera status</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
