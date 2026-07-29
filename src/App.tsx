// [src/App.tsx] - Main Application Layout & Controller

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert } from "lucide-react";
import { Disclaimer } from "./features/inbjudningar";
import { AdminConsole } from "./features/sms_assistant";
import { pingRenderBackend } from "./features/mobile_pwa_app";
import { IosInstallModal } from "./components/IosInstallModal";
import { LanguageGatewayModal } from "./components/LanguageGatewayModal";
import { IntroScreen } from "./components/IntroScreen";
import { AppHeader } from "./components/AppHeader";
import { MainViewContent } from "./components/MainViewContent";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { useAppState } from "./hooks/useAppState";

export default function App() {
  useEffect(() => {
    pingRenderBackend();
  }, []);

  const isAdminConsole = typeof window !== "undefined" && window.location.search.includes("admin=true");

  if (isAdminConsole) {
    return <AdminConsole />;
  }

  const {
    showIosModal,
    setShowIosModal,
    uiLanguage,
    setUiLanguage,
    hasAcceptedIntro,
    setHasAcceptedIntro,
    isAdmin,
    handleAdminAuth,
    activeAlertId,
    setActiveAlertId,
    subscriptionId,
    setSubscriptionId,
    savedTags,
    setSavedTags,
  } = useAppState();

  const {
    pushEnabled,
    pushError,
    handleEnablePush,
    handleDisablePush
  } = usePushNotifications(
    uiLanguage,
    subscriptionId,
    setSubscriptionId,
    savedTags,
    () => setShowIosModal(true)
  );

  const [, setStreamCounts] = useState<{ filtered: number; total: number }>({ filtered: 0, total: 0 });

  const handleStreamCountChange = useCallback((filtered: number, total: number) => {
    setStreamCounts(prev => {
      if (prev.filtered === filtered && prev.total === total) {
        return prev;
      }
      return { filtered, total };
    });
  }, []);

  const [activeTab, setActiveTab] = useState<"stream" | "create">("stream");
  const [currentView, setCurrentView] = useState<'stream' | 'settings'>('stream');
  const [isToggling, setIsToggling] = useState<boolean>(false);

  const [isOnline] = useState<boolean>(true);
  const [isSyncing] = useState<boolean>(false);

  const navigateTo = (path: string) => {
    if (path.startsWith("/larm/")) {
      const id = path.replace("/larm/", "");
      setActiveAlertId(id);
    } else {
      setActiveAlertId(null);
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
  }, [pushEnabled, subscriptionId, setSavedTags]);

  if (!uiLanguage) {
    return (
      <LanguageGatewayModal
        onSelectLanguage={(lang) => {
          localStorage.setItem("mission_router_ui_language", lang);
          setUiLanguage(lang);
        }}
      />
    );
  }

  if (!hasAcceptedIntro) {
    return (
      <IntroScreen
        uiLanguage={uiLanguage}
        onAccept={() => {
          localStorage.setItem("mission_router_has_accepted_intro", "true");
          setHasAcceptedIntro(true);
          setCurrentView("stream");
        }}
        onCustomize={() => {
          localStorage.setItem("mission_router_has_accepted_intro", "true");
          setHasAcceptedIntro(true);
          setCurrentView("settings");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-ink selection:bg-brand-accent selection:text-white pb-12">
      <AppHeader
        currentView={currentView}
        onToggleSettings={() => setCurrentView(prev => prev === 'settings' ? 'stream' : 'settings')}
        pushEnabled={pushEnabled}
        isToggling={isToggling}
        onTogglePush={async () => {
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
        onCreateInvitation={() => {
          setCurrentView('stream');
          setActiveTab('create');
        }}
      />

      <main className="flex-1 p-4 max-w-xl w-full mx-auto flex flex-col">
        {pushError && (
          <div className="mb-6 bg-brand-error/10 border border-brand-error/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-brand-error animate-in fade-in duration-200">
            <ShieldAlert size={16} className="shrink-0 text-brand-error" />
            <p className="font-mono uppercase tracking-wider">{pushError}</p>
          </div>
        )}

        <MainViewContent
          activeAlertId={activeAlertId}
          navigateTo={navigateTo}
          uiLanguage={uiLanguage}
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleSaveTags={handleSaveTags}
          savedTags={savedTags}
          pushEnabled={pushEnabled}
          handleEnablePush={handleEnablePush}
          handleDisablePush={handleDisablePush}
          handleStreamCountChange={handleStreamCountChange}
          isAdmin={isAdmin}
        />
      </main>

      <Disclaimer 
        uiLanguage={uiLanguage || "sv"} 
        onShowIntro={() => setHasAcceptedIntro(false)}
        onAdminTrigger={handleAdminAuth}
        isOnline={isOnline}
        isSyncing={isSyncing}
      />

      {showIosModal && (
        <IosInstallModal onClose={() => setShowIosModal(false)} />
      )}
    </div>
  );
}
