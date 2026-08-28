import React, { useEffect, useState } from "react";
import { ShieldCheck, ArrowLeft, RefreshCw, Smartphone, Loader2 } from "lucide-react";

interface PairingGateProps {
  token?: string;
  deviceToken?: string;
  smsHref?: string;
  qrUrl?: string;
  phoneNumber?: string;
  onRefresh?: () => void;
  onCheckPairingStatus?: () => void;
  onDirectLoopbackPair?: () => void;
}

export function PairingGate({
  token,
  deviceToken,
  smsHref,
  qrUrl,
  phoneNumber = "0736108997",
  onRefresh,
  onCheckPairingStatus
}: PairingGateProps) {
  const activeToken = token || deviceToken || "";
  const [isPolling, setIsPolling] = useState(true);

  const checkStatus = onRefresh || onCheckPairingStatus || (() => {});

  // Live-polling varannan sekund för att automatiskt låsa upp när administratören skickar SMS:et
  useEffect(() => {
    if (!activeToken) return;
    const interval = setInterval(() => {
      checkStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, [activeToken, checkStatus]);

  const defaultSmsHref = smsHref || `sms:${phoneNumber}?body=${encodeURIComponent(`#PAIR ${activeToken}`)}`;
  const defaultQrUrl = qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(defaultSmsHref)}`;

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans text-brand-ink">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs px-4 py-3 border-b border-brand-ink/10 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.href = "/"}
            className="p-2 -ml-2 text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="text-xs font-mono uppercase tracking-wider">Tillbaka till anslagstavlan</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-ink/10 shadow-sm max-w-md w-full space-y-6 text-center">
          <div className="w-14 h-14 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto text-brand-accent">
            <ShieldCheck size={30} />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-medium text-brand-ink">
              Skanna för att logga in som administratör
            </h1>
            <p className="text-xs text-brand-ink/70 leading-relaxed">
              Skanna QR-koden med din mobilkamera och tryck <strong>Skicka</strong> i ditt SMS-program. Denna skärm låses upp automatiskt så fort SMS:et tagits emot.
            </p>
          </div>

          <div className="p-4 bg-brand-bg rounded-2xl border border-brand-ink/5 flex flex-col items-center gap-3">
            <img 
              src={defaultQrUrl} 
              alt="QR-kod för SMS-parning" 
              className="w-48 h-48 border border-brand-ink/10 rounded-xl bg-white p-2 shadow-xs" 
            />
            <div className="flex items-center gap-2 text-xs font-medium text-brand-accent">
              <Loader2 className="animate-spin" size={14} />
              <span>Väntar på SMS från din administratörsmobil...</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a 
              href={defaultSmsHref}
              className="w-full py-3 bg-brand-accent hover:opacity-90 text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Smartphone size={16} />
              <span>Öppna i telefonens SMS-app direkt</span>
            </a>

            <button
              onClick={() => checkStatus()}
              className="w-full py-2 text-brand-ink/60 hover:text-brand-ink font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Kontrollera status nu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
