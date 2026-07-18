// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Calendar, Languages, ShieldCheck, Phone, Check } from "lucide-react";
import { TRANSLATIONS, UiLanguage } from "../translations";

interface AlertDetailProps {
  alertId: string;
  onBack: () => void;
  uiLanguage: UiLanguage;
}

export default function AlertDetail({ alertId, onBack, uiLanguage }: AlertDetailProps) {
  const [alert, setAlert] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [showContact, setShowContact] = useState<boolean>(false);

  const t = TRANSLATIONS[uiLanguage];

  useEffect(() => {
    let active = true;
    async function fetchAlert() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/alerts/${alertId}`);
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Misslyckades att hämta inbjudan.");
        }
        const data = await res.json();
        if (active) {
          setAlert(data);
          setResponseText(t.quickReply1);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchAlert();
    return () => {
      active = false;
    };
  }, [alertId, t.quickReply1]);

  const triggerSmsDeepLink = () => {
    if (!alert || !alert.contactValue) return;
    const rawContact = alert.contactValue.trim().replace(/\s+/g, "");
    const bodyText = `${responseText}\n\n(Svar på inbjudan ${alert.id} i ${alert.area})`;
    
    // Check if on iOS to handle different SMS link syntax if needed, but standard sms: works beautifully
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? "&" : "?";
    
    window.location.href = `sms:${rawContact}${separator}body=${encodeURIComponent(bodyText)}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-brand-ink/5 p-8 shadow-xs">
        <div className="w-10 h-10 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-brand-ink font-serif italic text-sm">{t.loadingInfo}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-brand-ink/5 p-8 shadow-xs space-y-6 max-w-xl mx-auto text-center">
        <div className="w-16 h-16 bg-brand-paper text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={32} className="opacity-65" />
        </div>
        <h2 className="font-serif italic text-xl md:text-2xl text-brand-ink font-medium tracking-tight">{t.inactiveTitle}</h2>
        <p className="text-brand-ink/70 leading-relaxed text-xs md:text-sm font-light">
          {t.inactiveDesc}
        </p>
        <div className="pt-4 flex justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-brand-ink hover:opacity-90 text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  if (!alert) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 text-left">
      {/* Header with back button */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-brand-ink/5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 hover:bg-brand-paper/50 text-brand-ink/80 hover:text-brand-ink font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>{t.backBtn}</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="bg-brand-paper text-brand-ink text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded border border-brand-ink/5">
            {alert.category || "Måltid & Gemenskap"}
          </span>
        </div>
      </div>

      {/* Main Card */}
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

        {/* Clean, scrubbed text */}
        {alert.scrubbedText && (
          <div className="bg-brand-paper/40 rounded-xl p-6 border border-brand-ink/5 space-y-2">
            <span className="text-[9px] uppercase font-mono tracking-wider text-brand-accent">Beskrivning</span>
            <p className="text-brand-ink/80 font-serif italic whitespace-pre-line leading-relaxed text-sm md:text-base font-medium">
              {alert.scrubbedText}
            </p>
          </div>
        )}

        {/* Details row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-brand-bg rounded-xl border border-brand-ink/5">
            <MapPin className="text-brand-accent shrink-0" size={20} />
            <div>
              <div className="text-[9px] uppercase font-mono text-brand-accent">{t.approxLocation}</div>
              <div className="text-sm font-serif italic font-medium text-brand-ink">{alert.locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-brand-bg rounded-xl border border-brand-ink/5">
            <Calendar className="text-brand-accent shrink-0" size={20} />
            <div>
              <div className="text-[9px] uppercase font-mono text-brand-accent">{t.timeLabel}</div>
              <div className="text-sm font-serif italic font-medium text-brand-ink">{alert.time || "Ingen fast tid"}</div>
            </div>
          </div>
        </div>

        {/* Responsible Party & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-ink/5 pt-6">
          <div className="flex items-center gap-3 p-4 bg-brand-bg rounded-xl border border-brand-ink/5">
            <div className="w-8 h-8 bg-brand-paper text-brand-ink rounded-full flex items-center justify-center font-serif italic font-medium text-xs shrink-0 border border-brand-ink/5">
              {alert.responsibleParty ? alert.responsibleParty.substring(0, 2).toUpperCase() : "GE"}
            </div>
            <div>
              <div className="text-[9px] uppercase font-mono text-brand-accent">Arrangör</div>
              <div className="text-sm font-serif italic font-medium text-brand-ink">{alert.responsibleParty}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-brand-bg rounded-xl border border-brand-ink/5">
            <div className="w-8 h-8 bg-brand-paper text-brand-accent rounded-full flex items-center justify-center shrink-0 border border-brand-ink/5">
              <Phone size={14} className="text-brand-accent" />
            </div>
            <div className="flex-1">
              <div className="text-[9px] uppercase font-mono text-brand-accent">Mottagare</div>
              {showContact ? (
                <div className="text-xs font-mono text-brand-ink select-all break-all">{alert.contactValue}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowContact(true)}
                  className="text-xs text-brand-accent hover:opacity-100 opacity-70 underline font-mono uppercase tracking-wider cursor-pointer"
                >
                  Visa nummer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Simple, inviting helper text */}
        <div className="bg-brand-paper/30 rounded-xl p-5 border border-brand-ink/5 text-xs text-brand-ink/75 leading-relaxed text-center font-serif italic font-medium">
          <p>
            {uiLanguage === "sv" 
              ? "Klicka på knappen nedan för att öppna din SMS-app och meddela arrangören att du deltar." 
              : "Click the button below to open your SMS app and notify the organizer that you are participating."}
          </p>
        </div>
      </div>

      {/* Reply Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-ink/5 space-y-6">
        {alert.isFull ? (
          <div className="bg-brand-paper/50 text-brand-ink border border-brand-ink/10 rounded-xl p-6 text-center space-y-2">
            <h3 className="font-serif italic text-lg font-medium">Aktiviteten är fullbokad</h3>
            <p className="text-xs text-brand-ink/70 font-light">Denna aktivitet är nu fullbokad. Välkommen nästa gång!</p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-xl font-serif italic text-brand-ink font-medium">
                {t.respondTitle}
              </h3>
              <p className="text-brand-ink/70 text-xs md:text-sm font-light mt-1">
                {t.respondSubtitle}
              </p>
            </div>

            {/* Quick prefill buttons */}
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

            <p className="text-[10px] font-mono text-brand-accent uppercase tracking-wider text-center leading-relaxed">
              {t.footerNotice}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
