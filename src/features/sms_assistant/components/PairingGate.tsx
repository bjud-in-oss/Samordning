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

  const warmSmsBody = `Skicka detta SMS för att kunna godkänna andras inbjudningar och starta live-översättning. [Kod: #Logga-in-${activeToken}]`;
  const defaultSmsHref = smsHref || `sms:${phoneNumber}?body=${encodeURIComponent(warmSmsBody)}`;
  const defaultQrUrl = qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(defaultSmsHref)}`;

return (
  <div className="min-h-screen flex flex-col bg-brand-bg font-sans text-brand-ink">
    {/* Toppmeny */}
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs px-4 py-3 border-b border-brand-ink/10">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.location.href = "/"}
          className="p-2 -ml-2 text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-mono uppercase tracking-wider">Tillbaka till anslagstavlan</span>
        </button>
      </div>
    </div>

    {/* Huvudinnehåll */}
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-ink/10 shadow-sm max-w-md w-full text-center space-y-6">
        
        <div className="w-14 h-14 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto text-brand-accent">
          <ShieldCheck size={30} />
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-2xl font-medium text-brand-ink">
            Samordna inbjudningar och översättning
          </h1>
          
          <p className="text-xs text-brand-ink/80 italic leading-relaxed bg-brand-bg/60 p-3 rounded-xl border border-brand-ink/5">
            "Genom att samordna personliga inbjudningar och språköversättning möter vi andras behov av vänskap, näring av Guds ord och osjälviskt tjänande."
          </p>

          <p className="text-xs text-brand-ink/70 leading-relaxed pt-1">
            Skanna för att logga in som administratör: Visa QR-koden i din mobilkamera och öppna den länk som då visas.
          </p>
        </div>

        <div className="p-4 bg-brand-bg rounded-2xl border border-brand-ink/5 flex flex-col items-center gap-3">
          <img
            src={defaultQrUrl}
            alt="QR-kod för samordning" 
            className="w-48 h-48 border border-brand-ink/10 rounded-xl bg-white p-2 shadow-xs"
          />
          
          <p className="text-[11px] text-brand-ink/60">
            Väntar på SMS från din administratörsmobil...
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={checkStatus}
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-brand-bg hover:bg-brand-ink/5 border border-brand-ink/10 text-brand-ink font-mono text-xs rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Kontrollera status nu</span>
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-brand-ink/5">
          <a
            href={defaultSmsHref}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-ink font-medium text-xs rounded-xl transition-colors"
          >
            Öppna i telefonens SMS-app direkt
          </a>

          <p className="text-[11px] text-brand-ink/50 pt-1">
            Går det inte att skanna? Gå till <span className="font-mono text-brand-ink/70">utby-translate.netlify.app/samordna</span> i mobilen.
          </p>
        </div>

      </div>
    </div>
  </div>
);
}
