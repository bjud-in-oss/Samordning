import React from "react";
import { Check, QrCode } from "lucide-react";

interface AlertDetailReplySectionProps {
  alert: any;
  responseText: string;
  setResponseText: (val: string) => void;
  showQrRsvp: boolean;
  setShowQrRsvp: (val: boolean) => void;
  triggerSmsDeepLink: () => void;
  t: any;
}

export function AlertDetailReplySection({
  alert,
  responseText,
  setResponseText,
  showQrRsvp,
  setShowQrRsvp,
  triggerSmsDeepLink,
  t
}: AlertDetailReplySectionProps) {
  if (alert.isFull) {
    return (
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-ink/5 space-y-6">
        <div className="bg-brand-paper/50 text-brand-ink border border-brand-ink/10 rounded-xl p-6 text-center space-y-2">
          <h3 className="font-serif italic text-lg font-medium">Aktiviteten är fullbokad</h3>
          <p className="text-xs text-brand-ink/70 font-light">Denna aktivitet är nu fullbokad. Välkommen nästa gång!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-ink/5 space-y-6">
      <div>
        <h3 className="text-xl font-serif italic text-brand-ink font-medium">
          {t.respondTitle}
        </h3>
        <p className="text-brand-ink/70 text-xs md:text-sm font-light mt-1">
          {t.respondSubtitle}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          t.quickReply1,
          t.quickReply2,
          t.quickReply3,
          t.quickReply4
        ].map(quick => (
          <button
            key={quick}
            type="button"
            onClick={() => setResponseText(quick)}
            className="px-4 py-2 bg-brand-bg hover:bg-brand-paper border border-brand-ink/5 text-brand-ink/80 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer"
          >
            {quick}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-[9px] uppercase font-mono text-brand-accent tracking-wider">
          {t.messageLabel}
        </label>
        <textarea
          value={responseText}
          onChange={e => setResponseText(e.target.value)}
          rows={3}
          className="w-full p-4 rounded-xl border border-brand-ink/10 focus:border-brand-accent focus:outline-none text-xs sm:text-sm font-serif italic text-brand-ink placeholder-brand-ink/30 transition-all resize-none bg-brand-bg/20 font-medium"
          placeholder={t.messagePlaceholder}
        />
      </div>

      <button
        onClick={triggerSmsDeepLink}
        disabled={!responseText.trim()}
        className="w-full py-3.5 bg-brand-ink hover:opacity-90 disabled:bg-brand-paper disabled:text-brand-ink/30 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
      >
        <Check size={16} />
        {t.sendResponseBtn}
      </button>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => setShowQrRsvp(!showQrRsvp)}
          className="font-mono text-xs text-brand-accent hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer font-medium"
        >
          <QrCode size={14} />
          <span>{showQrRsvp ? "Dölj QR-kod" : "Tacka Ja via annan enhet"}</span>
        </button>

        {showQrRsvp && (
          <div className="mt-4 p-4 bg-brand-paper/40 rounded-2xl border border-brand-ink/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-in fade-in duration-200">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`sms:0736108997?body=${encodeURIComponent(`JA på inbjudan #${alert.id}`)}`)}`}
              alt="OSA QR Code"
              className="w-28 h-28 rounded-xl border border-brand-ink/10 shrink-0 bg-white p-1"
            />
            <div className="space-y-1.5 text-xs text-brand-ink/80 font-light leading-relaxed">
              <span className="font-mono text-xs uppercase font-semibold text-brand-ink block">
                Tacka Ja via mobil (SMS-Gateway)
              </span>
              <p>
                Skanna QR-koden med din mobiltelefon för att öppna ett färdigt SMS med texten:
              </p>
              <p className="font-mono text-[11px] font-semibold text-brand-accent bg-white px-2.5 py-1 rounded border border-brand-ink/10 inline-block">
                JA på inbjudan #{alert.id}
              </p>
              <p>
                SMS:et skickas direkt till mottagarnumret 0736108997.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] font-mono text-brand-accent uppercase tracking-wider text-center leading-relaxed">
        {t.footerNotice}
      </p>
    </div>
  );
}
