// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - SMS & QR Gateway Fallback Section

import React from "react";
import { Send, QrCode } from "lucide-react";
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
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setShowQrSection(!showQrSection)}
          className="w-full py-3.5 px-4 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold"
        >
          <QrCode size={16} className="text-brand-accent shrink-0" />
          <span>{showQrSection ? "Dölj QR/SMS-väg" : "Publicera från annan enhet"}</span>
        </button>
      </div>

      {showQrSection && (
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
              <div className="space-y-1.5 text-xs text-brand-ink/80 font-light leading-relaxed">
                <span className="font-mono text-xs uppercase font-semibold text-brand-ink block">
                  Skanna med din mobiltelefon
                </span>
                <p>
                  QR-Koden öppnar din SMS-app med din inbjudan i ett färdigt SMS till numret {GATEWAY_NUMBER}.
                </p>
                <p>
                  När du skickar detta SMS kommer din inbjudan kunna granskas och därefter publiceras på anslagstavlan.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
