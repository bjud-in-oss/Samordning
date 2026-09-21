// [src/features/inbjudningar/ActiveStream.tsx] - Stream Container Component

import React, { useEffect } from "react";
import { UiLanguage } from "../mission_router";
import { CreateInvitationForm } from "../skapa_inbjudan";
import { AdminModerationQueue } from "./components/AdminModerationQueue";
import { StreamFilterStatus, SavedFilterTags } from "./components/StreamFilterStatus";
import { StreamQuoteCard } from "./components/StreamQuoteCard";
import { PendingProposalsList } from "./components/PendingProposalsList";
import { StreamContentList } from "./components/StreamContentList";
import { useActiveStream } from "./hooks/useActiveStream";

export interface ActiveStreamProps {
  onSelectAlert: (id: string) => void;
  uiLanguage: UiLanguage;
  savedTags?: SavedFilterTags | null;
  onStreamCountChange?: (filteredCount: number, totalCount: number) => void;
  inlineCreate?: boolean;
  isAdmin?: boolean;
  onBack?: () => void;
  pushEnabled?: boolean;
  onOpenSettings?: () => void;
}

export default function ActiveStream({
  onSelectAlert,
  uiLanguage,
  savedTags,
  onStreamCountChange,
  inlineCreate = false,
  isAdmin = false,
  onBack,
  pushEnabled = false,
  onOpenSettings
}: ActiveStreamProps) {
  const {
    loading,
    error,
    pendingAlerts,
    activeStream,
    filteredStream,
    fetchStream,
    handleModerate
  } = useActiveStream(savedTags);

  useEffect(() => {
    onStreamCountChange?.(filteredStream.length, activeStream.length);
  }, [filteredStream.length, activeStream.length, onStreamCountChange]);

  const handleDeleteActiveAlert = async (id: string) => {
    await handleModerate(id, "rejected");
    fetchStream();
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto text-left">
      {inlineCreate && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <CreateInvitationForm 
            uiLanguage={uiLanguage} 
            savedTags={savedTags as unknown as Record<string, unknown>} 
            isAdmin={isAdmin} 
            onBack={onBack} 
            onSuccess={() => {
              fetchStream();
              onBack?.();
            }} 
          />
        </div>
      )}
      {!pushEnabled && (
        <>
          <StreamFilterStatus savedTags={savedTags} pushEnabled={pushEnabled} onOpenSettings={onOpenSettings} />
          <StreamQuoteCard />
        </>
      )}
      {isAdmin && <AdminModerationQueue pendingAlerts={pendingAlerts} handleModerate={handleModerate} />}
      <div className="space-y-4 text-left">
        <PendingProposalsList activeStreamItems={activeStream} />
        <StreamContentList
          loading={loading}
          error={error}
          filteredStream={filteredStream}
          savedTags={savedTags}
          pushEnabled={pushEnabled}
          uiLanguage={uiLanguage}
          isAdmin={isAdmin}
          onOpenSettings={onOpenSettings}
          onSelectAlert={onSelectAlert}
          onDeleteAlert={handleDeleteActiveAlert}
        />
      </div>
    </div>
  );
}
