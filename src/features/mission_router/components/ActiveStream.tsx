// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";
import { Info, Calendar, Phone, Mail, MessageSquare, ExternalLink, X, Send, CheckCircle, Sparkles, ShieldAlert } from "lucide-react";
import { ActiveAlert } from "../types";
import { TRANSLATIONS, UiLanguage } from "../translations";

interface ActiveStreamProps {
  onSelectAlert: (id: string) => void;
  uiLanguage: UiLanguage;
}

const AREAS = [
  "Angered", "Kortedala", "Gamlestaden", "Hisingen", "Biskopsgården", "Lundby", "Partille", 
  "Örgryte", "Johanneberg", "Majorna", "Mölndal", "Frölunda", "Torslanda", "Askim", "Härryda"
];

const ORGANIZATIONS = [
  "Enskild/Familj", "Missionärerna", "Församlingsmissionen", "Biskopsrådet", "Äldstekvorumet", 
  "Hjälpföreningen", "Unga Män (UM)", "Unga Kvinnor (UK)", "Primär", "Söndagsskolan", 
  "Aktivitetskommittén", "Unga vuxna (UV)", "Ensamstående vuxna (EV)", "Institutet", 
  "Seminariet", "Staven"
];

export default function ActiveStream({ onSelectAlert, uiLanguage }: ActiveStreamProps) {
  const [stream, setStream] = useState<ActiveAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New states for creating an invitation (Väntrummet)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Two-step invitation flow states
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [washing, setWashing] = useState<boolean>(false);
  const [washResult, setWashResult] = useState<any>(null);

  // Editable metadata fields for Step 2
  const [selectedCategory, setSelectedCategory] = useState<string>("Måltid & Gemenskap");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("Alla");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("Enskild/Familj");
  const [selectedLocationName, setSelectedLocationName] = useState<string>("Kapellet");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Svenska");
  const [gdprChecked, setGdprChecked] = useState<boolean>(false);

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

  const handleWash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setWashing(true);
    try {
      const res = await fetch("/api/wash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: announcementText })
      });

      if (!res.ok) throw new Error("Gick inte att tvätta inbjudan.");

      const data = await res.json();
      setWashResult(data);

      // Pre-fill fields from AI metadata extraction
      setSelectedCategory(data.extractedMetadata.category || "Måltid & Gemenskap");
      setSelectedArea(data.extractedMetadata.area || "");
      setSelectedTime(data.extractedMetadata.time || "");
      setSelectedAudience(data.extractedMetadata.audience || "Alla");
      setSelectedOrganization(data.extractedMetadata.organization || "Enskild/Familj");
      setSelectedLocationName(data.extractedMetadata.locationName || "Kapellet");
      setSelectedLanguage(data.extractedMetadata.language || "Svenska");

      setCurrentStep(2);
    } catch (err: any) {
      alert("Fel vid AI-analys: " + err.message);
    } finally {
      setWashing(false);
    }
  };

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    if (!gdprChecked) {
      alert("Du måste samtycka till villkoren och GDPR-rutan.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: announcementText,
          category: selectedCategory,
          area: selectedArea,
          time: selectedTime,
          audience: selectedAudience,
          organization: selectedOrganization,
          locationName: selectedLocationName,
          language: selectedLanguage
        })
      });

      if (!res.ok) throw new Error("Gick inte att skicka inlägget.");

      const data = await res.json();
      setToast(data.message || "Tack! Din inbjudan har placerats i väntrummet.");
      setAnnouncementText("");
      setShowModal(false);
      setCurrentStep(1);
      setWashResult(null);
      setGdprChecked(false);
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
                <p className="font-mono text-[9px] text-brand-accent uppercase tracking-wider mt-0.5">
                  {currentStep === 1 
                    ? "Steg 1: Skriv inbjudan och låt AI extrahera detaljer" 
                    : "Steg 2: Granska förslag, justera och godkänn"
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-brand-paper rounded-full text-brand-ink/50 hover:text-brand-ink transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            {currentStep === 1 ? (
              <form onSubmit={handleWash} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    Beskriv aktivitet eller inbjudan (fritext)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Skriv helt fritt, t.ex: Bjuder på fika och varm soppa hemma hos oss i Partille nu på tisdag kl 18. Vi talar svenska och engelska!"
                    className="w-full px-4 py-3 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-xl text-brand-ink text-xs focus:outline-none transition-all placeholder-brand-ink/30 resize-none leading-relaxed font-light"
                  />
                  <span className="font-mono text-[9px] text-brand-accent/70 block mt-1 leading-normal uppercase">
                    Tips: Berätta vad ni bjuder in till, stadsdel, dag/tid och vilka språk som talas. AI:n föreslår taggar automatiskt!
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
                    disabled={washing || !announcementText.trim()}
                    className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-white bg-brand-accent hover:opacity-90 disabled:opacity-40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {washing ? (
                      <span>Analyserar...</span>
                    ) : (
                      <>
                        <span>Förhandsgranska</span>
                        <Send size={10} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitAnnouncement} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* AI Advise Panel */}
                <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/15 flex gap-3">
                  <Sparkles size={16} className="text-brand-accent shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-brand-accent font-semibold">AI Rådgivare</div>
                    <p className="text-brand-ink/80 text-xs leading-relaxed font-light whitespace-pre-line">
                      {washResult?.aiFeedback}
                    </p>
                  </div>
                </div>

                {/* Warnings / Geographic blocking */}
                {washResult?.warnings?.missingAreaForTeaching && !selectedArea && (
                  <div className="p-3 bg-brand-error/10 text-brand-error rounded-xl border border-brand-error/20 font-mono text-[10px] uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>Geografisk Blockering: Du måste välja ett område i listan nedan för att kunna skicka.</span>
                  </div>
                )}

                {/* Grid with Editable Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Kategori</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-lg text-xs focus:outline-none transition-all"
                    >
                      <option value="Måltid & Gemenskap">Måltid & Gemenskap</option>
                      <option value="Lektion & Samtal">Lektion & Samtal</option>
                      <option value="Tjänande">Tjänande</option>
                    </select>
                  </div>

                  {/* Area */}
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Stöddistrikt / Område</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-lg text-xs focus:outline-none transition-all"
                    >
                      <option value="">Välj område...</option>
                      {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  {/* Time */}
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Tidpunkt (t.ex. 18:00)</label>
                    <input
                      type="text"
                      placeholder="HH:MM"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-lg text-xs focus:outline-none transition-all"
                    />
                  </div>

                  {/* Organization */}
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Ansvarig Avsändare</label>
                    <select
                      value={selectedOrganization}
                      onChange={(e) => setSelectedOrganization(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-lg text-xs focus:outline-none transition-all"
                    >
                      {ORGANIZATIONS.map(org => <option key={org} value={org}>{org}</option>)}
                    </select>
                  </div>

                  {/* Location Name */}
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Platsnamn / Mötesplats</label>
                    <input
                      type="text"
                      value={selectedLocationName}
                      onChange={(e) => setSelectedLocationName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-lg text-xs focus:outline-none transition-all"
                    />
                  </div>

                  {/* Language */}
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Språk / Tolkning</label>
                    <input
                      type="text"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-lg text-xs focus:outline-none transition-all"
                    />
                  </div>

                  {/* Audience */}
                  <div className="space-y-1 col-span-2">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Målgrupp</label>
                    <select
                      value={selectedAudience}
                      onChange={(e) => setSelectedAudience(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-lg text-xs focus:outline-none transition-all"
                    >
                      <option value="Alla">Alla medlemmar & vänner</option>
                      <option value="Enbart missionärerna">Enbart heltidsmissionärerna</option>
                    </select>
                  </div>
                </div>

                {/* Original text read-only */}
                <div className="space-y-1 bg-brand-paper p-3 rounded-lg border border-brand-ink/5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">Originaltext (Omodifierad personlig inbjudan)</div>
                  <p className="text-xs text-brand-ink/80 italic">”{announcementText}”</p>
                </div>

                {/* GDPR Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-[11px] text-brand-ink/70 leading-normal cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={gdprChecked}
                      onChange={(e) => setGdprChecked(e.target.checked)}
                      className="mt-0.5 accent-brand-accent cursor-pointer shrink-0"
                    />
                    <span>
                      Jag bekräftar att detta inlägg <strong>inte innehåller några personuppgifter</strong> (t.ex. efternamn eller telefonnummer till intresserade/sökande) för utomstående, samt godkänner GDPR-efterlevnad.
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-ink/5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="font-mono text-[10px] uppercase tracking-wider text-brand-ink/60 hover:text-brand-ink transition-all cursor-pointer"
                  >
                    Föregående steg
                  </button>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="font-mono text-[10px] uppercase tracking-wider text-brand-ink/60 hover:text-brand-ink transition-all cursor-pointer"
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      disabled={sending || (washResult?.warnings?.missingAreaForTeaching && !selectedArea) || !gdprChecked}
                      className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-white bg-brand-accent hover:opacity-90 disabled:opacity-40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {sending ? (
                        <span>Skickar...</span>
                      ) : (
                        <>
                          <span>Godkänn & Spara</span>
                          <Send size={10} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
