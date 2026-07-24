// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - SMS & QR Gateway Fallback Section

import React from "react";
import { Send } from "lucide-react";
import { GATEWAY_NUMBER } from "../domain/constants";

interface GatewayQrModalProps {
  isFormValid: boolean;
  showQrSection: boolean;
  setShowQrSection: (show: boolean) => void;
  formattedText: string;
}

export function GatewayQrModal({
  isFormValid,
  showQrSection,
  setShowQrSection,
  formattedText
}: GatewayQrModalProps) {
  const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);
  const smsBody = encodeURIComponent(`#WEBB\n${formattedText}`);
  const smsHref = `sms:${GATEWAY_NUMBER}?body=${smsBody}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(smsHref)}`;

  return (
    <div className="pt-6 border-t border-brand-ink/10 space-y-3 text-center">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Eller skicka via SMS / QR (Gateway {GATEWAY_NUMBER})
        </p>
        <button
          type="button"
          onClick={() => setShowQrSection(!showQrSection)}
          className="text-xs font-mono text-brand-accent hover:underline cursor-pointer font-medium"
        >
          {showQrSection || isFormValid ? "Dölj QR/SMS-väg" : "Visa QR/SMS-väg"}
        </button>
      </div>

      {(isFormValid || showQrSection) && (
        <div className="pt-2 animate-in fade-in duration-200">
          {isMobile ? (
            <a
              href={smsHref}
              className="w-full py-3.5 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Send size={14} className="text-brand-accent" />
              <span>Öppna SMS-app för insändning till {GATEWAY_NUMBER}</span>
            </a>
          ) : (
            <div className="p-4 bg-brand-paper/30 rounded-2xl border border-brand-ink/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img src={qrUrl} alt="SMS QR Code" className="w-28 h-28 rounded-xl border border-brand-ink/10 shrink-0 bg-white p-1" />
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase font-semibold text-brand-ink block">
                  Skanna med din mobiltelefon
                </span>
                <p className="text-xs text-brand-ink/75 leading-relaxed font-light">
                  QR-Koden öppnar din SMS-app med din inbjudan i ett färdigt SMS till numret {GATEWAY_NUMBER}. När du skickar detta SMS kommer din inbjudan kunna granskas manuellt och sen publiceras.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
