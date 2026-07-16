// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Languages, Bell, Share, Smartphone, X, CheckSquare, Sparkles } from "lucide-react";
import OnboardingWizard from "./features/mission_router/components/onboarding/OnboardingWizard";
import AlertDetail from "./features/mission_router/components/AlertDetail";
import ActiveStream from "./features/mission_router/components/ActiveStream";
import Disclaimer from "./features/mission_router/components/Disclaimer";
import { TRANSLATIONS, UiLanguage } from "./features/mission_router/translations";

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
  const [totalActiveCount, setTotalActiveCount] = useState<number>(0);

  // Unified Tab Management (Mobile has "stream" | "create" | "settings"; Desktop has "stream" | "create")
  const [activeTab, setActiveTab] = useState<"stream" | "create" | "settings">("stream");

  // Real-time visual feedback syncing state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isIOS && !isStandalone) {
      setShowIosModal(true);
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushError("Din enhet stöder tyvärr inte Web Push-aviseringar.");
      return;
    }

    try {
      const keyRes = await fetch("/api/vapid-public-key");
      if (!keyRes.ok) throw new Error("Misslyckades att hämta anslutningsnyckel från servern.");
      const { publicKey } = await keyRes.json();

      if (!publicKey) {
        throw new Error("Ingen giltig anslutningsnyckel returnerades från servern.");
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

      if (!response.ok) throw new Error("Kunde inte slutföra registreringen på servern.");
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
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
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
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
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

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-ink selection:bg-brand-accent selection:text-white pb-12">
      
      {/* Sticky Top Header Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-brand-ink/10 z-50 w-full shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between text-xs sm:text-sm font-mono text-brand-ink/80 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0"></span>
            <span className="font-semibold text-brand-ink">
              Primärt område:{" "}
              <span className="text-brand-accent italic font-serif">
                {savedTags?.primaryArea || "Inget förvalt område"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs">
            {isSyncing ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold animate-pulse">
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Synkroniserar...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-brand-ink/50 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Synkroniserad i realtid
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Brand Header Section */}
      <header id="app-header" className="py-6 px-4 max-w-7xl mx-auto w-full flex items-baseline justify-between shrink-0">
        <div className="title-block">
          <h1 className="font-serif italic text-2xl sm:text-3xl font-medium tracking-tight text-brand-ink leading-none">
            {TRANSLATIONS[uiLanguage].gatewayTitle}
          </h1>
        </div>

        {/* Change language action */}
        {uiLanguage && (
          <button
            id="change-language-btn"
            onClick={() => {
              localStorage.removeItem("mission_router_ui_language");
              setUiLanguage(null);
            }}
            className="text-brand-ink opacity-60 hover:opacity-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider"
            title="Ändra språk / Change language"
          >
            <Languages size={15} className="stroke-[1.5]" />
            <span>Språk</span>
          </button>
        )}
      </header>

      {/* Tab Menu Header Row (Positioned above Stage) */}
      <div className="bg-white/80 border-b border-brand-ink/5 sticky top-[49px] z-40 w-full mb-6">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          
          {/* Mobile Navigation Tabs Selector (< lg) */}
          <div className="flex lg:hidden items-center justify-around bg-brand-bg p-1 rounded-xl border border-brand-ink/5">
            <button
              id="mobile-tab-stream"
              onClick={() => handleTabChange("stream")}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg text-center transition-all ${
                activeTab === "stream"
                  ? "bg-white text-brand-ink shadow-xs font-semibold"
                  : "text-brand-ink/65 hover:text-brand-ink"
              }`}
            >
              Inbjudan till dig
            </button>
            <button
              id="mobile-tab-create"
              onClick={() => handleTabChange("create")}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg text-center transition-all ${
                activeTab === "create"
                  ? "bg-white text-brand-ink shadow-xs font-semibold"
                  : "text-brand-ink/65 hover:text-brand-ink"
              }`}
            >
              + Bjud in andra
            </button>
            <button
              id="mobile-tab-settings"
              onClick={() => handleTabChange("settings")}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg text-center transition-all ${
                activeTab === "settings"
                  ? "bg-white text-brand-ink shadow-xs font-semibold"
                  : "text-brand-ink/65 hover:text-brand-ink"
              }`}
            >
              Anpassa mina val
            </button>
          </div>

          {/* Desktop Navigation Tabs Selector (>= lg) */}
          <div className="hidden lg:flex items-center justify-start gap-6">
            <button
              id="desktop-tab-stream"
              onClick={() => handleTabChange("stream")}
              className={`py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === "stream" || activeTab === "settings"
                  ? "border-brand-accent text-brand-ink font-semibold"
                  : "border-transparent text-brand-ink/65 hover:text-brand-ink"
              }`}
            >
              Inbjudan till dig
            </button>
            <button
              id="desktop-tab-create"
              onClick={() => handleTabChange("create")}
              className={`py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === "create"
                  ? "border-brand-accent text-brand-ink font-semibold"
                  : "border-transparent text-brand-ink/65 hover:text-brand-ink"
              }`}
            >
              + Bjud in andra
            </button>
          </div>

        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <main className="flex-1 p-4 max-w-7xl w-full mx-auto">
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
          <div className="animate-in fade-in duration-200">
            {/* The Unified Grid containing Sidebar (Left) and Content (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT SPALT (Desktop: Permanent settings; Mobile: Shown only on "settings" tab) */}
              <div className={`lg:col-span-5 ${activeTab === "settings" ? "block" : "hidden lg:block"}`}>
                <div className="bg-white/40 p-4 rounded-3xl border border-brand-ink/5 lg:sticky lg:top-[120px]">
                  <OnboardingWizard
                    onSave={handleSaveTags}
                    savedTags={savedTags}
                    pushEnabled={pushEnabled}
                    onEnablePush={handleEnablePush}
                    onDisablePush={handleDisablePush}
                    uiLanguage={uiLanguage || "sv"}
                  />
                </div>
              </div>

              {/* RIGHT SPALT (Desktop: Dynamic feed/create tabs; Mobile: Shown on "stream" or "create" tab) */}
              <div className={`lg:col-span-7 ${activeTab !== "settings" ? "block" : "hidden lg:block"}`}>
                
                {/* Notice Stream Tab content */}
                {(activeTab === "stream" || activeTab === "settings") && (
                  <div className="animate-in fade-in duration-200">
                    <ActiveStream
                      onSelectAlert={(id) => navigateTo(`/larm/${id}`)}
                      uiLanguage={uiLanguage || "sv"}
                      savedTags={savedTags}
                      showCreateModal={false}
                      setShowCreateModal={() => {}}
                      onStreamCountChange={setTotalActiveCount}
                      inlineCreate={false}
                    />
                  </div>
                )}

                {/* Create Invitation Inline Form Tab content */}
                {activeTab === "create" && (
                  <div className="animate-in fade-in duration-200">
                    <ActiveStream
                      onSelectAlert={(id) => navigateTo(`/larm/${id}`)}
                      uiLanguage={uiLanguage || "sv"}
                      savedTags={savedTags}
                      showCreateModal={false}
                      setShowCreateModal={() => {}}
                      onStreamCountChange={setTotalActiveCount}
                      inlineCreate={true}
                    />
                  </div>
                )}

              </div>

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
