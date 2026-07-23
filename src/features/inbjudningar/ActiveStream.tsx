// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/4_Produce] - ActiveStream Firestore Connected Verified Saved

import React, { useState, useEffect } from "react";
import { ExternalLink, Send, CheckCircle, Sparkles, ShieldAlert, ArrowLeft } from "lucide-react";
import { ActiveAlert } from "../mission_router/types";
import { TRANSLATIONS, UiLanguage } from "../mission_router/translations";
import { GOTEBORG_AREAS } from "../anpassa/mapData";
import { washAnnouncementText } from "../mission_router/domain/parser";
import { CreateInvitationForm } from "../skapa_inbjudan";
import { subscribeToFirestoreAlerts } from "../../main/config/firebaseClient";

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
    let unsubscribeFirestore = () => {};
    let firestoreReceivedData = false;

    // Try anonymous Firestore subscription first
    unsubscribeFirestore = subscribeToFirestoreAlerts((firestoreAlerts) => {
      if (Array.isArray(firestoreAlerts) && firestoreAlerts.length > 0) {
        firestoreReceivedData = true;
        setStream(firestoreAlerts);
        setLoading(false);
      }
    });

    // If Firestore does not emit data within 1 second, fetch from /api/alerts as fallback
    const fallbackTimer = setTimeout(() => {
      if (!firestoreReceivedData) {
        fetchStream();
      }
    }, 1000);

    const interval = setInterval(() => {
      if (!firestoreReceivedData) {
        fetchStream();
      }
    }, 15000); // Polla var 15:e sekund om inte Firestore är aktivt

    return () => {
      unsubscribeFirestore();
      clearTimeout(fallbackTimer);
      clearInterval(interval);
    };
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
      <CreateInvitationForm
        uiLanguage={uiLanguage}
        savedTags={savedTags}
        isAdmin={isAdmin}
        onBack={onBack}
        onSuccess={fetchStream}
      />
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
                {uiLanguage === "sv" 
                  ? "Ska du ändå ta en fika, promenad eller fixa något i trädgården?"
                  : "Are you having a coffee, going for a walk or working in the garden anyway?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-create-invitation"));
                }}
                className="w-full py-3.5 px-4 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{uiLanguage === "sv" ? "➕ Skapa en snabb inbjudan för det du redan gör" : "➕ Create a quick invitation for what you are already doing"}</span>
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
