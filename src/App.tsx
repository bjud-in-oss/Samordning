import React, { useState, useEffect } from "react";
import { ShieldAlert, Users, Radio, Smartphone, AlertCircle, Sparkles, Heart } from "lucide-react";
import OnboardingForm from "./features/mission_router/components/OnboardingForm";
import AlertDetail from "./features/mission_router/components/AlertDetail";
import SimulatorPanel from "./features/mission_router/components/SimulatorPanel";
import Disclaimer from "./features/mission_router/components/Disclaimer";

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
          />
        ) : activeTab === "volunteer" ? (
          <OnboardingForm
            onSave={handleSaveTags}
            savedTags={savedTags}
            pushEnabled={pushEnabled}
            onEnablePush={handleEnablePush}
          />
        ) : (
          <SimulatorPanel />
        )}
      </main>

      {/* Foot Disclaimers */}
      <Disclaimer />
    </div>
  );
}
