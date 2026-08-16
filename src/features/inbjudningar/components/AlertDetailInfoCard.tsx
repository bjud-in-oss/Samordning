import React from "react";
import { MapPin, Calendar, ShieldCheck, Phone } from "lucide-react";

interface AlertDetailInfoCardProps {
  alert: any;
  showContact: boolean;
  setShowContact: (val: boolean) => void;
  uiLanguage: string;
  t: any;
}

export function AlertDetailInfoCard({ alert, showContact, setShowContact, uiLanguage, t }: AlertDetailInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-ink/5 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-brand-paper text-brand-accent">
            {t.activeRequest}
          </span>
          {alert.totalActiveAlerts > 1 && (
            <span className="font-mono text-[9px] text-brand-accent bg-brand-bg px-2 py-0.5 rounded border border-brand-ink/5">
              ID: {alert.id}
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-serif italic text-brand-ink font-medium mt-3 tracking-tight">
          Inbjudan • {alert.area}
        </h2>
      </div>

      {alert.scrubbedText && (
        <div className="bg-brand-paper/40 rounded-xl p-6 border border-brand-ink/5 space-y-2">
          <span className="text-[9px] uppercase font-mono tracking-wider text-brand-accent">Beskrivning</span>
          <p className="text-brand-ink/80 font-serif italic whitespace-pre-line leading-relaxed text-sm md:text-base font-medium">
            {alert.scrubbedText}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-brand-ink/5 pt-4 font-mono text-xs">
        <div className="flex items-start gap-2.5 p-3 bg-brand-bg rounded-xl border border-brand-ink/5">
          <Calendar className="text-brand-accent shrink-0 mt-0.5" size={16} />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase font-mono font-bold text-brand-ink/60">{t.timeLabel}</div>
            <div className="text-xs font-serif italic font-semibold text-brand-ink mt-0.5">{alert.time || "Ingen fast tid"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-brand-bg rounded-xl border border-brand-ink/5">
          <MapPin className="text-brand-accent shrink-0 mt-0.5" size={16} />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase font-mono font-bold text-brand-ink/60">{t.approxLocation}</div>
            <div className="text-xs font-serif italic font-semibold text-brand-ink mt-0.5">{alert.locationName || alert.area}</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-brand-bg rounded-xl border border-brand-ink/5">
          <ShieldCheck className="text-brand-accent shrink-0 mt-0.5" size={16} />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase font-mono font-bold text-brand-ink/60">Arrangör</div>
            <div className="text-xs font-serif italic font-semibold text-brand-ink mt-0.5">{alert.responsibleParty || "Församlingsledare"}</div>
            {alert.contactValue && (
              <div className="text-[11px] font-mono text-brand-ink/80 mt-1 flex items-center gap-1">
                <Phone size={12} className="text-brand-accent shrink-0" />
                {showContact ? (
                  <span className="select-all font-semibold">{alert.contactValue}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowContact(true)}
                    className="text-brand-accent hover:underline cursor-pointer"
                  >
                    Visa nummer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-brand-paper/30 rounded-xl p-5 border border-brand-ink/5 text-xs text-brand-ink/75 leading-relaxed text-center font-serif italic font-medium">
        <p>
          {uiLanguage === "sv" 
            ? "Klicka på knappen nedan för att öppna din SMS-app och meddela arrangören att du deltar." 
            : "Click the button below to open your SMS app and notify the organizer that you are participating."}
        </p>
      </div>
    </div>
  );
}
