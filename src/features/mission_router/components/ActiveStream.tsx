// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect } from "react";
import { ExternalLink, Send, CheckCircle, Sparkles, ShieldAlert } from "lucide-react";
import { ActiveAlert } from "../types";
import { TRANSLATIONS, UiLanguage } from "../translations";
import { GOTEBORG_AREAS } from "../domain/mapData";

interface ActiveStreamProps {
  onSelectAlert: (id: string) => void;
  uiLanguage: UiLanguage;
  savedTags: any;
  onStreamCountChange?: (filteredCount: number, totalCount: number) => void;
  inlineCreate?: boolean;
}

const ORGANIZATIONS = [
  "Enskild/Familj",
  "Äldstekvorum",
  "Hjälpförening",
  "Församlingsmissionärer",
  "Heltidsmissionärer",
  "Biskopsråd",
  "Unga kvinnor (UK)",
  "Unga män (UM)",
  "Primär",
  "Söndagsskola",
  "Aktivitetskommittén",
  "Unga vuxna (UV)",
  "Ensamstående vuxna (EV)",
  "Institutet",
  "Seminariet",
  "Staven"
];

export default function ActiveStream({
  onSelectAlert,
  uiLanguage,
  savedTags,
  onStreamCountChange,
  inlineCreate = false
}: ActiveStreamProps) {
  const [stream, setStream] = useState<ActiveAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for creating an invitation (Väntrummet)
  const [announcementText, setAnnouncementText] = useState<string>("Tid: \nPlats: \nVad vi ska göra: ");
  const [sending, setSending] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Two-step invitation flow states
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [washing, setWashing] = useState<boolean>(false);
  const [washResult, setWashResult] = useState<any>(null);

  // Editable metadata fields for Step 2
  const [selectedCategory, setSelectedCategory] = useState<string>("Vara en vän");
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
      
      const sorted = data.sort((a: any, b: any) => b.timestamp - a.timestamp);
      setStream(sorted);
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

  // Dynamic filter logic based on savedTags
  const filteredStream = stream.filter(item => {
    if (!savedTags) return true;

    // 1. Language Filter
    if (savedTags.languages && savedTags.languages.length > 0) {
      if (!savedTags.languages.includes(item.language)) {
        return false;
      }
    }

    // 2. Organization Filter
    if (savedTags.limitOrganizations && savedTags.limitedOrganizations && savedTags.limitedOrganizations.length > 0) {
      if (!savedTags.limitedOrganizations.includes(item.responsibleParty)) {
        return false;
      }
    }

    // 3. Area Filter (Primary Area always bypasses geographic limits!)
    const primary = savedTags.primaryArea;
    if (primary && item.area === primary) {
      return true;
    }

    if (savedTags.limitAreas && savedTags.limitedAreas && savedTags.limitedAreas.length > 0) {
      if (!savedTags.limitedAreas.includes(item.area)) {
        return false;
      }
    }

    return true;
  });

  // Keep parent up-to-date with active stream count changes in real time
  useEffect(() => {
    if (onStreamCountChange) {
      onStreamCountChange(filteredStream.length, stream.length);
    }
  }, [filteredStream.length, stream.length]);

  const getEmptyDesc = () => {
    switch (uiLanguage) {
      case "en": return "There are no active invitations in your chosen areas right now. You will receive a notification as soon as a new invitation is posted.";
      case "es": return "No hay invitaciones activas en sus áreas seleccionadas en este momento. Recibirá una notificación tan pronto como se publique una nueva invitación.";
      case "sw": return "Hakuna mialiko hai kwa sasa katika maeneo uliyochagua. Utapokea arifa mwaliko mpya unapowekwa.";
      case "vi": return "Hiện tại không có lời mời nào trong các khu vực bạn đã chọn. Bạn sẽ nhận được thông báo ngay khi có lời mời mới.";
      default: return "Just nu finns inga aktiva inbjudningar i dina valda områden. Du får en avisering så fort en ny inbjudan läggs upp.";
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

      setSelectedCategory(data.extractedMetadata.category || "Vara en vän");
      setSelectedArea(data.extractedMetadata.area || "");
      setSelectedTime(data.extractedMetadata.time || "");
      setSelectedAudience(data.extractedMetadata.audience || "Alla");
      setSelectedOrganization(data.extractedMetadata.organization || "Enskild/Familj");
      setSelectedLocationName(data.extractedMetadata.locationName || "Kapellet");
      setSelectedLanguage(data.extractedMetadata.language || "Svenska");

      setCurrentStep(2);
    } catch (err: any) {
      const msg = uiLanguage === "sv" ? "Fel vid AI-analys: " : "AI analysis error: ";
      alert(msg + err.message);
    } finally {
      setWashing(false);
    }
  };

  // Enhetsdetektering för att styra SMS vs QR-kod
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const smsPayload = washResult ? `#WEBB
Kategori: ${selectedCategory}
Tid: ${selectedTime}
Område: ${selectedArea}
Avsändare: ${selectedOrganization || "Arrangör"}
Text: ${announcementText}` : "";
  
  const smsHref = `sms:0736108997?body=${encodeURIComponent(smsPayload)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(smsHref)}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (inlineCreate) {
    return (
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        {toast && (
          <div id="toast-success-message" className="p-4 bg-brand-accent/5 border border-brand-accent/10 text-brand-accent text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <CheckCircle size={14} className="text-brand-accent shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs animate-in fade-in duration-200">
          <div>
            <p className="font-mono text-[9px] text-brand-accent uppercase tracking-wider">
              {currentStep === 1 
                ? (uiLanguage === "sv" ? "Steg 1: Beskriv inbjudan och låt AI extrahera detaljer" : "Step 1: Describe the invitation and let AI extract details") 
                : (uiLanguage === "sv" ? "Steg 2: Granska förslag, justera och godkänn" : "Step 2: Review suggestions, adjust and approve")
              }
            </p>
          </div>

          {currentStep === 1 ? (
            <form onSubmit={handleWash} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                  {uiLanguage === "sv" ? "Beskriv aktivitet eller inbjudan (fritext)" : "Describe activity or invitation (free text)"}
                </label>
                <textarea
                  required
                  rows={4}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder={uiLanguage === "sv" ? "Skriv helt fritt, t.ex: Bjuder på fika och varm soppa hemma hos oss i Partille nu på tisdag kl 18. Vi talar svenska och engelska!" : "Write freely, e.g.: Hosting fika and warm soup at our place in Partille this Tuesday at 6 PM. We speak Swedish and English!"}
                  className="w-full px-4 py-3 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-xl text-brand-ink text-xs focus:outline-none transition-all placeholder-brand-ink/30 resize-none leading-relaxed font-light"
                />
                <span className="font-mono text-[9px] text-brand-accent/70 block mt-1 leading-normal uppercase">
                  {uiLanguage === "sv" 
                    ? "Tips: Berätta vad ni bjuder in till, stadsdel, dag/tid och vilka språk som talas. AI:n föreslår taggar automatiskt!" 
                    : "Tip: Tell us what you are inviting to, neighborhood, day/time, and what languages are spoken. The AI suggests tags automatically!"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-4 pt-3 border-t border-brand-ink/5">
                <button
                  type="submit"
                  disabled={washing || !announcementText.trim()}
                  className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-white bg-brand-accent hover:opacity-90 disabled:opacity-40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {washing ? (
                    <span>{uiLanguage === "sv" ? "Analyserar..." : "Analyzing..."}</span>
                  ) : (
                    <>
                      <span>{uiLanguage === "sv" ? "Förhandsgranska" : "Preview"}</span>
                      <Send size={10} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/15 flex gap-3">
                <Sparkles size={16} className="text-brand-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-brand-accent font-semibold">
                    {uiLanguage === "sv" ? "AI Rådgivare" : "AI Advisor"}
                  </div>
                  <p className="text-brand-ink/80 text-xs leading-relaxed font-light whitespace-pre-line">
                    {washResult?.aiFeedback}
                  </p>
                </div>
              </div>

              {washResult?.warnings?.missingAreaForTeaching && !selectedArea && (
                <div className="p-3 bg-brand-error/10 text-brand-error rounded-xl border border-brand-error/20 font-mono text-[10px] uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>
                    {uiLanguage === "sv" 
                      ? "Geografisk Blockering: Du måste välja ett område i listan nedan för att kunna skicka." 
                      : "Geographic Block: You must select an area from the list below to send."}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Huvudtema" : "Category"}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      if (washResult) {
                        setWashResult({
                          ...washResult,
                          extractedMetadata: { ...washResult.extractedMetadata, category: e.target.value }
                        });
                      }
                    }}
                    className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors"
                  >
                    <option value="Vara en vän">{uiLanguage === "sv" ? "Vara en vän" : "Be a friend"}</option>
                    <option value="Få näring av Guds ord">{uiLanguage === "sv" ? "Få näring av Guds ord" : "Nourished by the word"}</option>
                    <option value="Hjälpa andra">{uiLanguage === "sv" ? "Hjälpa andra" : "Help others"}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Stöddistrikt / Område" : "Support District / Area"}
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => {
                      setSelectedArea(e.target.value);
                      if (washResult) {
                        setWashResult({
                          ...washResult,
                          extractedMetadata: { ...washResult.extractedMetadata, area: e.target.value }
                        });
                      }
                    }}
                    className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors"
                  >
                    <option value="">{uiLanguage === "sv" ? "Välj område..." : "Select area..."}</option>
                    {GOTEBORG_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Tidpunkt (t.ex. 18:00)" : "Time (e.g. 18:00)"}
                  </label>
                  <input
                    type="text"
                    placeholder="HH:MM"
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                      if (washResult) {
                        setWashResult({
                          ...washResult,
                          extractedMetadata: { ...washResult.extractedMetadata, time: e.target.value }
                        });
                      }
                    }}
                    className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Ansvarig Avsändare" : "Responsible Sender"}
                  </label>
                  <select
                    value={selectedOrganization}
                    onChange={(e) => {
                      setSelectedOrganization(e.target.value);
                      if (washResult) {
                        setWashResult({
                          ...washResult,
                          extractedMetadata: { ...washResult.extractedMetadata, organization: e.target.value }
                        });
                      }
                    }}
                    className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors"
                  >
                    {ORGANIZATIONS.map(org => <option key={org} value={org}>{org}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Platsnamn / Mötesplats" : "Location Name / Meeting Spot"}
                  </label>
                  <input
                    type="text"
                    value={selectedLocationName}
                    onChange={(e) => {
                      setSelectedLocationName(e.target.value);
                      if (washResult) {
                        setWashResult({
                          ...washResult,
                          extractedMetadata: { ...washResult.extractedMetadata, locationName: e.target.value }
                        });
                      }
                    }}
                    className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Språk / Tolkning" : "Language / Interpretation"}
                  </label>
                  <input
                    type="text"
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      if (washResult) {
                        setWashResult({
                          ...washResult,
                          extractedMetadata: { ...washResult.extractedMetadata, language: e.target.value }
                        });
                      }
                    }}
                    className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Målgrupp" : "Target Audience"}
                  </label>
                  <select
                    value={selectedAudience}
                    onChange={(e) => {
                      setSelectedAudience(e.target.value);
                      if (washResult) {
                        setWashResult({
                          ...washResult,
                          extractedMetadata: { ...washResult.extractedMetadata, audience: e.target.value }
                        });
                      }
                    }}
                    className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-sm focus:border-brand-accent focus:outline-none transition-colors"
                  >
                    <option value="Alla">{uiLanguage === "sv" ? "Alla medlemmar & vänner" : "All members & friends"}</option>
                    <option value="Enbart missionärerna">{uiLanguage === "sv" ? "Enbart heltidsmissionärerna" : "Full-time missionaries only"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 bg-brand-paper p-3 rounded-lg border border-brand-ink/5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                  {uiLanguage === "sv" ? "Inbjudningstext (Redigerbar)" : "Invitation Text (Editable)"}
                </div>
                <textarea
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full p-2 bg-white/50 border border-brand-ink/10 rounded-xl text-xs focus:border-brand-accent focus:outline-none transition-colors resize-none font-light leading-relaxed text-brand-ink"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-[11px] text-brand-ink/70 leading-normal cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gdprChecked}
                    onChange={(e) => setGdprChecked(e.target.checked)}
                    className="mt-0.5 accent-brand-accent cursor-pointer shrink-0"
                  />
                  <span>
                    {uiLanguage === "sv" ? (
                      <>Jag förstår att min inbjudan granskas innan publicering. Jag bekräftar att jag inte delar andras personuppgifter (som efternamn eller nummer) i texten utan deras uttryckliga godkännande.</>
                    ) : (
                      <>I understand that my invitation is reviewed before publication. I confirm that I am not sharing others' personal data (like last names or numbers) in the text without their explicit consent.</>
                    )}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-ink/5">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="font-mono text-[10px] uppercase tracking-wider text-brand-ink/60 hover:text-brand-ink transition-all cursor-pointer"
                >
                  {uiLanguage === "sv" ? "Föregående steg" : "Previous step"}
                </button>
                <div className="flex items-center gap-4">
                  {(washResult?.warnings?.missingAreaForTeaching && !selectedArea) ? (
                    <button disabled className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-white bg-brand-accent/50 rounded-lg cursor-not-allowed">
                      {uiLanguage === "sv" ? "Välj Område Först" : "Select Area First"}
                    </button>
                  ) : !gdprChecked ? (
                    <button disabled className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-white bg-brand-accent/50 rounded-lg cursor-not-allowed">
                      {uiLanguage === "sv" ? "Acceptera villkoren" : "Accept Terms"}
                    </button>
                  ) : isMobile ? (
                    <a
                      href={smsHref}
                      className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-green-600 hover:bg-green-500 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>{uiLanguage === "sv" ? "Publicera direkt via SMS" : "Publish directly via SMS"}</span>
                      <Send size={14} />
                    </a>
                  ) : (
                    <div className="flex flex-col items-center p-3 bg-brand-paper/50 rounded-xl border border-brand-ink/10">
                      <img src={qrUrl} alt="QR Code to SMS" className="w-24 h-24 mb-2 rounded shadow-sm" />
                      <span className="text-[9px] font-mono uppercase tracking-wider text-brand-ink/70 text-center max-w-[120px]">
                        {uiLanguage === "sv" ? "Skanna med din mobilkamera för att skicka texten med SMS till publicering" : "Scan with mobile camera to send text via SMS for publication"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {toast && (
        <div id="toast-success-message" className="p-4 bg-brand-accent/5 border border-brand-accent/10 text-brand-accent text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle size={14} className="text-brand-accent shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-brand-error/10 text-brand-error rounded-xl border border-brand-error/20 font-mono text-xs uppercase tracking-wider">
          {error}
        </div>
      )}

      {/* Stream List Cards */}
      {filteredStream.length === 0 ? (
        <div className="p-8 bg-white border border-brand-ink/5 rounded-2xl text-center space-y-4">
          <p className="font-serif italic text-sm sm:text-base text-brand-ink/70 leading-relaxed font-light">
            {getEmptyDesc()}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStream.map(item => {
            return (
              <div
                key={item.id}
                id={`announcement-card-${item.id}`}
                onClick={() => onSelectAlert(item.id)}
                className="p-6 rounded-2xl border border-brand-ink/5 transition-all cursor-pointer bg-white hover:border-brand-accent/40 active:scale-[0.99] group relative overflow-hidden flex flex-col gap-4 duration-200 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2 py-0.5 rounded">
                      {TRANSLATIONS[uiLanguage].activeRequest}
                    </span>
                    <span className="font-mono text-[9px] text-brand-accent/60 bg-brand-paper/50 px-1.5 py-0.5 rounded">
                      ID: {item.id}
                    </span>
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

                  <button className="font-mono text-[9px] uppercase tracking-[0.12em] text-brand-ink group-hover:opacity-100 opacity-60 border-b border-transparent group-hover:border-brand-ink pb-0.5 transition-all duration-200 flex items-center gap-1 cursor-pointer">
                    {getButtonText()}
                    <ExternalLink size={10} className="stroke-[1.5]" />
                  </button>
                </div>
              </div>
            );
          })}
          
          <p className="text-center text-[10px] font-mono text-brand-ink/40 tracking-wider pt-6 pb-2">
            {TRANSLATIONS[uiLanguage].showingCount
              .replace("{count}", String(filteredStream.length))
              .replace("{total}", String(stream.length))}
          </p>
        </div>
      )}
    </div>
  );
}
