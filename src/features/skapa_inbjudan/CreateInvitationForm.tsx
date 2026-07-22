// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan]

import React, { useState } from "react";
import { Send, CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { UiLanguage } from "../mission_router/translations";
import { GOTEBORG_AREAS } from "../anpassa/mapData";
import { washAnnouncementText } from "../mission_router/domain/parser";

export interface CreateInvitationFormProps {
  uiLanguage: UiLanguage;
  savedTags?: any;
  isAdmin?: boolean;
  onBack?: () => void;
  onSuccess?: () => void;
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

export default function CreateInvitationForm({
  uiLanguage,
  savedTags,
  isAdmin = false,
  onBack,
  onSuccess
}: CreateInvitationFormProps) {
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

  const [announcementText, setAnnouncementText] = useState<string>(() => buildTemplate(usageCount < 3));
  const [sending, setSending] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [washing, setWashing] = useState<boolean>(false);
  const [washResult, setWashResult] = useState<any | null>(null);

  const [selectedArea, setSelectedArea] = useState<string>(savedTags?.primaryArea || GOTEBORG_AREAS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Inbjudan");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("Arrangör");
  const [selectedAudience, setSelectedAudience] = useState<string>("Alla");

  const toggleHelpText = () => {
    const nextShow = !showHelpText;
    setShowHelpText(nextShow);
    setAnnouncementText(buildTemplate(nextShow));
  };

  const handleWash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setWashing(true);
    try {
      const response = await fetch("/api/wash-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: announcementText })
      });
      const data = await response.json();
      if (data.success && data.result) {
        setWashResult(data.result);
        if (data.result.extractedMetadata?.category) {
          setSelectedCategory(data.result.extractedMetadata.category);
        }
        if (data.result.extractedMetadata?.area) {
          setSelectedArea(data.result.extractedMetadata.area);
        }
        if (data.result.extractedMetadata?.time) {
          setSelectedTime(data.result.extractedMetadata.time);
        }
        if (data.result.extractedMetadata?.organization) {
          setSelectedOrganization(data.result.extractedMetadata.organization);
        }
        if (data.result.extractedMetadata?.targetAudience) {
          setSelectedAudience(data.result.extractedMetadata.targetAudience);
        }
      } else {
        const cleaned = washAnnouncementText(announcementText);
        setWashResult({
          cleanedText: cleaned,
          extractedMetadata: {
            category: "Inbjudan",
            area: savedTags?.primaryArea || GOTEBORG_AREAS[0],
            time: "18:00",
            organization: "Arrangör",
            targetAudience: "Alla"
          }
        });
      }
      setCurrentStep(2);
    } catch (err) {
      console.error("AI Wash error:", err);
      const cleaned = washAnnouncementText(announcementText);
      setWashResult({
        cleanedText: cleaned,
        extractedMetadata: {
          category: "Inbjudan",
          area: savedTags?.primaryArea || GOTEBORG_AREAS[0],
          time: "18:00",
          organization: "Arrangör",
          targetAudience: "Alla"
        }
      });
      setCurrentStep(2);
    } finally {
      setWashing(false);
    }
  };

  const handlePostInvitation = async () => {
    setSending(true);
    try {
      const cleanBody = washAnnouncementText(announcementText);

      const response = await fetch("/api/sim/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "0700000000",
          body: `#WEBB\nKategori: ${selectedCategory}\nTid: ${selectedTime || "18:00"}\nMötesplats: ${washResult?.extractedMetadata?.locationName || selectedArea}\nBjud in från områden: ${selectedArea}\nMålgrupp: ${selectedAudience}\nAvsändare: ${selectedOrganization}\nAktivitet: ${cleanBody}`
        })
      });

      if (response.ok) {
        const newUsage = usageCount + 1;
        setUsageCount(newUsage);
        localStorage.setItem("mission_router_usage_count", newUsage.toString());

        setToast("Inbjudan har publicerats på anslagstavlan!");
        setTimeout(() => setToast(null), 4000);

        setAnnouncementText(buildTemplate(newUsage < 3));
        setCurrentStep(1);
        setWashResult(null);

        if (onSuccess) onSuccess();
      } else {
        alert("Kunde inte skapa inbjudan. Försök igen.");
      }
    } catch (err) {
      console.error("Failed to post invitation:", err);
      alert("Nätverksfel vid skapande av inbjudan.");
    } finally {
      setSending(false);
    }
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
                  type="button"
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

            <div className="p-4 bg-brand-paper/20 rounded-xl border border-brand-ink/5 space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent">
                {uiLanguage === "sv" ? "Rensad text (Anonymiserad)" : "Cleaned text (Anonymized)"}
              </span>
              <p className="text-xs font-mono text-brand-ink/80 whitespace-pre-wrap leading-relaxed">
                {washAnnouncementText(announcementText)}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePostInvitation}
                disabled={sending}
                className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Publicerar...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} className="text-white" />
                    <span>Publicera direkt på anslagstavlan</span>
                  </>
                )}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-brand-ink/10"></div>
                <span className="flex-shrink mx-3 font-mono text-[9px] text-brand-ink/40 uppercase">Eller skicka via SMS/QR</span>
                <div className="flex-grow border-t border-brand-ink/10"></div>
              </div>

              {isMobile ? (
                <a
                  href={smsHref}
                  className="w-full py-3.5 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Send size={14} className="text-brand-accent" />
                  <span>Öppna SMS-app för insändning</span>
                </a>
              ) : (
                <div className="p-4 bg-brand-bg rounded-xl border border-brand-ink/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <img src={qrUrl} alt="SMS QR Code" className="w-24 h-24 rounded-lg border border-brand-ink/10 shrink-0" />
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-semibold text-brand-ink">
                      Skanna med din mobiltelefon
                    </span>
                    <p className="text-[11px] text-brand-ink/70 leading-relaxed font-light">
                      Koden öppnar din SMS-app med den rensade inbjudan färdig att skicka till modereings-gatewayen.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
