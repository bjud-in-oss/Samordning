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
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-semibold">{t.loadingInfo}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={40} className="opacity-40" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.inactiveTitle}</h2>
        <p className="text-slate-600 leading-relaxed text-sm">
          {t.inactiveDesc}
        </p>
        <div className="pt-4 flex justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={18} />
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
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>{t.backBtn}</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="bg-teal-50 text-teal-800 text-xs font-extrabold px-3 py-1.5 rounded-full border border-teal-100">
            {alert.category || "Måltid & Gemenskap"}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
            {t.activeRequest}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            Inbjudan • {alert.area}
          </h2>
        </div>

        {/* Clean, scrubbed text */}
        {alert.scrubbedText && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/60 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Beskrivning</span>
            <p className="text-slate-800 font-semibold whitespace-pre-line leading-relaxed text-sm md:text-base">
              {alert.scrubbedText}
            </p>
          </div>
        )}

        {/* Details row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <MapPin className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.approxLocation}</div>
              <div className="text-sm font-bold text-slate-800">{alert.locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <Calendar className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.timeLabel}</div>
              <div className="text-sm font-bold text-slate-800">{alert.time || "Ingen fast tid"}</div>
            </div>
          </div>
        </div>

        {/* Responsible Party & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center font-black text-xs shrink-0">
              {alert.responsibleParty ? alert.responsibleParty.substring(0, 2).toUpperCase() : "GE"}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Arrangör</div>
              <div className="text-sm font-bold text-slate-800">{alert.responsibleParty}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center shrink-0">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Mottagare</div>
              {showContact ? (
                <div className="text-xs font-bold text-slate-800 select-all font-mono break-all">{alert.contactValue}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowContact(true)}
                  className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  Visa nummer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Compliance disclaimer */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/70 text-xs text-slate-500 leading-relaxed space-y-1">
          <p className="font-semibold text-slate-600">Allmänna handboken § 33.8 (Integritetsskydd):</p>
          <p>
            För att skydda medlemmars och volontärers integritet visas aldrig fullständiga efternamn eller exakta hemadresser offentligt. Positioner är avsiktligt maskerade på kartan till närområdet. Denna anslagstavla är helt stateless och sparar ingen personlig information på servern.
          </p>
        </div>
      </div>

      {/* Reply Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        {alert.isFull ? (
          <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
            <h3 className="text-lg font-bold">Aktiviteten är fullbokad</h3>
            <p className="text-sm">Denna aktivitet är nu fullbokad. Välkommen nästa gång!</p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                {t.respondTitle}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
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
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
                >
                  {quick}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                {t.messageLabel}
              </label>
              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-teal-600 focus:outline-none text-sm font-semibold placeholder-slate-400 transition-all resize-none text-slate-800"
                placeholder={t.messagePlaceholder}
              />
            </div>

            <button
              onClick={triggerSmsDeepLink}
              disabled={!responseText.trim()}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold text-lg rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={20} />
              {t.sendResponseBtn}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              {t.footerNotice}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
