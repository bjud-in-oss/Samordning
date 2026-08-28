// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Single Page Form Orchestrator

import React from "react";
import { CheckCircle } from "lucide-react";
import { CreateInvitationFormProps } from "./domain/types";
import { useInvitationForm } from "./hooks/useInvitationForm";
import { FavoritesBar } from "./components/FavoritesBar";
import { PreviewCard } from "./components/PreviewCard";
import { AiReviewModal } from "./components/AiReviewModal";
import { SubmissionSuccessModal } from "./components/SubmissionSuccessModal";
import { TimeDialog } from "./components/TimeDialog";
import { LocationDialog } from "./components/LocationDialog";
import { ActivityDialog } from "./components/ActivityDialog";
import { AreaDialog } from "./components/AreaDialog";
import { AudienceDialog } from "./components/AudienceDialog";
import { OrganizerDialog } from "./components/OrganizerDialog";

export default function CreateInvitationForm({
  uiLanguage,
  savedTags,
  isAdmin = false,
  onBack,
  onSuccess
}: CreateInvitationFormProps) {
  const form = useInvitationForm(onSuccess, isAdmin);

  const handleSuccessClose = () => {
    form.setSubmittedSuccessfully(false);
    if (onSuccess) onSuccess();
    if (onBack) onBack();
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Notification */}
      {form.toast && (
        <div className="fixed top-4 right-4 z-50 bg-brand-accent text-white font-mono text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-white shrink-0" />
          <span>{form.toast}</span>
        </div>
      )}

      {/* Favorites Bar (discreet template selection) */}
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

      {/* Live Interactive Preview Card - Hidden completely during active dialog editing for strict field focus */}
      {!form.activeDialog && (
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
          consentConfirmed={form.consentConfirmed}
          onToggleConsent={form.setConsentConfirmed}
          isAdmin={isAdmin}
          onOpenDialog={form.openDialog}
          onCancel={onBack}
          onSend={form.handleAttemptPublish}
          sending={form.sending}
        />
      )}

      {/* In-place Dialog Render Area - Sharp Focus */}
      {form.activeDialog && (
        <div className="p-5 bg-brand-paper/80 border border-brand-accent/30 rounded-3xl shadow-lg animate-in fade-in zoom-in-95 duration-150">
          {form.activeDialog === "time" && (
            <TimeDialog
              tempTime={form.tempTime}
              setTempTime={form.setTempTime}
              isRecurring={form.tempIsRecurring}
              setIsRecurring={form.setTempIsRecurring}
              hasReminder={form.tempHasReminder}
              setHasReminder={form.setTempHasReminder}
              reminderTime={form.tempReminderTime}
              setReminderTime={form.setTempReminderTime}
              onClose={form.closeDialog}
              onSave={t => {
                form.setSelectedTime(t);
                form.setIsRecurring(form.tempIsRecurring);
                form.setHasReminder(form.tempHasReminder);
                form.setReminderTime(form.tempReminderTime);
                form.closeDialog();
              }}
            />
          )}

          {form.activeDialog === "location" && (
            <LocationDialog
              tempLocation={form.tempLocation}
              setTempLocation={form.setTempLocation}
              selectedAreas={form.selectedAreas}
              setSelectedAreas={form.setSelectedAreas}
              onClose={form.closeDialog}
              onSave={loc => {
                form.setLocationName(loc);
                form.closeDialog();
              }}
            />
          )}

          {form.activeDialog === "activity" && (
            <ActivityDialog
              tempActivity={form.tempActivity}
              setTempActivity={form.setTempActivity}
              onClose={form.closeDialog}
              onSave={act => {
                form.setActivityText(act);
                form.closeDialog();
              }}
            />
          )}

          {form.activeDialog === "area" && (
            <AreaDialog
              tempAreas={form.tempAreas}
              setTempAreas={form.setTempAreas}
              onClose={form.closeDialog}
              onSave={areas => {
                form.setSelectedAreas(areas);
                form.closeDialog();
              }}
            />
          )}

          {form.activeDialog === "audience" && (
            <AudienceDialog
              tempAudience={form.tempAudience}
              setTempAudience={form.setTempAudience}
              onClose={form.closeDialog}
              onSave={aud => {
                form.setSelectedAudience(aud);
                form.closeDialog();
              }}
            />
          )}

          {form.activeDialog === "organization" && (
            <OrganizerDialog
              tempOrg={form.tempOrg}
              setTempOrg={form.setTempOrg}
              organizerPersonName={form.tempPersonName}
              setOrganizerPersonName={form.setTempPersonName}
              showPersonNameModal={form.showPersonNameModal}
              setShowPersonNameModal={form.setShowPersonNameModal}
              onClose={form.closeDialog}
              onSave={org => {
                form.setSelectedOrganization(org);
                form.setOrganizerPersonName(form.tempPersonName);
                form.closeDialog();
              }}
            />
          )}
        </div>
      )}

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

      {/* Post Submission Confirmation & Calendar Modal */}
      {form.submittedSuccessfully && (
        <SubmissionSuccessModal
          activityText={form.activityText}
          selectedTime={form.selectedTime}
          locationName={form.locationName}
          selectedAreas={form.selectedAreas}
          formattedText={form.formattedText}
          isAdmin={isAdmin}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}

