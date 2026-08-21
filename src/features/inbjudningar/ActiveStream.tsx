import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { ActiveAlert, UiLanguage } from "../mission_router";
import { CreateInvitationForm } from "../skapa_inbjudan";
import { subscribeToFirestoreAlerts } from "@/src/main/config/firebaseClient";
import { StreamNoticeCard } from "./components/StreamNoticeCard";
import { StreamFilterStatus, SavedFilterTags } from "./components/StreamFilterStatus";
import { AdminModerationQueue } from "./components/AdminModerationQueue";

interface ActiveStreamProps {
  onSelectAlert: (id: string) => void;
  uiLanguage: UiLanguage;
  savedTags?: SavedFilterTags | null;
  onStreamCountChange?: (filteredCount: number, totalCount: number) => void;
  inlineCreate?: boolean;
  isAdmin?: boolean;
  pushEnabled?: boolean;
  onBack?: () => void;
  onOpenSettings?: () => void;
  onEnablePush?: () => void;
}

export default function ActiveStream({
  onSelectAlert,
  uiLanguage,
  savedTags,
  onStreamCountChange,
  inlineCreate = false,
  isAdmin = false,
  pushEnabled = false,
  onBack,
  onOpenSettings,
  onEnablePush,
}: ActiveStreamProps) {
  const [stream, setStream] = useState<ActiveAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myProposals, setMyProposals] = useState<any[]>([]);

  const handleEnableAndOpenSettings = () => {
    if (onEnablePush) {
      onEnablePush();
    }
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  const fetchStream = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/alerts");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setStream(data);
    } catch (err: any) {
      console.warn("API error fetching stream, using local fallback:", err);
      setStream([]);
      setError("Kunde inte hämta inbjudningar från servern.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rawLocal = localStorage.getItem("sm_my_proposals");
    if (rawLocal) {
      try {
        setMyProposals(JSON.parse(rawLocal));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    let firestoreReceivedData = false;
    const unsubscribeFirestore = subscribeToFirestoreAlerts(firestoreAlerts => {
      if (firestoreAlerts && firestoreAlerts.length > 0) {
        firestoreReceivedData = true;
        setStream(firestoreAlerts);
        setLoading(false);
      }
    });

    const fallbackTimer = setTimeout(() => {
      if (!firestoreReceivedData) fetchStream();
    }, 1000);

    const interval = setInterval(() => {
      if (!firestoreReceivedData) fetchStream();
    }, 15000);

    return () => {
      unsubscribeFirestore();
      clearTimeout(fallbackTimer);
      clearInterval(interval);
    };
  }, []);

  const pendingAlerts = stream.filter(item => item.status === "pending");
  const activeStream = stream.filter(item => item.status !== "pending" && item.status !== "rejected");

  const filteredStream = activeStream.filter(item => {
    if (!savedTags) return true;
    if (savedTags.limitAreas && savedTags.limitedAreas && savedTags.limitedAreas.length > 0) {
      if (item.area && !savedTags.limitedAreas.includes(item.area)) return false;
    }
    if (savedTags.enabledCategories && savedTags.enabledCategories.length > 0) {
      if (item.category && !savedTags.enabledCategories.includes(item.category)) return false;
    }
    if (savedTags.organizations && savedTags.organizations.length > 0) {
      if (item.responsibleParty && !savedTags.organizations.includes(item.responsibleParty)) return false;
    }
    if (savedTags.languages && savedTags.languages.length > 0) {
      if (item.language && !savedTags.languages.includes(item.language)) return false;
    }
    return true;
  });

  const handleModerate = async (id: string, newStatus: "active" | "rejected") => {
    try {
      const res = await fetch(`/api/alerts/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchStream();
      } else {
        alert("Kunde inte uppdatera inbjudningsstatus.");
      }
    } catch (err) {
      console.error(err);
      alert("Nätverksfel vid moderering.");
    }
  };

  useEffect(() => {
    if (onStreamCountChange) {
      onStreamCountChange(filteredStream.length, activeStream.length);
    }
  }, [filteredStream.length, activeStream.length, onStreamCountChange]);

  const renderStreamWithStatus = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-2xl p-8 border border-brand-ink/5 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-[10px] uppercase tracking-wider text-brand-ink/60">
            Hämtar inbjudningar...
          </p>
        </div>
      );
    }

    if (error && stream.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-8 border border-brand-error/20 text-center space-y-2">
          <ShieldAlert size={24} className="text-brand-error mx-auto opacity-80" />
          <p className="text-xs font-mono text-brand-error uppercase tracking-wider">{error}</p>
        </div>
      );
    }

    if (filteredStream.length === 0) {
      return (
        <div className="space-y-4">
          {pushEnabled && (
            <StreamFilterStatus
              savedTags={savedTags}
              pushEnabled={pushEnabled}
              onOpenSettings={onOpenSettings}
              onEnableAndOpenSettings={handleEnableAndOpenSettings}
            />
          )}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-brand-ink/5 text-center space-y-4">
            <p className="font-serif italic text-base sm:text-lg text-brand-ink/80 leading-relaxed">
              {pushEnabled 
                ? "Just nu finns inga aktiva inbjudningar i dina valda områden. Du får en avisering så fort en ny inbjudan läggs upp." 
                : "Just nu finns inga aktiva inbjudningar i dina valda områden. Du ser nya inbjudningar här så fort de läggs upp."}
            </p>
          </div>
        </div>
      );
    }

    if (pushEnabled) {
      const splitIndex = Math.min(2, filteredStream.length);
      const topItems = filteredStream.slice(0, splitIndex);
      const remainingItems = filteredStream.slice(splitIndex);

      return (
        <div className="space-y-4">
          {topItems.map(item => (
            <StreamNoticeCard key={item.id} item={item} onSelectAlert={onSelectAlert} />
          ))}
          <StreamFilterStatus
            savedTags={savedTags}
            pushEnabled={pushEnabled}
            onOpenSettings={onOpenSettings}
            onEnableAndOpenSettings={handleEnableAndOpenSettings}
          />
          {remainingItems.map(item => (
            <StreamNoticeCard key={item.id} item={item} onSelectAlert={onSelectAlert} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredStream.map(item => (
          <StreamNoticeCard key={item.id} item={item} onSelectAlert={onSelectAlert} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto text-left">
      {inlineCreate && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <CreateInvitationForm
            uiLanguage={uiLanguage}
            savedTags={savedTags as any}
            isAdmin={isAdmin}
            onBack={onBack}
            onSuccess={fetchStream}
          />
        </div>
      )}

      {!pushEnabled && (
        <StreamFilterStatus
          savedTags={savedTags}
          pushEnabled={pushEnabled}
          onOpenSettings={onOpenSettings}
          onEnableAndOpenSettings={handleEnableAndOpenSettings}
        />
      )}

      {isAdmin && <AdminModerationQueue pendingAlerts={pendingAlerts} handleModerate={handleModerate} />}

      <div className="space-y-4 text-left">
        {myProposals.length > 0 && (
          <div className="space-y-3">
            {myProposals.map(prop => (
              <div
                key={prop.id}
                className="bg-brand-paper/50 border border-brand-accent/30 rounded-2xl p-5 shadow-2xs space-y-2 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-tr-2xl rounded-bl-xl shadow-2xs">
                  DIN INBJUDAN • FÖRBEREDS
                </div>

                <div className="flex items-center justify-between pr-52 pt-1">
                  <span className="font-mono text-[10px] text-brand-ink/60 font-light">
                    {prop.time || "Fast tid ej angiven"}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif italic text-lg text-brand-ink font-medium">{prop.area}</h3>
                  <p className="text-xs text-brand-ink/80 font-light line-clamp-2 mt-1 leading-relaxed">
                    {prop.scrubbedText || prop.activityText}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-brand-ink/10 text-[10px] font-mono text-brand-ink/60 uppercase tracking-wider">
                  <span>{prop.responsibleParty}</span>
                  <span className="italic font-sans text-brand-accent font-semibold">
                    Förbereds för utskick i församlingsområdet
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {renderStreamWithStatus()}
      </div>
    </div>
  );
}
