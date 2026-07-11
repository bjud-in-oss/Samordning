import React, { useState, useEffect } from "react";
import { ShieldAlert, Radio, Smartphone, Languages, Sliders, Share, PlusSquare, X } from "lucide-react";
import OnboardingForm from "./features/mission_router/components/OnboardingForm";
import AlertDetail from "./features/mission_router/components/AlertDetail";
import SimulatorPanel from "./features/mission_router/components/SimulatorPanel";
import ActiveStream from "./features/mission_router/components/ActiveStream";
import Disclaimer from "./features/mission_router/components/Disclaimer";
import { TRANSLATIONS, UiLanguage } from "./features/mission_router/translations";

// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

// Helper function to convert base64 VAPID public key to Uint8Array
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
  // Collapsible view states for flat flow
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  
  // UI Language for translation (null triggers Gateway screen)
  const [uiLanguage, setUiLanguage] = useState<UiLanguage | null>(() => {
    return localStorage.getItem("mission_router_ui_language") as UiLanguage | null;
  });
  
  // Alert ID matched from pathname, e.g., `/larm/abc123`
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  // Anonymized subscription details stored in localStorage
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

  // Monitor URL path changes for routing to /larm/:id
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

  // Check if push is already enabled in browser and adjust settings drawer
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          const enabled = !!subscription;
          setPushEnabled(enabled);
          // Dölj den vid start om pushEnabled är true
          setShowSettingsSidebar(!enabled);
        });
      });
    } else {
      setShowSettingsSidebar(true);
    }
  }, []);

  // Helper to trigger navigation
  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
  };

  // Enable Web Push Subscription
  const handleEnablePush = async () => {
    setPushError(null);

    // Intercept iOS non-standalone browsers to prompt Add to Home Screen first
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
      // 1. Fetch VAPID Public Key from server
      const keyRes = await fetch("/api/vapid-public-key");
      if (!keyRes.ok) throw new Error("Misslyckades att hämta anslutningsnyckel från servern.");
      const { publicKey } = await keyRes.json();

      if (!publicKey) {
        throw new Error("Ingen giltig anslutningsnyckel returnerades från servern.");
      }

      // 2. Register Service Worker
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });

      // 3. Request Push permission & subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // 4. Save to backend with current tags
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subscriptionId,
          subscription,
          tags: savedTags || {
            areas: ["Kortedala"],
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

      // 5. Save subscription identity in localStorage
      localStorage.setItem("mission_router_sub_id", data.id);
      setSubscriptionId(data.id);
      setPushEnabled(true);
      setShowSettingsSidebar(false); // Collapse sidebar upon successful setup
    } catch (err: any) {
      console.error("Failed to enable push", err);
      setPushError(err.message || String(err));
    }
  };

  // Save tags and sync with backend subscription if active
  const handleSaveTags = async (tags: any) => {
    localStorage.setItem("mission_router_tags", JSON.stringify(tags));
    setSavedTags(tags);

    // If push is active, update tags on the backend
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
  };

  if (!uiLanguage) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Inbjudan till dig
            </h1>
          </div>

          {/* Centered Large Translation Symbol with hover effect */}
          <div className="w-32 h-32 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-teal-100/60 transition-transform hover:scale-105 duration-300">
            <Languages size={64} className="stroke-[1.5]" />
          </div>

          <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
            Välj ditt språk för att fortsätta • Choose your language
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {[
              { code: "sv", label: "Svenska" },
              { code: "en", label: "English" },
              { code: "es", label: "Español" },
              { code: "sw", label: "Kiswahili" },
              { code: "vi", label: "Tiếng Việt" }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  localStorage.setItem("mission_router_ui_language", lang.code);
                  setUiLanguage(lang.code as UiLanguage);
                }}
                className="w-full py-4 px-6 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 font-bold text-lg rounded-2xl border-2 border-slate-100 hover:border-teal-500/30 transition-all shadow-sm active:scale-[0.99] flex items-center justify-between cursor-pointer"
              >
                <span>{lang.label}</span>
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
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
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-800">
      
      {/* Top Header - Simplified (No heart decorative icons) */}
      <header className="bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between py-4 px-6 md:px-10 gap-4 shrink-0">
        <div className="flex items-center gap-3 self-start sm:self-center">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {TRANSLATIONS[uiLanguage].gatewayTitle}
            <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {uiLanguage === "sv" ? "Anonymt" : uiLanguage === "en" ? "Anonymous" : uiLanguage === "es" ? "Anónimo" : uiLanguage === "sw" ? "Siri kabisa" : "Ẩn danh"}
            </span>
          </h1>
        </div>

        {/* Dynamic Header Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2.5">
          {/* Settings Toggle */}
          {uiLanguage && !activeAlertId && (
            <button
              onClick={() => setShowSettingsSidebar(prev => !prev)}
              className={`h-10 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-bold border transition-all active:scale-95 cursor-pointer shrink-0 ${
                showSettingsSidebar
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100"
              }`}
              title="Inställningar"
            >
              <Sliders size={14} />
              <span>{uiLanguage === "sv" ? "Inställningar" : "Settings"}</span>
            </button>
          )}

          {/* Simulator trigger */}
          {uiLanguage && !activeAlertId && (
            <button
              onClick={() => {
                setShowSimulator(prev => !prev);
              }}
              className={`h-10 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-bold border transition-all active:scale-95 cursor-pointer shrink-0 ${
                showSimulator 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100"
              }`}
              title="Simulator"
            >
              <Radio size={14} className={showSimulator ? "animate-pulse" : ""} />
              <span>
                {uiLanguage === "sv" ? "Simulator" : "Simulator"}
              </span>
            </button>
          )}

          {uiLanguage && (
            <button
              onClick={() => {
                localStorage.removeItem("mission_router_ui_language");
                setUiLanguage(null);
              }}
              className="h-10 w-10 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-full flex items-center justify-center text-slate-600 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Ändra språk / Change language"
            >
              <Languages size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
        {pushError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-amber-800 max-w-2xl mx-auto animate-in fade-in duration-200">
            <ShieldAlert size={20} className="shrink-0" />
            <p className="font-semibold">{pushError}</p>
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
              {showSettingsSidebar && (
                <>
                  {/* Backdrop for Mobile Drawer */}
                  <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setShowSettingsSidebar(false)}
                  ></div>
                  
                  {/* Sidebar Panel Container */}
                  <aside className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-50 p-6 overflow-y-auto shadow-2xl border-r border-slate-100 animate-in slide-in-from-left duration-200 lg:relative lg:inset-auto lg:w-auto lg:max-w-none lg:shadow-none lg:border-none lg:p-0 lg:col-span-4 lg:z-10 lg:sticky lg:top-6">
                    <div className="flex items-center justify-between lg:hidden mb-5 pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-slate-900">Notisinställningar</h3>
                      <button 
                        onClick={() => setShowSettingsSidebar(false)}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    
                    <OnboardingForm
                      onSave={handleSaveTags}
                      savedTags={savedTags}
                      pushEnabled={pushEnabled}
                      onEnablePush={handleEnablePush}
                      uiLanguage={uiLanguage || "sv"}
                    />
                  </aside>
                </>
              )}

              {/* Notices Stream (Right/Main column) */}
              <div className={`space-y-6 ${showSettingsSidebar ? "lg:col-span-8" : "lg:col-span-12"}`}>
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(`/larm/${id}`)}
                  uiLanguage={uiLanguage || "sv"}
                />
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Foot Disclaimers */}
      <Disclaimer uiLanguage={uiLanguage || "sv"} />

      {/* Footer Status and Simulator Section */}
      <footer className="mt-auto py-8 border-t border-slate-100 bg-slate-50/50 w-full px-6 flex flex-col items-center gap-4 text-center">
        {/* Connection status indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${subscriptionId ? "bg-teal-500 animate-pulse" : "bg-slate-300"}`}></span>
          <span>
            {subscriptionId 
              ? `${uiLanguage === "sv" ? "Ansluten" : "Connected"} (ID: ${subscriptionId.substring(0, 8)}...)` 
              : (uiLanguage === "sv" ? "Ej ansluten" : "Not connected")}
          </span>
        </div>

        {/* Simulator Panel rendered in footer when active */}
        {showSimulator && (
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-200 mt-2">
            <SimulatorPanel />
          </div>
        )}
      </footer>
    </div>
  );
}
