// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Pure PWA Form with Dynamic Reglage & Personal Favorites

import React, { useState } from "react";
import { Send, CheckCircle, Sparkles, ArrowLeft, Clock, MapPin, Users, Globe, Star, Trash2 } from "lucide-react";
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

const TIME_REGLAGE = ["Idag kl 18:00", "Ikväll kl 19:00", "Imorgon kl 15:00", "Lördag kl 10:00", "Söndag kl 11:00"];
const AUDIENCE_REGLAGE = ["Alla", "Ungdomar", "Vuxna/Seniorer", "Barnfamiljer", "Enskild"];

export default function CreateInvitationForm({
  uiLanguage,
  savedTags,
  isAdmin = false,
  onBack,
  onSuccess
}: CreateInvitationFormProps) {
  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<any[]>(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("mission_router_favorites");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

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
      return `Tid: (t.ex. Idag kl 18:00)\nMötesplats: (Var ses vi fysiskt, eller länk/telefon)\nAktivitet: (Vad ska vi göra? Write free text...)\nBjud in från områden: ${defaultAreaString}\nMålgrupp: Alla`;
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
  const [selectedTime, setSelectedTime] = useState<string>("Idag kl 18:00");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("Arrangör");
  const [selectedAudience, setSelectedAudience] = useState<string>("Alla");
  const [locationName, setLocationName] = useState<string>(savedTags?.primaryArea || GOTEBORG_AREAS[0]);

  // Modal reglage toggles
  const [activeReglage, setActiveReglage] = useState<"time" | "location" | "area" | "audience" | null>(null);

  const saveAsFavorite = () => {
    const newFav = {
      id: Date.now().toString(),
      label: `${selectedCategory} (${selectedTime || "18:00"})`,
      category: selectedCategory,
      area: selectedArea,
      time: selectedTime,
      location: locationName,
      audience: selectedAudience,
      organization: selectedOrganization,
      text: announcementText
    };
    const updated = [newFav, ...favorites.slice(0, 9)];
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_favorites", JSON.stringify(updated));
    }
    setToast("Inbjudan sparades som personlig favorit!");
    setTimeout(() => setToast(null), 3000);
  };

  const removeFavorite = (favId: string) => {
    const updated = favorites.filter(f => f.id !== favId);
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_favorites", JSON.stringify(updated));
    }
  };

  const applyFavorite = (fav: any) => {
    setSelectedCategory(fav.category || "Inbjudan");
    setSelectedArea(fav.area || GOTEBORG_AREAS[0]);
    setSelectedTime(fav.time || "Idag kl 18:00");
    setLocationName(fav.location || fav.area || GOTEBORG_AREAS[0]);
    setSelectedAudience(fav.audience || "Alla");
    setSelectedOrganization(fav.organization || "Arrangör");
    if (fav.text) setAnnouncementText(fav.text);
  };

  const updateTemplateField = (field: string, value: string) => {
    setAnnouncementText(prev => {
      const lines = prev.split("\n");
      const fieldIndex = lines.findIndex(l => l.toLowerCase().startsWith(field.toLowerCase() + ":"));
      if (fieldIndex !== -1) {
        lines[fieldIndex] = `${field}: ${value}`;
        return lines.join("\n");
      }
      return `${prev}\n${field}: ${value}`;
    });
  };

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
        if (data.result.extractedMetadata?.locationName) {
          setLocationName(data.result.extractedMetadata.locationName);
        } else {
          setLocationName(selectedArea);
        }
      } else {
        const cleaned = washAnnouncementText(announcementText);
        setWashResult({
          cleanedText: cleaned,
          extractedMetadata: {
            category: selectedCategory || "Inbjudan",
            area: savedTags?.primaryArea || GOTEBORG_AREAS[0],
            time: selectedTime || "18:00",
            organization: "Arrangör",
            targetAudience: "Alla"
          }
        });
        setLocationName(selectedArea);
      }
      setCurrentStep(2);
    } catch (err) {
      console.error("AI Wash error:", err);
      const cleaned = washAnnouncementText(announcementText);
      setWashResult({
        cleanedText: cleaned,
        extractedMetadata: {
          category: selectedCategory || "Inbjudan",
          area: savedTags?.primaryArea || GOTEBORG_AREAS[0],
          time: selectedTime || "18:00",
          organization: "Arrangör",
          targetAudience: "Alla"
        }
      });
      setLocationName(selectedArea);
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
          body: `#WEBB\nKategori: ${selectedCategory}\nTid: ${selectedTime || "18:00"}\nMötesplats: ${locationName || selectedArea}\nBjud in från områden: ${selectedArea}\nMålgrupp: ${selectedAudience}\nAvsändare: ${selectedOrganization}\nAktivitet: ${cleanBody}`
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
  const cleanedBody = washAnnouncementText(announcementText);
  const smsPayload = `#WEBB
Kategori: ${selectedCategory}
Tid: ${selectedTime || "18:00"}
Mötesplats: ${locationName || selectedArea}
Bjud in från områden: ${selectedArea}
Målgrupp: ${selectedAudience}
Avsändare: ${selectedOrganization || "Arrangör"}
Aktivitet: ${cleanedBody}`;

  const gatewayNumber = "0736108997";
  const smsHref = `sms:${gatewayNumber}?body=${encodeURIComponent(smsPayload)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(smsHref)}`;

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
            {/* Saved Personal Favorites */}
            {favorites.length > 0 && (
              <div className="space-y-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                <label className="font-mono text-[9px] uppercase tracking-wider text-amber-900 font-semibold block">
                  ⭐ Mina sparade favoriter ({favorites.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="inline-flex items-center gap-1 bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => applyFavorite(fav)}
                        className="text-amber-950 hover:text-brand-accent transition-colors text-left"
                      >
                        <span>{fav.label}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFavorite(fav.id)}
                        className="text-amber-700/50 hover:text-rose-600 ml-1 text-[10px]"
                        title="Ta bort favorit"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reglageknappar för snabbval */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-wider text-brand-ink/60 block">
                {uiLanguage === "sv" ? "Snabb-reglage (Tid, Mötesplats, Område, Målgrupp)" : "Quick Reglage (Time, Location, Area, Audience)"}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReglage(activeReglage === "time" ? null : "time")}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeReglage === "time" ? "bg-brand-accent text-white border-brand-accent" : "bg-brand-paper hover:bg-brand-accent/10 border-brand-ink/10 text-brand-ink"
                  }`}
                >
                  <Clock size={13} />
                  <span>Tid: {selectedTime}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReglage(activeReglage === "location" ? null : "location")}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeReglage === "location" ? "bg-brand-accent text-white border-brand-accent" : "bg-brand-paper hover:bg-brand-accent/10 border-brand-ink/10 text-brand-ink"
                  }`}
                >
                  <MapPin size={13} />
                  <span>Plats: {locationName}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReglage(activeReglage === "area" ? null : "area")}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeReglage === "area" ? "bg-brand-accent text-white border-brand-accent" : "bg-brand-paper hover:bg-brand-accent/10 border-brand-ink/10 text-brand-ink"
                  }`}
                >
                  <Globe size={13} />
                  <span>Område: {selectedArea}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReglage(activeReglage === "audience" ? null : "audience")}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeReglage === "audience" ? "bg-brand-accent text-white border-brand-accent" : "bg-brand-paper hover:bg-brand-accent/10 border-brand-ink/10 text-brand-ink"
                  }`}
                >
                  <Users size={13} />
                  <span>Målgrupp: {selectedAudience}</span>
                </button>
              </div>

              {/* Reglage Modal / Expanders */}
              {activeReglage === "time" && (
                <div className="p-3 bg-brand-paper/40 rounded-xl border border-brand-ink/10 space-y-2 animate-in fade-in duration-150">
                  <span className="font-mono text-[10px] text-brand-accent uppercase font-semibold block">Välj Tid:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TIME_REGLAGE.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedTime(t);
                          updateTemplateField("Tid", t);
                          setActiveReglage(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-brand-ink/10 rounded text-xs font-mono text-brand-ink hover:border-brand-accent transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeReglage === "location" && (
                <div className="p-3 bg-brand-paper/40 rounded-xl border border-brand-ink/10 space-y-2 animate-in fade-in duration-150">
                  <span className="font-mono text-[10px] text-brand-accent uppercase font-semibold block">Välj Mötesplats / Kartmatchning:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Utby kyrka", "Härlanda Tjärn", "Skatås motionscentrum", "Kortedala torg", "Munkebäckstorget", "Online/Telefon"].map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocationName(loc);
                          updateTemplateField("Mötesplats", loc);
                          setActiveReglage(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-brand-ink/10 rounded text-xs font-mono text-brand-ink hover:border-brand-accent transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeReglage === "area" && (
                <div className="p-3 bg-brand-paper/40 rounded-xl border border-brand-ink/10 space-y-2 animate-in fade-in duration-150">
                  <span className="font-mono text-[10px] text-brand-accent uppercase font-semibold block">Välj Område (samma som i Anpassa):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {GOTEBORG_AREAS.map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => {
                          setSelectedArea(area);
                          updateTemplateField("Bjud in från områden", area);
                          setActiveReglage(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-brand-ink/10 rounded text-xs font-mono text-brand-ink hover:border-brand-accent transition-colors"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeReglage === "audience" && (
                <div className="p-3 bg-brand-paper/40 rounded-xl border border-brand-ink/10 space-y-2 animate-in fade-in duration-150">
                  <span className="font-mono text-[10px] text-brand-accent uppercase font-semibold block">Välj Målgrupp:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AUDIENCE_REGLAGE.map(aud => (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => {
                          setSelectedAudience(aud);
                          updateTemplateField("Målgrupp", aud);
                          setActiveReglage(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-brand-ink/10 rounded text-xs font-mono text-brand-ink hover:border-brand-accent transition-colors"
                      >
                        {aud}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>


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
                <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent font-semibold">
                  {uiLanguage === "sv" ? "Inställningar för Tid, Plats, Målgrupp & Kategori" : "Settings for Time, Location, Audience & Category"}
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
                    placeholder="t.ex. Idag kl 18:00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase text-brand-ink/60">Plats / Mötesplats</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-brand-ink/10 rounded-lg text-xs font-mono"
                    placeholder="Mötesplats"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase text-brand-ink/60">Målgrupp</label>
                  <input
                    type="text"
                    value={selectedAudience}
                    onChange={e => setSelectedAudience(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-brand-ink/10 rounded-lg text-xs font-mono"
                    placeholder="Alla"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase text-brand-ink/60">Arrangör / Avsändare</label>
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

              {/* Save as favorite button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={saveAsFavorite}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/60 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>⭐ Spara som min personliga favorit</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-brand-paper/20 rounded-xl border border-brand-ink/5 space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent font-semibold">
                {uiLanguage === "sv" ? "Aktivitet & Rensad text (Anonymiserad)" : "Activity & Cleaned text (Anonymized)"}
              </span>
              <p className="text-xs font-mono text-brand-ink/80 whitespace-pre-wrap leading-relaxed">
                {cleanedBody}
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
                <span className="flex-shrink mx-3 font-mono text-[9px] text-brand-ink/40 uppercase font-semibold">Eller skicka via SMS / QR (Gateway 0736108997)</span>
                <div className="flex-grow border-t border-brand-ink/10"></div>
              </div>

              {isMobile ? (
                <a
                  href={smsHref}
                  className="w-full py-3.5 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Send size={14} className="text-brand-accent" />
                  <span>Öppna SMS-app för insändning till {gatewayNumber}</span>
                </a>
              ) : (
                <div className="p-4 bg-brand-bg rounded-xl border border-brand-ink/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <img src={qrUrl} alt="SMS QR Code" className="w-24 h-24 rounded-lg border border-brand-ink/10 shrink-0" />
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-semibold text-brand-ink">
                      Skanna med din mobiltelefon
                    </span>
                    <p className="text-[11px] text-brand-ink/70 leading-relaxed font-light">
                      Koden öppnar din SMS-app med den rensade inbjudan färdig att skicka till modererings-gatewayen ({gatewayNumber}).
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

