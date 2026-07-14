// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";
import { Info, Calendar, Phone, Mail, MessageSquare, ExternalLink, X, Send, CheckCircle } from "lucide-react";
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

  // New states for creating an invitation (Väntrummet)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: announcementText })
      });

      if (!res.ok) throw new Error("Gick inte att skicka inlägget.");

      const data = await res.json();
      setToast(data.message || "Tack! Din inbjudan har placerats i väntrummet.");
      setAnnouncementText("");
      setShowModal(false);
    } catch (err: any) {
      alert("Fel vid inskickning: " + err.message);
    } finally {
      setSending(false);
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
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
        >
          <span>+ Nytt</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

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

      {/* 2. INSKICKNINGS-MODAL (Väntrummet för utomstående inlägg) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Skapa inbjudan</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Din inbjudan sparas i Väntrummet tills den godkänts via SMS.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitAnnouncement} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Beskriv aktivitet eller inbjudan
                </label>
                <textarea
                  required
                  rows={4}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Skriv t.ex: # [Kortedala] [18:00] Varmt välkommen på gemensamt kvällsmål på torget!"
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-2xl text-slate-800 text-xs focus:outline-none transition-all placeholder-slate-400 resize-none font-medium leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                  Tips: Inkludera stadsdel inom klamrar [t.ex. Kortedala, Gamlestaden] och tid [t.ex. 18:00] för bästa sortering och automatiska SMS-notifieringar till frivilliga.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={sending || !announcementText.trim()}
                  className="px-6 py-2.5 text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {sending ? (
                    <span>Skickar...</span>
                  ) : (
                    <>
                      <span>Skicka till väntrum</span>
                      <Send size={12} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
