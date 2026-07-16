// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Radio, Smartphone, Languages, Sliders, Share, PlusSquare, X, Bell } from "lucide-react";
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
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  
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

  // Left sidebar visibility state (Collapses on desktop start if push is enabled)
  const [showSettingsSidebar, setShowSettingsSidebar] = useState<boolean>(false);
  
  // Total unfiltered active invitations count from the stream
  const [totalActiveCount, setTotalActiveCount] = useState<number>(0);

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
          const enabled = !!subscription;
          setPushEnabled(enabled);
          setShowSettingsSidebar(!enabled);
        });
      });
    } else {
      setShowSettingsSidebar(true);
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
            areas: ["Kortedala Norra"],
            languages: ["Svenska"],
            organization: "bror",
            formats: ["physical"],
            alwaysNotify: true,
            spiritualTips: false
          }
        })
      });

      if (!response.ok) throw new Error("Kunde inte slutföra registreringen på servern.");
      const data = await response.json();

      localStorage.setItem("mission_router_sub_id", data.id);
      setSubscriptionId(data.id);
      setPushEnabled(true);
      setShowSettingsSidebar(false); 
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
            <Languages size={40} className="stroke-[1.2]" />
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
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-ink selection:bg-brand-accent selection:text-white">
      
      {/* Top Header - Refined Lifestyle with Centered limits */}
      <header id="app-header" className="py-8 px-6 md:px-12 flex flex-row items-baseline justify-between shrink-0 max-w-2xl w-full mx-auto">
        <div className="title-block">
          <h1 className="font-serif italic text-2xl md:text-3xl font-medium tracking-tight text-brand-ink leading-none">
            {TRANSLATIONS[uiLanguage].gatewayTitle}
          </h1>
        </div>

        {/* Dynamic Header Actions */}
        <div className="flex items-center gap-4">
          {/* "+ Bjud in andra" button in the menu (Header) - shown if total active stream > 0 */}
          {uiLanguage && !activeAlertId && totalActiveCount > 0 && (
            <button
              id="invite-header-btn"
              onClick={() => setShowCreateModal(true)}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-brand-accent hover:opacity-100 transition-all cursor-pointer border-b border-transparent hover:border-brand-accent pb-0.5"
            >
              + Bjud in andra
            </button>
          )}

          {/* Settings Toggle */}
          {uiLanguage && !activeAlertId && (
            <button
              id="settings-toggle-btn"
              onClick={() => setShowSettingsSidebar(prev => !prev)}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-brand-ink hover:opacity-100 transition-all cursor-pointer border-b border-transparent hover:border-brand-ink pb-0.5"
              style={{ opacity: showSettingsSidebar ? 1 : 0.6 }}
            >
              {uiLanguage === "sv" ? "Anpassa" : "Customize"}
            </button>
          )}

          {uiLanguage && (
            <button
              id="change-language-btn"
              onClick={() => {
                localStorage.removeItem("mission_router_ui_language");
                setUiLanguage(null);
              }}
              className="text-brand-ink opacity-60 hover:opacity-100 transition-all cursor-pointer flex items-center justify-center"
              title="Ändra språk / Change language"
            >
              <Languages size={16} className="stroke-[1.5]" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Stage - Centered layout */}
      <main className="flex-1 p-6 md:p-12 max-w-2xl w-full mx-auto">
        {pushError && (
          <div className="mb-8 bg-brand-error/10 border border-brand-error/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-brand-error animate-in fade-in duration-200">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Sidebar - Collapsible on Desktop, Overlay Drawer on Mobile */}
              <div className={`transition-all duration-300 ${showSettingsSidebar ? "lg:col-span-12" : "lg:col-span-12"}`}>
                {showSettingsSidebar ? (
                  <>
                    {/* Backdrop for Mobile Drawer */}
                    <div 
                      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                      onClick={() => setShowSettingsSidebar(false)}
                    ></div>
                    
                    {/* Sidebar Panel Container */}
                    <aside className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-50 p-6 overflow-y-auto shadow-2xl border-r border-slate-100 lg:relative lg:inset-auto lg:w-auto lg:max-w-none lg:shadow-none lg:border-none lg:p-0 lg:mb-8">
                      <div className="flex items-center justify-between lg:hidden mb-5 pb-2 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900">Anpassa</h3>
                        <button 
                          onClick={() => setShowSettingsSidebar(false)}
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <OnboardingWizard
                        onSave={handleSaveTags}
                        savedTags={savedTags}
                        pushEnabled={pushEnabled}
                        onEnablePush={handleEnablePush}
                        onDisablePush={handleDisablePush}
                        uiLanguage={uiLanguage || "sv"}
                        onClose={() => setShowSettingsSidebar(false)}
                      />
                    </aside>
                  </>
                ) : (
                  /* Premium closed-state icon strip at the top or side */
                  <div className="flex items-center gap-4 p-4 bg-white border border-brand-ink/5 rounded-2xl shadow-xs mb-6 justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        id="expand-sidebar-indicator-btn"
                        onClick={() => setShowSettingsSidebar(true)}
                        className="text-brand-accent hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider bg-brand-paper px-3 py-1.5 rounded-lg"
                        title="Öppna inställningar"
                      >
                        <Sliders size={14} />
                        <span>Mina val</span>
                      </button>
                      <div className="w-[1px] h-4 bg-brand-ink/10"></div>
                      <div className="text-[11px] text-brand-ink/60 font-light">
                        {savedTags?.primaryArea ? `Primärt område: ${savedTags.primaryArea}` : "Inga inställningar valda."}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div 
                        className={`p-1.5 rounded-full ${pushEnabled ? "text-teal-600 bg-teal-50" : "text-slate-300"}`}
                        title={pushEnabled ? "Aviseringar aktiverade" : "Aviseringar inaktiverade"}
                      >
                        <Bell size={16} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notices Stream */}
              <div className="lg:col-span-12">
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(`/larm/${id}`)}
                  uiLanguage={uiLanguage || "sv"}
                  savedTags={savedTags}
                  showCreateModal={showCreateModal}
                  setShowCreateModal={setShowCreateModal}
                  onStreamCountChange={setTotalActiveCount}
                />
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Foot Disclaimers */}
      <Disclaimer uiLanguage={uiLanguage || "sv"} />

      {/* Footer Connection Status Indicator */}
      <footer id="app-footer" className="mt-auto py-8 border-t border-slate-100 bg-slate-50/50 w-full px-6 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${subscriptionId ? "bg-teal-500 animate-pulse" : "bg-slate-300"}`}></span>
          <span>
            {subscriptionId 
              ? `${uiLanguage === "sv" ? "Ansluten till Ge stöd" : "Connected to Ge stöd"} (ID: ${subscriptionId.substring(0, 8)}...)` 
              : (uiLanguage === "sv" ? "Ej ansluten till aviseringar" : "Not connected to notifications")}
          </span>
        </div>
      </footer>
    </div>
  );
}
