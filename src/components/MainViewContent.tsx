import React from "react";
import { OnboardingWizard } from "../features/anpassa";
import { AlertDetail, ActiveStream } from "../features/inbjudningar";
import { CreateInvitationForm } from "../features/skapa_inbjudan";
import { UiLanguage } from "../features/mission_router";

interface MainViewContentProps {
  activeAlertId: string | null;
  navigateTo: (path: string) => void;
  uiLanguage: UiLanguage;
  currentView: 'stream' | 'settings';
  setCurrentView: React.Dispatch<React.SetStateAction<'stream' | 'settings'>>;
  activeTab: "stream" | "create";
  setActiveTab: React.Dispatch<React.SetStateAction<"stream" | "create">>;
  handleSaveTags: (tags: any) => void;
  savedTags: any;
  pushEnabled: boolean;
  handleEnablePush: () => void;
  handleDisablePush: () => void;
  handleStreamCountChange: (filtered: number, total: number) => void;
  isAdmin: boolean;
}

export function MainViewContent({
  activeAlertId,
  navigateTo,
  uiLanguage,
  currentView,
  setCurrentView,
  activeTab,
  setActiveTab,
  handleSaveTags,
  savedTags,
  pushEnabled,
  handleEnablePush,
  handleDisablePush,
  handleStreamCountChange,
  isAdmin
}: MainViewContentProps) {
  if (activeAlertId) {
    return (
      <AlertDetail
        alertId={activeAlertId}
        onBack={() => navigateTo("/")}
        uiLanguage={uiLanguage || "sv"}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-200 space-y-6">
      <div className="w-full">
        {currentView === 'settings' && (
          <div className="bg-white rounded-3xl w-full p-6 shadow-sm border border-brand-ink/5">
            <OnboardingWizard
              onSave={(tags) => handleSaveTags(tags)}
              onClose={() => setCurrentView('stream')}
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
            isAdmin={isAdmin}
            pushEnabled={pushEnabled}
            onEnablePush={handleEnablePush}
            onOpenSettings={() => setCurrentView('settings')}
          />
        )}

        {currentView === 'stream' && activeTab === "create" && (
          <ActiveStream
            onSelectAlert={(id) => navigateTo(`/larm/${id}`)}
            uiLanguage={uiLanguage || "sv"}
            savedTags={savedTags}
            onStreamCountChange={handleStreamCountChange}
            inlineCreate={true}
            isAdmin={isAdmin}
            pushEnabled={pushEnabled}
            onEnablePush={handleEnablePush}
            onBack={() => setActiveTab("stream")}
            onOpenSettings={() => setCurrentView('settings')}
          />
        )}
      </div>
    </div>
  );
}
