// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect } from "react";
import { Trash2, Send, MapPin, Calendar, Users, Languages, ShieldCheck, ArrowLeft } from "lucide-react";
import { ActiveAlert } from "../types";
import { TRANSLATIONS, UiLanguage } from "../translations";

interface AlertDetailProps {
  alertId: string;
  onBack: () => void;
  uiLanguage: UiLanguage;
}

export default function AlertDetail({ alertId, onBack, uiLanguage }: AlertDetailProps) {
  const [alert, setAlert] = useState<ActiveAlert | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

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
          throw new Error(body.error || "Failed to fetch request.");
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

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    try {
      setSending(true);
      const res = await fetch(`/api/alerts/${alertId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText })
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to send response.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-semibold">{t.loadingInfo}</p>
      </div>
    );
  }

  if (error || success) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 max-w-xl mx-auto text-center">
        {success ? (
          <>
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.successTitle}</h2>
            <div className="text-sm bg-slate-50 text-slate-600 p-6 rounded-2xl border border-slate-100 text-left leading-relaxed space-y-3">
              <p>
                <strong>{t.successDeliveredTitle}</strong> {t.successDeliveredDesc}
              </p>
              <p>
                <strong>{t.successClosedTitle}</strong> {t.successClosedDesc}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.inactiveTitle}</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              {t.inactiveDesc}
            </p>
          </>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
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
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header card with back button */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>{t.backBtn}</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping"></div>
          <span className="text-xs font-semibold text-slate-500">{t.activeRequest}</span>
        </div>
      </div>

      {/* Main Alert Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
            {t.activeRequest}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            {t.alertDetailTitle} {alert.area}
          </h2>
        </div>

        {/* Clean, scrubbed details in human readable rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <MapPin className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.approxLocation}</div>
              <div className="text-base font-bold text-slate-800">{alert.locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <Calendar className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.timeLabel}</div>
              <div className="text-base font-bold text-slate-800">{alert.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <Users className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.participantsLabel}</div>
              <div className="text-base font-bold text-slate-800">{alert.gender}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <Languages className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.languageLabel}</div>
              <div className="text-base font-bold text-slate-800">{alert.language}</div>
            </div>
          </div>
        </div>

        {/* Friendly Integrity Note (Replacing scary Spatial Cloaking) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2 text-sm text-slate-600 leading-relaxed">
          <p>
            {t.privacyNotice}
          </p>
        </div>
      </div>

      {/* Svarsformulär */}
      <form onSubmit={handleRespond} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-950">{t.respondTitle}</h3>
          <p className="text-slate-500 text-sm mt-1">
            {t.respondSubtitle}
          </p>
        </div>

        {/* Quick buttons for elder accessibility */}
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
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
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
            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-teal-600 focus:outline-none text-base font-semibold placeholder-slate-400 transition-all resize-none text-slate-800"
            placeholder={t.messagePlaceholder}
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending || !responseText.trim()}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold text-lg rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {sending ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={20} />
              {t.sendResponseBtn}
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          {t.footerNotice}
        </p>
      </form>
    </div>
  );
}
