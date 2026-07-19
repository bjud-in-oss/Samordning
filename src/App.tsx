// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/sms_assistant/4_Produce]

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Languages, X, Smartphone, Settings } from "lucide-react";
import OnboardingWizard from "./features/mission_router/components/onboarding/OnboardingWizard";
import AlertDetail from "./features/mission_router/components/AlertDetail";
import ActiveStream from "./features/mission_router/components/ActiveStream";
import Disclaimer from "./features/mission_router/components/Disclaimer";
import { TRANSLATIONS, UiLanguage } from "./features/mission_router/translations";
import AdminConsole from "./features/sms_assistant/components/AdminConsole";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function App() {
  const isAdminConsole = typeof window !== "undefined" && window.location.search.includes("admin=true");
  if (isAdminConsole) {
    return <AdminConsole />;
  }

  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  const [uiLanguage, setUiLanguage] = useState<UiLanguage | null>(() => {
    return localStorage.getItem("mission_router_ui_language") as UiLanguage | null;
  });
  
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  const [subscriptionId, setSubscriptionId] = useState<string | null>(() => {
    return localStorage.getItem("mission_router_sub_id");
  });
  const [savedTags, setSavedTags] = useState<any>(() => {
    const data = localStorage.getItem("mission_router_tags");
    return data ? JSON.parse(data) : null;
  });

  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const [pushError, setPushError] = useState<string | null>(null);
  
  // Real-time dynamic count of filtered vs total invitations
  const [streamCounts, setStreamCounts] = useState<{ filtered: number; total: number }>({ filtered: 0, total: 0 });

  const handleStreamCountChange = useCallback((filtered: number, total: number) => {
    setStreamCounts(prev => {
      if (prev.filtered === filtered && prev.total === total) {
        return prev;
      }
      return { filtered, total };
    });
  }, []);

  // Unified Tab Management
  const [activeTab, setActiveTab] = useState<"stream" | "create">("stream");
  // Inline settings routing strategy to avoid clunky blocking modals
  const [currentView, setCurrentView] = useState<'stream' | 'settings'>('stream');
  const [isToggling, setIsToggling] = useState<boolean>(false);

  // Real-time visual feedback syncing state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Sync state feedback whenever tags are saved
  useEffect(() => {
    if (savedTags) {
      setIsSyncing(true);
      const timer = setTimeout(() => setIsSyncing(false), 900);
      return () => clearTimeout(timer);
    }
  }, [savedTags]);

  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      const match = path.match(/\/larm\/([a-z0-9]+)/i);
      if (match && match[1]) {
        setActiveAlertId(match[1]);
      } else {
        setActiveAlertId(null);
      }
    };

    handleRoute();
    window.addEventListener("popstate", handleRoute);
    return () => window.removeEventListener("popstate", handleRoute);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setPushEnabled(!!subscription);
        });
      });
    }
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
  };

  const handleEnablePush = async () => {
    setPushError(null);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone === true);
    if (isIOS && !isStandalone) {
      setShowIosModal(true);
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushError(uiLanguage === "sv" ? "Din enhet stöder tyvärr inte Web Push-aviseringar." : "Unfortunately, your device does not support Web Push notifications.");
      return;
    }

    try {
      const keyRes = await fetch("/api/vapid-public-key");
      if (!keyRes.ok) throw new Error(uiLanguage === "sv" ? "Misslyckades att hämta anslutningsnyckel från servern." : "Failed to fetch public key from the server.");
      const { publicKey } = await keyRes.json();

      if (!publicKey) {
        throw new Error(uiLanguage === "sv" ? "Ingen giltig anslutningsnyckel returnerades från servern." : "No valid public key was returned from the server.");
      }

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subscriptionId,
          subscription,
          tags: savedTags || {
            areas: [],
            languages: [],
            organization: "",
            formats: ["physical", "telephone"],
            alwaysNotify: true,
            spiritualTips: true
          }
        })
      });

      if (!response.ok) throw new Error(uiLanguage === "sv" ? "Kunde inte slutföra registreringen på servern." : "Could not complete registration on the server.");
      const data = await response.json();

      localStorage.setItem("mission_router_sub_id", data.id);
      setSubscriptionId(data.id);
      setPushEnabled(true);
    } catch (err: any) {
      console.error("Failed to enable push", err);
      setPushError(err.message || String(err));
    }
  };

  const handleDisablePush = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          try {
            const subscription = await reg.pushManager.getSubscription();
            if (subscription) {
              await subscription.unsubscribe();
            }
          } catch (subErr) {
            console.error("Failed to unsubscribe subscription", subErr);
          }
          try {
            await reg.unregister();
          } catch (unregErr) {
            console.error("Failed to unregister sw", unregErr);
          }
        }
      }
      localStorage.removeItem("mission_router_sub_id");
      setSubscriptionId(null);
      setPushEnabled(false);
    } catch (err) {
      console.error("Failed to disable push", err);
    }
  };

  const handleSaveTags = useCallback(async (tags: any) => {
    localStorage.setItem("mission_router_tags", JSON.stringify(tags));
    setSavedTags(tags);

    if (pushEnabled) {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            try {
              const subscription = await reg.pushManager.getSubscription();
              if (subscription) {
                await fetch("/api/subscription", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: subscriptionId,
                    subscription,
                    tags
                  })
                });
                break;
              }
            } catch (syncErr) {
              console.error("Failed to check subscription on registration", syncErr);
            }
          }
        }
      } catch (err) {
        console.error("Failed to sync tags with backend", err);
      }
    }
  }, [pushEnabled, subscriptionId]);

  const handleTabChange = (tab: "stream" | "create" | "settings") => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!uiLanguage) {
    return (
      <div id="language-gateway-container" className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-brand-ink font-sans">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-serif italic text-brand-ink tracking-tight">
              Inbjudan till dig
            </h1>
          </div>

          <div className="w-24 h-24 bg-white text-brand-accent rounded-full flex items-center justify-center mx-auto border border-brand-ink/5 transition-transform hover:scale-105 duration-300">
            <span className="text-3xl">🇸🇪</span>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-accent">
            Välj ditt språk för att fortsätta • Choose language
          </p>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              { code: "sv", label: "Svenska" },
              { code: "en", label: "English" },
              { code: "es", label: "Español" },
              { code: "sw", label: "Kiswahili" },
              { code: "vi", label: "Tiếng Việt" }
            ].map(lang => (
              <button
                key={lang.code}
                id={`gateway-lang-btn-${lang.code}`}
                onClick={() => {
                  localStorage.setItem("mission_router_ui_language", lang.code);
                  setUiLanguage(lang.code as UiLanguage);
                }}
                className="w-full py-3.5 px-6 bg-white hover:bg-brand-paper text-brand-ink font-medium text-sm rounded-xl border border-brand-ink/5 hover:border-brand-accent transition-all duration-200 shadow-xs active:scale-[0.99] flex items-center justify-between cursor-pointer"
              >
                <span className="tracking-wide">{lang.label}</span>
                <span className="font-mono text-[10px] font-semibold text-brand-accent uppercase tracking-wider">
                  {lang.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "stream", label: TRANSLATIONS[uiLanguage].tabInvitations },
    { id: "create", label: TRANSLATIONS[uiLanguage].tabCreateInvitation }
  ] as const;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-ink selection:bg-brand-accent selection:text-white pb-12">
      
      {/* Sticky Top Header Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-brand-ink/10 z-50 w-full shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between whitespace-nowrap overflow-hidden select-none">
          {/* VÄNSTER SIDA */}
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-4">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isSyncing
                  ? "bg-brand-ocean animate-pulse"
                  : isOnline
                  ? "bg-brand-accent"
                  : "bg-brand-error"
              }`}
              title={
                isSyncing
                  ? TRANSLATIONS[uiLanguage].syncSyncing
                  : TRANSLATIONS[uiLanguage].syncSynced
              }
            ></span>
            <span className="text-xs font-sans text-brand-ink/80 truncate">
              {activeTab === "settings" ? (
                TRANSLATIONS[uiLanguage].showingCount
                  .replace("{count}", String(streamCounts.filtered))
                  .replace("{total}", String(streamCounts.total))
              ) : (
                <>
                  {TRANSLATIONS[uiLanguage].primaryAreaLabel}:{" "}
                  <span className="italic font-serif text-brand-accent font-medium">
                    {savedTags?.primaryArea || TRANSLATIONS[uiLanguage].noAreaSelected}
                  </span>
                </>
              )}
            </span>
          </div>

          {/* HÖGER SIDA */}
          <button
            id="change-language-btn"
            onClick={() => {
              localStorage.removeItem("mission_router_ui_language");
              setUiLanguage(null);
            }}
            className="text-brand-ink opacity-60 hover:opacity-100 transition-all cursor-pointer flex items-center justify-center p-1 shrink-0"
            title="Ändra språk / Change language"
          >
            <Languages size={18} className="stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <main className="flex-1 p-4 max-w-xl w-full mx-auto flex flex-col">
        
        {/* Kontroller för Notiser & Anpassning */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 mx-auto max-w-[400px] w-full">
          {/* iOS Style Switch Container */}
          <div className="flex-1 bg-white border border-brand-ink/10 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <span className="text-xs sm:text-sm font-medium text-brand-ink">
              Få inbjudningar som notiser
            </span>
            <button
              type="button"
              disabled={isToggling}
              onClick={async () => {
                setIsToggling(true);
                try {
                  if (pushEnabled) {
                    await handleDisablePush();
                  } else {
                    await handleEnablePush();
                  }
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsToggling(false);
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-wait ${
                pushEnabled ? 'bg-brand-accent' : 'bg-brand-ink/20'
              }`}
            >
              <span className="sr-only">Toggle notifications</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  pushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Settings / Anpassa knappen */}
          <button
            type="button"
            disabled={isToggling}
            onClick={() => setCurrentView('settings')}
            className={`flex items-center justify-center gap-2 px-5 py-4 sm:py-0 bg-white border border-brand-ink/10 rounded-2xl text-[10px] sm:text-xs font-mono uppercase tracking-wider text-brand-ink hover:bg-brand-paper transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-wait ${currentView === 'settings' ? 'ring-1 ring-brand-ink' : ''} ${!pushEnabled ? 'opacity-50 grayscale' : ''}`}
          >
            <Settings size={14} />
            <span>Anpassa</span>
          </button>
        </div>

        {pushError && (
          <div className="mb-6 bg-brand-error/10 border border-brand-error/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-brand-error animate-in fade-in duration-200">
            <ShieldAlert size={16} className="shrink-0 text-brand-error" />
            <p className="font-mono uppercase tracking-wider">{pushError}</p>
          </div>
        )}

        {activeAlertId ? (
          <AlertDetail
            alertId={activeAlertId}
            onBack={() => {
              navigateTo("/");
            }}
            uiLanguage={uiLanguage || "sv"}
          />
        ) : (
          <div className="animate-in fade-in duration-200 space-y-6">
            
            {/* Dynamic Navigation Links (Diskreta klickbara länkar för de två inaktiva flikarna) */}
            <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-brand-ink/40 uppercase tracking-widest pt-2">
              {tabs.filter(t => t.id !== activeTab).map(tab => (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className="hover:text-brand-accent hover:underline transition-all cursor-pointer font-medium"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab H1 Heading */}
            <div className="text-center">
              <h1 className="font-serif italic text-3xl sm:text-4xl font-medium tracking-tight text-brand-ink leading-tight">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
            </div>

            {/* Dynamic Content */}
            <div className="w-full">
              {currentView === 'settings' && (
                <div className="bg-white rounded-3xl w-full p-6 shadow-sm border border-brand-ink/5">
                  <OnboardingWizard
                    onSave={(tags) => {
                      handleSaveTags(tags);
                      setCurrentView('stream');
                    }}
                    savedTags={savedTags}
                    pushEnabled={pushEnabled}
                    onEnablePush={handleEnablePush}
                    onDisablePush={handleDisablePush}
                    uiLanguage={uiLanguage || "sv"}
                  />
                </div>
              )}

              {currentView === 'stream' && activeTab === "stream" && (
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(`/larm/${id}`)}
                  uiLanguage={uiLanguage || "sv"}
                  savedTags={savedTags}
                  onStreamCountChange={handleStreamCountChange}
                  inlineCreate={false}
                />
              )}

              {currentView === 'stream' && activeTab === "create" && (
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(`/larm/${id}`)}
                  uiLanguage={uiLanguage || "sv"}
                  savedTags={savedTags}
                  onStreamCountChange={handleStreamCountChange}
                  inlineCreate={true}
                />
              )}
            </div>

          </div>
        )}
      </main>

      {/* Centered Foot Disclaimer */}
      <Disclaimer uiLanguage={uiLanguage || "sv"} />

      {/* IOS Web Push Instructions modal */}
      {showIosModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-6 border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                <Smartphone size={32} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Installera på iPhone / iPad</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                För att ta emot Web Push-aviseringar på iOS måste du lägga till denna webbapp på din hemskärm först:
              </p>
            </div>
            <ol className="text-xs text-slate-700 space-y-3 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <li className="flex gap-2">
                <span className="text-teal-600">1.</span>
                <span>Klicka på <strong>Dela-knappen</strong> i Safari (fyrkant med pil uppåt).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600">2.</span>
                <span>Scrolla ner och välj <strong>"Lägg till på hemskärmen"</strong>.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600">3.</span>
                <span>Öppna appen från din hemskärm och anslut aviseringarna igen!</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Jag förstår
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
