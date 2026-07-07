import React, { useState, useEffect } from "react";
import { ShieldAlert, Users, Radio, Smartphone, AlertCircle, Sparkles, Heart, Languages, Globe } from "lucide-react";
import OnboardingForm from "./features/mission_router/components/OnboardingForm";
import AlertDetail from "./features/mission_router/components/AlertDetail";
import SimulatorPanel from "./features/mission_router/components/SimulatorPanel";
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
  // Views: 'volunteer' | 'simulator'
  const [activeTab, setActiveTab] = useState<"volunteer" | "simulator">("volunteer");
  
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

  // Check if push is already enabled in browser
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setPushEnabled(!!subscription);
        });
      });
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
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Missionshjälpen
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Ett tryggt stöd för våra unga missionärer i Göteborg
            </p>
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

  const isVolunteerMode = activeTab === "volunteer" || !!activeAlertId;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-800">
      {/* Top Header matching Clean Minimalism theme */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
            isVolunteerMode ? "bg-teal-600" : "bg-blue-600"
          }`}>
            {isVolunteerMode ? (
              <Heart size={22} className="fill-white/10" />
            ) : (
              <Radio size={22} className="animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {isVolunteerMode ? "Missionsstöd & Samordning" : "Stateless Mission Router"}
              <span className="hidden sm:inline text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                {isVolunteerMode ? "Helt anonymt" : "Amnesi v1.0"}
              </span>
            </h1>
          </div>
        </div>

        {/* Dynamic Header Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className={`w-2 h-2 rounded-full ${
              isVolunteerMode ? "bg-emerald-500" : "bg-blue-500 animate-ping"
            }`}></div>
            <span>{isVolunteerMode ? "Säker anslutning aktiv" : "SECURE RAM MODE"}</span>
          </div>

          <div className="h-10 px-3 md:px-4 bg-slate-50 border border-slate-100 rounded-full flex items-center text-xs md:text-sm font-semibold text-slate-600">
            {subscriptionId ? (
              isVolunteerMode ? `Ditt ID: ${subscriptionId.substring(0, 8)}...` : `Token: ${subscriptionId.substring(0, 8)}...`
            ) : "Ej ansluten"}
          </div>

          {uiLanguage && (
            <button
              onClick={() => {
                localStorage.removeItem("mission_router_ui_language");
                setUiLanguage(null);
              }}
              className="h-10 w-10 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-full flex items-center justify-center text-slate-600 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Ändra språk / Change language"
            >
              <Globe size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Mode navigation / system tabs */}
      <nav className="bg-white border-b border-slate-100 px-4 md:px-10 py-3 flex items-center justify-between">
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            onClick={() => {
              setActiveTab("volunteer");
              navigateTo("/");
            }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "volunteer" && !activeAlertId
                ? "bg-white text-slate-950 shadow-sm border border-slate-100/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Volontärsportal
          </button>
          <button
            onClick={() => {
              setActiveTab("simulator");
              navigateTo("/");
            }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "simulator" && !activeAlertId
                ? "bg-white text-slate-950 shadow-sm border border-slate-100/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Simuleringspanel
          </button>
        </div>

        {activeAlertId && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
            <AlertCircle size={14} />
            <span>Aktiv förfrågan: {activeAlertId}</span>
          </div>
        )}
      </nav>

      {/* Main Content Stage */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
        {pushError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-amber-800 max-w-2xl mx-auto">
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
        ) : activeTab === "volunteer" ? (
          <OnboardingForm
            onSave={handleSaveTags}
            savedTags={savedTags}
            pushEnabled={pushEnabled}
            onEnablePush={handleEnablePush}
            uiLanguage={uiLanguage || "sv"}
          />
        ) : (
          <SimulatorPanel />
        )}
      </main>

      {/* Foot Disclaimers */}
      <Disclaimer uiLanguage={uiLanguage || "sv"} />
    </div>
  );
}
