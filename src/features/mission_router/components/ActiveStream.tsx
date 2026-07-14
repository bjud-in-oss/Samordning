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
      <div className="flex justify-center items-center py-12">
        <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full mt-4">
      {toast && (
        <div className="p-4 bg-brand-accent/5 border border-brand-accent/10 text-brand-accent text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200 max-w-2xl mx-auto">
          <CheckCircle size={14} className="text-brand-accent shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-brand-error/10 text-brand-error rounded-xl border border-brand-error/20 font-mono text-xs uppercase tracking-wider max-w-2xl mx-auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
        {/* Left Action Area */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
          <div className="space-y-1">
            <div className="font-mono text-[10px] text-brand-accent uppercase tracking-[0.2em]">Aktiv Status</div>
            <div className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-brand-ink font-medium leading-none">
              {stream.length} {getCountSuffix()}
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-accent hover:opacity-90 text-white font-medium text-xs uppercase tracking-[0.15em] py-4 px-6 rounded-xl transition-all cursor-pointer shadow-xs text-center duration-200"
          >
            + Skapa ny förfrågan
          </button>
        </div>

        {/* Vertical divider line (hidden on small screens) */}
        <div className="hidden lg:block lg:col-span-1 justify-self-center">
          <div className="w-[1px] bg-brand-ink/10 h-64"></div>
        </div>

        {/* Right Info Area / Active Cards Stream */}
        <div className="lg:col-span-6 space-y-6">
          <div className="font-mono text-[10px] text-brand-accent uppercase tracking-[0.2em] mb-2">Meddelanden</div>

          {stream.length === 0 ? (
            <div className="message-box font-serif italic text-lg sm:text-xl lg:text-2xl text-brand-ink/70 leading-relaxed font-light">
              {getEmptyDesc()}
            </div>
          ) : (
            <div className="space-y-6">
              {stream.map(item => {
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectAlert(item.id)}
                    className="p-6 rounded-2xl border border-brand-ink/5 transition-all cursor-pointer bg-white hover:border-brand-accent/40 active:scale-[0.99] group relative overflow-hidden flex flex-col gap-4 duration-200"
                    style={{ contentVisibility: "auto" }}
                  >
                    {/* Minimalist Top Indicator */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2 py-0.5 rounded">
                          {TRANSLATIONS[uiLanguage].activeRequest}
                        </span>
                        {stream.length > 1 && (
                          <span className="font-mono text-[9px] text-brand-accent/60 bg-brand-paper/50 px-1.5 py-0.5 rounded">
                            ID: {item.id}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[9px] text-brand-accent/70 tracking-wider">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Distrikt: {item.area}
                      </span>
                    </div>

                    <p className="font-serif italic text-base md:text-lg text-brand-ink/90 leading-relaxed break-words font-light">
                      ”{item.scrubbedText}”
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-brand-ink/5 text-[11px]">
                      <div className="flex items-center gap-2 text-brand-ink/70">
                        <div className="w-5 h-5 rounded-full bg-brand-paper flex items-center justify-center font-serif italic text-[10px] text-brand-ink/80 font-bold">
                          {item.responsibleParty.substring(0, 2)}
                        </div>
                        <span className="font-medium">
                          {getOrganizerLabel()}: {item.responsibleParty}
                        </span>
                      </div>

                      <button className="font-mono text-[9px] uppercase tracking-[0.15em] text-brand-ink group-hover:opacity-100 opacity-60 border-b border-transparent group-hover:border-brand-ink pb-0.5 transition-all duration-200 flex items-center gap-1">
                        {getButtonText()}
                        <ExternalLink size={10} className="stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. INSKICKNINGS-MODAL (Väntrummet för utomstående inlägg) */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-ink/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-brand-bg rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-brand-ink/5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-brand-ink/5 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-serif italic text-lg text-brand-ink font-medium">Skapa inbjudan</h3>
                <p className="font-mono text-[9px] text-brand-accent uppercase tracking-wider mt-0.5">Sparas i väntrummet tills den godkänts via SMS.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-brand-paper rounded-full text-brand-ink/50 hover:text-brand-ink transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitAnnouncement} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                  Beskriv aktivitet eller inbjudan
                </label>
                <textarea
                  required
                  rows={4}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Skriv t.ex: # [Kortedala] [18:00] Varmt välkommen på gemensamt kvällsmål på torget!"
                  className="w-full px-4 py-3 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-xl text-brand-ink text-xs focus:outline-none transition-all placeholder-brand-ink/30 resize-none leading-relaxed font-light"
                />
                <span className="font-mono text-[9px] text-brand-accent/70 block mt-1 leading-normal uppercase">
                  Tips: Inkludera stadsdel [t.ex. Kortedala] och tid [t.ex. 18:00].
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-3 border-t border-brand-ink/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="font-mono text-[10px] uppercase tracking-wider text-brand-ink/60 hover:text-brand-ink transition-all cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={sending || !announcementText.trim()}
                  className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-white bg-brand-accent hover:opacity-90 disabled:opacity-40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {sending ? (
                    <span>Skickar...</span>
                  ) : (
                    <>
                      <span>Skicka</span>
                      <Send size={10} />
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
