// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";
import { AlertTriangle, Info, Calendar, Phone, Mail, MessageSquare, ExternalLink, Heart } from "lucide-react";
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

  const t = TRANSLATIONS[uiLanguage];

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

  const getContactIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail size={16} />;
      case "whatsapp":
        return <MessageSquare size={16} />;
      default:
        return <Phone size={16} />;
    }
  };

  const getSwedishTypeText = (type: string) => {
    return type === "missionary_alert" ? "Akut missionärslarm" : "Ledarpålysning";
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-500 rounded-full animate-pulse shrink-0"></span>
            Aktivt flöde i Göteborg
          </h3>
          <p className="text-xs text-slate-500">
            Aktiva larm och allmänna pålysningar för dina valda distrikt.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {stream.length} {stream.length === 1 ? "aktivitet" : "aktiviteter"}
        </span>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 text-sm">
          {error}
        </div>
      )}

      {stream.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center text-slate-500 space-y-2">
          <Heart size={28} className="mx-auto text-slate-300 stroke-[1.5]" />
          <h4 className="font-bold text-slate-700">Det är lugnt i Göteborg just nu</h4>
          <p className="text-xs max-w-sm mx-auto">
            Inga akuta larm eller pålysningar finns i minnet. Du kommer att få en direktavisering i din telefon så fort ett behov uppstår.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stream.map(item => {
            const isAlert = item.type === "missionary_alert";
            return (
              <div
                key={item.id}
                onClick={() => onSelectAlert(item.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] group relative overflow-hidden ${
                  isAlert
                    ? "border-amber-500/20 hover:border-amber-500/40"
                    : "border-blue-500/20 hover:border-blue-500/40"
                }`}
                style={{ contentVisibility: "auto" }}
              >
                {/* Visual Accent Bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  isAlert ? "bg-amber-500" : "bg-blue-500"
                }`}></div>

                <div className="pl-2 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      isAlert
                        ? "bg-amber-50 text-amber-800"
                        : "bg-blue-50 text-blue-800"
                    }`}>
                      {getSwedishTypeText(item.type)}
                    </span>
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
                        Ansvarig: {item.responsibleParty}
                      </span>
                    </div>

                    <button className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isAlert
                        ? "bg-amber-500 text-white group-hover:bg-amber-600"
                        : "bg-blue-500 text-white group-hover:bg-blue-600"
                    }`}>
                      {isAlert ? "Besvara larm" : "Visa pålysning"}
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
