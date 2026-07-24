// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Single Page Form Orchestrator

import React from "react";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { CreateInvitationFormProps } from "./domain/types";
import { useInvitationForm } from "./hooks/useInvitationForm";
import { FavoritesBar } from "./components/FavoritesBar";
import { PreviewCard } from "./components/PreviewCard";
import { GatewayQrModal } from "./components/GatewayQrModal";
import { AiFlagModal } from "./components/AiFlagModal";
import { AiReviewModal } from "./components/AiReviewModal";
import { TimeDialog } from "./components/dialogs/TimeDialog";
import { LocationDialog } from "./components/dialogs/LocationDialog";
import { ActivityDialog } from "./components/dialogs/ActivityDialog";
import { AreaDialog } from "./components/dialogs/AreaDialog";
import { AudienceDialog } from "./components/dialogs/AudienceDialog";
import { OrganizerDialog } from "./components/dialogs/OrganizerDialog";

export default function CreateInvitationForm({
  uiLanguage,
  savedTags,
  isAdmin = false,
  onBack,
  onSuccess
}: CreateInvitationFormProps) {
  const form = useInvitationForm(onSuccess);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {form.toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white font-mono text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{form.toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 bg-brand-paper hover:bg-brand-paper/80 rounded-xl border border-brand-ink/10 text-brand-ink transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-ink">
              Skapa ny Inbjudan
            </h1>
            <p className="font-mono text-xs text-brand-ink/60">
              Inbjudan publiceras direkt i det gemensamma flödet
            </p>
          </div>
        </div>
      </div>

      {/* Favorites Bar */}
      <FavoritesBar
        favorites={form.favorites}
        favModalOpen={form.favModalOpen}
        setFavModalOpen={form.setFavModalOpen}
        newFavName={form.newFavName}
        setNewFavName={form.setNewFavName}
        onSaveFavorite={form.handleSaveFavorite}
        onApplyFavorite={form.handleApplyFavorite}
        onRemoveFavorite={form.handleRemoveFavorite}
      />

      {/* Live Interactive Preview Card */}
      <PreviewCard
        selectedTime={form.selectedTime}
        locationName={form.locationName}
        selectedAreas={form.selectedAreas}
        selectedAudience={form.selectedAudience}
        selectedOrganization={form.selectedOrganization}
        organizerPersonName={form.organizerPersonName}
        activityText={form.activityText}
        isRecurring={form.isRecurring}
        hasReminder={form.hasReminder}
        reminderTime={form.reminderTime}
        onOpenDialog={form.openDialog}
      />

      {/* In-place Dialog Render Area */}
      {form.activeDialog && (
        <div className="p-5 bg-brand-paper/80 border border-brand-accent/30 rounded-3xl shadow-lg animate-in fade-in zoom-in-95 duration-150">
          {form.activeDialog === "time" && (
            <TimeDialog
              tempTime={form.tempTime}
              setTempTime={form.setTempTime}
              isRecurring={form.isRecurring}
              setIsRecurring={form.setIsRecurring}
              hasReminder={form.hasReminder}
              setHasReminder={form.setHasReminder}
              reminderTime={form.reminderTime}
              setReminderTime={form.setReminderTime}
              onClose={() => form.setActiveDialog(null)}
              onSave={t => {
                form.setSelectedTime(t);
                form.setActiveDialog(null);
              }}
            />
          )}

          {form.activeDialog === "location" && (
            <LocationDialog
              tempLocation={form.tempLocation}
              setTempLocation={form.setTempLocation}
              selectedAreas={form.selectedAreas}
              setSelectedAreas={form.setSelectedAreas}
              onClose={() => form.setActiveDialog(null)}
              onSave={loc => {
                form.setLocationName(loc);
                form.setActiveDialog(null);
              }}
            />
          )}

          {form.activeDialog === "activity" && (
            <ActivityDialog
              tempActivity={form.tempActivity}
              setTempActivity={form.setTempActivity}
              onClose={() => form.setActiveDialog(null)}
              onSave={act => {
                form.setActivityText(act);
                form.setActiveDialog(null);
              }}
            />
          )}

          {form.activeDialog === "area" && (
            <AreaDialog
              tempAreas={form.tempAreas}
              setTempAreas={form.setTempAreas}
              onClose={() => form.setActiveDialog(null)}
              onSave={areas => {
                form.setSelectedAreas(areas);
                form.setActiveDialog(null);
              }}
            />
          )}

          {form.activeDialog === "audience" && (
            <AudienceDialog
              tempAudience={form.tempAudience}
              setTempAudience={form.setTempAudience}
              onClose={() => form.setActiveDialog(null)}
              onSave={aud => {
                form.setSelectedAudience(aud);
                form.setActiveDialog(null);
              }}
            />
          )}

          {form.activeDialog === "organization" && (
            <OrganizerDialog
              tempOrg={form.tempOrg}
              setTempOrg={form.setTempOrg}
              organizerPersonName={form.organizerPersonName}
              setOrganizerPersonName={form.setOrganizerPersonName}
              showPersonNameModal={form.showPersonNameModal}
              setShowPersonNameModal={form.setShowPersonNameModal}
              onClose={() => form.setActiveDialog(null)}
              onSave={org => {
                form.setSelectedOrganization(org);
                form.setActiveDialog(null);
              }}
            />
          )}
        </div>
      )}

      {/* Privacy Consent Checkbox */}
      <div className="pt-2 border-t border-brand-ink/10">
        <label className="flex items-start gap-3 cursor-pointer p-3 bg-brand-paper/50 rounded-2xl border border-brand-ink/5">
          <input
            type="checkbox"
            checked={form.consentConfirmed}
            onChange={e => form.setConsentConfirmed(e.target.checked)}
            className="mt-0.5 rounded border-brand-ink/30 text-brand-accent focus:ring-brand-accent shrink-0"
          />
          <span className="text-xs text-brand-ink/80 leading-relaxed font-light">
            Jag bekräftar att jag inte delar andras personuppgifter (som namn, kontaktinfo, etc) i inbjudan utan deras uttryckliga godkännande. Jag förstår att min inbjudan granskas innan publicering.
          </span>
        </label>
      </div>

      {/* Always-clickable Direct Web Publish Button */}
      <button
        type="button"
        onClick={form.handleAttemptPublish}
        disabled={form.sending}
        className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 text-white font-mono text-sm uppercase font-bold tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <Send size={18} />
        <span>{form.sending ? "Granskar & skickar..." : "Publicera på anslagstavlan"}</span>
      </button>

      {/* Gateway QR / SMS Fallback Section */}
      <GatewayQrModal
        isFormValid={form.isFormValid}
        showQrSection={form.showQrSection}
        setShowQrSection={form.setShowQrSection}
        formattedText={form.formattedText}
      />

      {/* Smart AI Pre-flight Review Modal */}
      {form.aiReviewModal.open && (
        <AiReviewModal
          proposal={form.aiReviewModal.proposal}
          onClose={() => form.setAiReviewModal({ open: false, proposal: { missingFields: [] } })}
          onAutoFill={form.handleAutoFillExtracted}
          onPublishAnyway={form.executePublish}
          sending={form.sending}
        />
      )}
    </div>
  );
}

