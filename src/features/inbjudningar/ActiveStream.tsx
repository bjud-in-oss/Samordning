// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect } from "react";
import { ExternalLink, Send, CheckCircle, Sparkles, ShieldAlert, ArrowLeft } from "lucide-react";
import { ActiveAlert } from "../mission_router/types";
import { TRANSLATIONS, UiLanguage } from "../mission_router/translations";
import { GOTEBORG_AREAS } from "../anpassa/mapData";
import { washAnnouncementText } from "../mission_router/domain/parser";

interface ActiveStreamProps {
  onSelectAlert: (id: string) => void;
  uiLanguage: UiLanguage;
  savedTags?: any;
  onStreamCountChange?: (filteredCount: number, totalCount: number) => void;
  inlineCreate?: boolean;
  isAdmin?: boolean;
  onBack?: () => void;
  pushEnabled?: boolean;
}

const ORGANIZATIONS = [
  "Kyrkoherde",
  "Diakon/Rådgivare",
  "Unga vuxna",
  "Primärföreningen",
  "Hjälpföreningen",
  "Äldstes kvorum",
  "Enskild/Familj",
  "Missionärer",
  "Biskopsrådet",
  "Staven"
];

export default function ActiveStream({
  onSelectAlert,
  uiLanguage,
  savedTags,
  onStreamCountChange,
  inlineCreate = false,
  isAdmin = false,
  onBack,
  pushEnabled = false
}: ActiveStreamProps) {
  const [stream, setStream] = useState<ActiveAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Usage count & adaptive help state
  const [usageCount, setUsageCount] = useState<number>(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("mission_router_usage_count");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [showHelpText, setShowHelpText] = useState<boolean>(usageCount < 3);

  const defaultAreaString = savedTags?.limitedAreas && savedTags.limitedAreas.length > 0 
    ? savedTags.limitedAreas.join(", ") 
    : (savedTags?.primaryArea || "Alla områden");

  const buildTemplate = (showHelp: boolean) => {
    if (showHelp) {
      return `Tid: (t.ex. Idag kl 18:00)\nMötesplats: (Var ses vi fysiskt, eller länk/telefon)\nAktivitet: (Vad ska vi göra?)\nBjud in från områden: ${defaultAreaString}\nMålgrupp: Alla`;
    }
    return `Tid: \nMötesplats: \nAktivitet: \nBjud in från områden: ${defaultAreaString}\nMålgrupp: Alla`;
  };

  // Form states for creating an invitation
  const [announcementText, setAnnouncementText] = useState<string>(() => buildTemplate(usageCount < 3));
  const [sending, setSending] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // AI Wash Stepper & Edit States
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [washing, setWashing] = useState<boolean>(false);
  const [washResult, setWashResult] = useState<any | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("Vara en vän");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("Alla");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("Enskild/Familj");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Svenska");

  const fetchStream = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/alerts");
      if (!res.ok) {
        throw new Error("Gick inte att läsa in aktiva anslag.");
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Servern returnerade inte JSON vid hämtning av anslag.");
      }
      const data = await res.json();
      setStream(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Tekniskt fel vid inläsning.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 15000); // Polla var 15:e sekund
    return () => clearInterval(interval);
  }, []);

  // Filter Stream based on User Preferences
  const filteredStream = stream.filter(item => {
    if (!savedTags) return true; // Show all if no filters saved

    // 1. Geography filter
    if (savedTags.limitAreas && savedTags.limitedAreas && savedTags.limitedAreas.length > 0) {
      if (item.area && !savedTags.limitedAreas.includes(item.area)) {
        return false;
      }
    }

    // 2. Format / Category filter
    if (savedTags.enabledCategories && savedTags.enabledCategories.length > 0) {
      if (item.category && !savedTags.enabledCategories.includes(item.category)) {
        return false;
      }
    }

    // 3. Organization / Target Group filter
    if (savedTags.organizations && savedTags.organizations.length > 0) {
      if (item.responsibleParty && !savedTags.organizations.includes(item.responsibleParty)) {
        return false;
      }
    }

    // 4. Language filter
    if (savedTags.languages && savedTags.languages.length > 0) {
      if (item.language && !savedTags.languages.includes(item.language)) {
        return false;
      }
    }

    return true;
  });

  // Notify parent of stream count updates
  useEffect(() => {
    if (onStreamCountChange) {
      onStreamCountChange(filteredStream.length, stream.length);
    }
  }, [filteredStream.length, stream.length, onStreamCountChange]);

  const handleWash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const washedCleanText = washAnnouncementText(announcementText);

    setWashing(true);
    try {
      const res = await fetch("/api/wash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: washedCleanText })
      });

      if (!res.ok) throw new Error("Gick inte att tvätta inbjudan.");
      const data = await res.json();
      setWashResult(data);

      setSelectedCategory(data.extractedMetadata.category || "Vara en vän");
      setSelectedArea(data.extractedMetadata.area || defaultAreaString);
      setSelectedTime(data.extractedMetadata.time || "");
      setSelectedAudience(data.extractedMetadata.audience || "Alla");
      setSelectedOrganization(data.extractedMetadata.organization || "Enskild/Familj");
      setSelectedLanguage(data.extractedMetadata.language || "Svenska");

      setAnnouncementText(washedCleanText);

      const newCount = usageCount + 1;
      setUsageCount(newCount);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mission_router_usage_count", newCount.toString());
      }

      setCurrentStep(2);
    } catch (err: any) {
      const msg = uiLanguage === "sv" ? "Fel vid AI-analys: " : "AI analysis error: ";
      alert(msg + err.message);
    } finally {
      setWashing(false);
    }
  };

  const toggleHelpText = () => {
    const nextShow = !showHelpText;
    setShowHelpText(nextShow);
    setAnnouncementText(buildTemplate(nextShow));
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const smsPayload = washResult ? `#WEBB
Kategori: ${selectedCategory}
Tid: ${selectedTime || "18:00"}
Mötesplats: ${washResult.extractedMetadata.locationName || selectedArea}
Bjud in från områden: ${selectedArea}
Målgrupp: ${selectedAudience}
Avsändare: ${selectedOrganization || "Arrangör"}
Aktivitet: ${washAnnouncementText(announcementText)}` : "";
  
  const smsHref = `sms:0736108997?body=${encodeURIComponent(smsPayload)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(smsHref)}`;

  if (inlineCreate) {
    return (
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-ink/60 hover:text-brand-ink transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Tillbaka</span>
          </button>
        )}

        {toast && (
          <div id="toast-success-message" className="p-4 bg-brand-accent/5 border border-brand-accent/10 text-brand-accent text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <CheckCircle size={14} className="text-brand-accent shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-ink/5 space-y-6 text-left">
          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent font-semibold">
              {uiLanguage === "sv" ? "Mottagare & Anslagstavla" : "Recipients & Noticeboard"}
            </span>
            <h2 className="font-serif italic text-2xl font-medium text-brand-ink">
              {uiLanguage === "sv" ? "Bjud in andra" : "Invite others"}
            </h2>
            <p className="text-brand-ink/70 text-xs leading-relaxed font-light">
              {uiLanguage === "sv" 
                ? "Skapa en inbjudan till en gemensam samling, fika, samtal eller aktivitet. Vår AI extraherar automatiskt tid, plats och taggar."
                : "Create an invitation to a gathering, fika, discussion or activity. Our AI automatically extracts time, location and tags."}
            </p>
          </div>

          {currentStep === 1 ? (
            <form onSubmit={handleWash} className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "Skapa inbjudan (Universell 5-raders mall)" : "Create invitation (Universal 5-line template)"}
                  </label>
                  <button
                    type="button"
                    onClick={toggleHelpText}
                    className="font-mono text-[10px] uppercase tracking-wider text-brand-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showHelpText ? "Dölj hjälp ( .? )" : "Visa hjälp ( .? )"}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={6}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-brand-ink/10 focus:border-brand-accent rounded-xl text-brand-ink text-xs focus:outline-none transition-all placeholder-brand-ink/30 resize-none leading-relaxed font-mono"
                />
                <span className="font-mono text-[9px] text-brand-accent/70 block mt-1 leading-normal uppercase">
                  {uiLanguage === "sv" 
                    ? "Tips: Instruktioner inom parentes ( ... ) rensas automatiskt bort när inbjudan skickas ut." 
                    : "Tip: Instructions inside parentheses ( ... ) are automatically cleaned up when sending."}
                </span>
              </div>

              <button
                type="submit"
                disabled={washing || !announcementText.trim()}
                className="w-full py-3.5 bg-brand-ink hover:bg-brand-ink/90 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {washing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>{uiLanguage === "sv" ? "Analyserar inbjudan..." : "Analyzing invitation..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-brand-paper" />
                    <span>{uiLanguage === "sv" ? "Granska & generera QR/SMS" : "Review & generate QR/SMS"}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-brand-paper/40 rounded-xl border border-brand-ink/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                    {uiLanguage === "sv" ? "AI-extraherade taggar & detaljer" : "AI-extracted tags & details"}
                  </span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="font-mono text-[9px] uppercase tracking-wider text-brand-ink/60 hover:text-brand-ink underline cursor-pointer"
                  >
                    {uiLanguage === "sv" ? "Redigera text" : "Edit text"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase text-brand-ink/60">Kategori</label>
                    <input
                      type="text"
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-ink/10 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase text-brand-ink/60">Område</label>
                    <select
                      value={selectedArea}
                      onChange={e => setSelectedArea(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-ink/10 rounded-lg text-xs font-mono"
                    >
                      {GOTEBORG_AREAS.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase text-brand-ink/60">Tid / Dag</label>
                    <input
                      type="text"
                      value={selectedTime}
                      onChange={e => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-ink/10 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase text-brand-ink/60">Arrangör</label>
                    <select
                      value={selectedOrganization}
                      onChange={e => setSelectedOrganization(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-ink/10 rounded-lg text-xs font-mono"
                    >
                      {ORGANIZATIONS.map(org => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Mobile SMS vs Desktop QR Code */}
              <div className="space-y-4 pt-2">
                {isMobile ? (
                  <a
                    href={smsHref}
                    className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={16} />
                    <span>{uiLanguage === "sv" ? "Skicka SMS för publicering" : "Send SMS to publish"}</span>
                  </a>
                ) : (
                  <div className="p-6 bg-brand-bg rounded-xl border border-brand-ink/10 text-center space-y-4 flex flex-col items-center">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-brand-accent font-semibold">
                      {uiLanguage === "sv" ? "Skanna med din mobil för att publicera" : "Scan with your phone to publish"}
                    </span>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-brand-ink/5">
                      <img src={qrUrl} alt="QR för SMS" className="w-36 h-36" />
                    </div>
                    <p className="text-[11px] text-brand-ink/70 max-w-xs leading-normal font-light">
                      {uiLanguage === "sv" 
                        ? "Skanna QR-koden med mobilkameran för att öppna ditt förberedda SMS. När du skickar SMS:et publiceras inbjudan."
                        : "Scan the QR code with your phone camera to open your prefilled SMS. Sending the SMS publishes the invitation."}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-2.5 text-brand-ink/60 hover:text-brand-ink font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {uiLanguage === "sv" ? "Börja om / Ny inbjudan" : "Start over / New invitation"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Feed list */}
      <div className="space-y-4 text-left">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-brand-ink/5 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-ink/60">
              {uiLanguage === "sv" ? "Hämtar anslag..." : "Loading notices..."}
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 border border-brand-ink/5 text-center space-y-2">
            <ShieldAlert size={24} className="text-brand-error mx-auto opacity-80" />
            <p className="text-xs font-mono text-brand-error uppercase tracking-wider">{error}</p>
          </div>
        ) : filteredStream.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-brand-ink/5 text-center space-y-4">
            <p className="font-serif italic text-base sm:text-lg text-brand-ink/80 leading-relaxed">
              {pushEnabled 
                ? "Just nu finns inga aktiva inbjudningar i dina valda områden. Du får en avisering så fort en ny inbjudan läggs upp." 
                : "Just nu finns inga aktiva inbjudningar i dina valda områden. Du ser nya inbjudningar här så fort de läggs upp."}
            </p>
            <div className="pt-3 border-t border-brand-ink/5 space-y-3">
              <p className="text-xs text-brand-ink/60 font-light">
                Ska du ändå ta en fika, promenad eller fixa något i trädgården?
              </p>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-create-invitation"));
                }}
                className="w-full py-3.5 px-4 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>➕ Skapa en snabb inbjudan för det du redan gör</span>
              </button>
            </div>
          </div>
        ) : (
          filteredStream.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectAlert(item.id)}
              className="bg-white rounded-2xl p-6 border border-brand-ink/5 hover:border-brand-accent/30 transition-all shadow-xs hover:shadow-md cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded bg-brand-paper text-brand-accent font-semibold">
                  {item.category || "Vara en vän"}
                </span>
                <span className="font-mono text-[10px] text-brand-ink/50 font-light">
                  {item.time || "Fast tid ej angiven"}
                </span>
              </div>

              <div>
                <h3 className="font-serif italic text-xl text-brand-ink font-medium group-hover:text-brand-accent transition-colors">
                  Inbjudan • {item.area}
                </h3>
                <p className="text-xs text-brand-ink/80 font-light line-clamp-2 mt-1 leading-relaxed">
                  {item.scrubbedText || item.rawText}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-brand-ink/5 text-[10px] font-mono text-brand-ink/50 uppercase tracking-wider">
                <span>{item.responsibleParty || "Arrangör"}</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-brand-accent font-semibold">
                  <span>Visa detaljer</span>
                  <ExternalLink size={12} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
