// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";
import { Info, Calendar, Phone, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { ActiveAlert } from "../types";
import { TRANSLATIONS, UiLanguage } from "../translations";

interface ActiveStreamProps {
  onSelectAlert: (id: string) => void;
  uiLanguage: UiLanguage;
}

export default function ActiveStream({ onSelectAlert, uiLanguage }: ActiveStreamProps) {
  const [stream, setStream] = useState<ActiveAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStream() {
    try {
      const res = await fetch("/api/sim/active-alerts");
      if (!res.ok) throw new Error("Failed to fetch active stream.");
      const data = await res.json();
      // Sort with newest first
      setStream(data.sort((a: any, b: any) => b.timestamp - a.timestamp));
    } catch (err: any) {
      setError(err.message || "Could not retrieve live stream.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 5000);
    return () => clearInterval(interval);
  }, []);

  // Multi-language stream label helpers
  const getStreamTitle = () => {
    switch (uiLanguage) {
      case "en": return "Invitations for you";
      case "es": return "Invitaciones para ti";
      case "sw": return "Mialiko kwako";
      case "vi": return "Lời mời dành cho bạn";
      default: return "Inbjudan till dig";
    }
  };

  const getEmptyDesc = () => {
    switch (uiLanguage) {
      case "en": return "There are no active invitations in your chosen areas right now. You will receive a notification as soon as a new invitation is posted.";
      case "es": return "No hay invitaciones activas en sus áreas seleccionadas en este momento. Recibirá una notificación tan pronto como se publique una nueva invitación.";
      case "sw": return "Hakuna mialiko hai kwa sasa katika maeneo uliyochagua. Utapokea arifa mwaliko mpya unapowekwa.";
      case "vi": return "Hiện tại không có lời mời nào trong các khu vực bạn đã chọn. Bạn sẽ nhận được thông báo ngay khi có lời mời mới.";
      default: return "Just nu finns inga aktiva inbjudningar i dina valda områden. Du får en notis så fort en ny inbjudan läggs upp.";
    }
  };

  const getOrganizerLabel = () => {
    switch (uiLanguage) {
      case "en": return "Organizer";
      case "es": return "Organizador";
      case "sw": return "Mratibu";
      case "vi": return "Người tổ chức";
      default: return "Arrangör";
    }
  };

  const getButtonText = () => {
    switch (uiLanguage) {
      case "en": return "View invitation";
      case "es": return "Ver invitación";
      case "sw": return "Angalia mwaliko";
      case "vi": return "Xem lời mời";
      default: return "Visa inbjudan";
    }
  };

  const getCountSuffix = () => {
    if (stream.length === 1) {
      switch (uiLanguage) {
        case "en": return "invitation";
        case "es": return "invitación";
        case "sw": return "mwaliko";
        case "vi": return "lời mời";
        default: return "inbjudan";
      }
    } else {
      switch (uiLanguage) {
        case "en": return "invitations";
        case "es": return "invitaciones";
        case "sw": return "mialiko";
        case "vi": return "lời mời";
        default: return "inbjudningar";
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse shrink-0"></span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {stream.length} {getCountSuffix()}
          </span>
        </div>
        <button
          onClick={() => alert("Väntrummet kommer snart! Inbjudan sparas i väntrummet tills en samordnare har godkänt inlägget via SMS.")}
          className="bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
        >
          <span>+ Nytt</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 text-sm">
          {error}
        </div>
      )}

      {stream.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100/50 rounded-3xl p-8 text-center text-slate-500">
          <p className="text-sm max-w-md mx-auto leading-relaxed font-medium">
            {getEmptyDesc()}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stream.map(item => {
            return (
              <div
                key={item.id}
                onClick={() => onSelectAlert(item.id)}
                className="p-5 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] group relative overflow-hidden border-teal-500/20 hover:border-teal-500/40"
                style={{ contentVisibility: "auto" }}
              >
                {/* Visual Accent Bar */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-teal-500"></div>

                <div className="pl-2 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-teal-50 text-teal-800">
                        {TRANSLATIONS[uiLanguage].activeRequest}
                      </span>
                      {stream.length > 1 && (
                        <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          ID: {item.id}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Distrikt: {item.area}
                    </span>
                  </div>

                  <p className="text-sm md:text-base font-bold text-slate-800 leading-normal break-words">
                    {item.scrubbedText}
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-700">
                        {item.responsibleParty.substring(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-700">
                        {getOrganizerLabel()}: {item.responsibleParty}
                      </span>
                    </div>

                    <button className="px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer bg-teal-600 hover:bg-teal-700 text-white group-hover:shadow-sm">
                      {getButtonText()}
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
