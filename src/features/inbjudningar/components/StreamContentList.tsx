// [src/features/inbjudningar/components/StreamContentList.tsx] - Stream Content & Empty State Renderer

import React from "react";
import { ShieldAlert } from "lucide-react";
import { ActiveAlert, UiLanguage } from "../../mission_router";
import { StreamFilterStatus, SavedFilterTags } from "./StreamFilterStatus";
import { StreamNoticeCard } from "./StreamNoticeCard";

export interface StreamContentListProps {
  loading: boolean;
  error: string | null;
  filteredStream: ActiveAlert[];
  savedTags?: SavedFilterTags | null;
  pushEnabled?: boolean;
  uiLanguage: UiLanguage;
  isAdmin?: boolean;
  onOpenSettings?: () => void;
  onSelectAlert: (id: string) => void;
  onDeleteAlert?: (id: string) => void;
}

export function StreamContentList({
  loading,
  error,
  filteredStream,
  savedTags,
  pushEnabled = false,
  uiLanguage,
  isAdmin = false,
  onOpenSettings,
  onSelectAlert,
  onDeleteAlert
}: StreamContentListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-brand-ink/5 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-brand-ink/60">
          {uiLanguage === "sv" ? "Hämtar inbjudningar..." : "Loading invitations..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-brand-ink/5 text-center space-y-2">
        <ShieldAlert size={24} className="text-brand-error mx-auto opacity-80" />
        <p className="text-xs font-mono text-brand-error uppercase tracking-wider">{error}</p>
      </div>
    );
  }

  if (filteredStream.length === 0) {
    return (
      <div className="space-y-4">
        {pushEnabled && (
          <StreamFilterStatus savedTags={savedTags} pushEnabled={pushEnabled} onOpenSettings={onOpenSettings} />
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
        {topItems.map((item) => (
          <StreamNoticeCard 
            key={item.id} 
            item={item} 
            onSelectAlert={onSelectAlert} 
            isAdmin={isAdmin} 
            onDeleteAlert={onDeleteAlert} 
          />
        ))}
        <StreamFilterStatus savedTags={savedTags} pushEnabled={pushEnabled} onOpenSettings={onOpenSettings} />
        {remainingItems.map((item) => (
          <StreamNoticeCard 
            key={item.id} 
            item={item} 
            onSelectAlert={onSelectAlert} 
            isAdmin={isAdmin} 
            onDeleteAlert={onDeleteAlert} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredStream.map((item) => (
        <StreamNoticeCard 
          key={item.id} 
          item={item} 
          onSelectAlert={onSelectAlert} 
          isAdmin={isAdmin} 
          onDeleteAlert={onDeleteAlert} 
        />
      ))}
    </div>
  );
}
