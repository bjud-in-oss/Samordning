// [src/features/inbjudningar/AlertDetail.tsx] - Alert Detail View

import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { TRANSLATIONS, UiLanguage } from "../mission_router";
import { AlertDetailHeader } from "./components/AlertDetailHeader";
import { AlertDetailInfoCard } from "./components/AlertDetailInfoCard";
import { AlertDetailReplySection } from "./components/AlertDetailReplySection";

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
  const [showQrRsvp, setShowQrRsvp] = useState<boolean>(false);

  const t = TRANSLATIONS[uiLanguage];

  useEffect(() => {
    let active = true;
    async function fetchAlert() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/alerts/${alertId}`);
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          if (contentType && contentType.includes("application/json")) {
            const body = await res.json();
            throw new Error(body.error || "Misslyckades att hämta inbjudan.");
          }
          throw new Error("Aktiviteten hittades inte, har förfallit eller raderats permanent.");
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Svaret från servern kunde inte tolkas som JSON.");
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
      <AlertDetailHeader
        category={alert.category}
        onBack={onBack}
        backBtnText={t.backBtn}
      />

      <AlertDetailInfoCard
        alert={alert}
        showContact={showContact}
        setShowContact={setShowContact}
        uiLanguage={uiLanguage}
        t={t}
      />

      <AlertDetailReplySection
        alert={alert}
        responseText={responseText}
        setResponseText={setResponseText}
        showQrRsvp={showQrRsvp}
        setShowQrRsvp={setShowQrRsvp}
        triggerSmsDeepLink={triggerSmsDeepLink}
        t={t}
      />
    </div>
  );
}
