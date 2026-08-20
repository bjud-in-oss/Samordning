// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Single Page Form Orchestrator

import React from "react";
import { ArrowLeft, CheckCircle, Send, QrCode } from "lucide-react";
import { CreateInvitationFormProps } from "./domain/types";
import { useInvitationForm } from "./hooks/useInvitationForm";
import { FavoritesBar } from "./components/FavoritesBar";
import { PreviewCard } from "./components/PreviewCard";
import { GatewayQrModal } from "./components/GatewayQrModal";
import { AiFlagModal } from "./components/AiFlagModal";
import { AiReviewModal } from "./components/AiReviewModal";
import { PostSubmissionStepper } from "./components/PostSubmissionStepper";
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
  const form = useInvitationForm(onSuccess);
  const [showPostStepper, setShowPostStepper] = React.useState<boolean>(false);

  const handlePrimarySendClick = () => {
    form.handleAttemptPublish();
    setShowPostStepper(true);
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
        <>
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
            onCancel={onBack}
            onSend={handlePrimarySendClick}
            sending={form.sending}
          />

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
        </>
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
      {/* Post Submission 4-Step Stepper */}
      {showPostStepper && (
        <PostSubmissionStepper
          activityText={form.activityText}
          selectedTime={form.selectedTime}
          locationName={form.locationName}
          selectedOrganization={form.selectedOrganization}
          organizerPersonName={form.organizerPersonName}
          selectedAreas={form.selectedAreas}
          selectedAudience={form.selectedAudience}
          consentConfirmed={form.consentConfirmed}
          setConsentConfirmed={form.setConsentConfirmed}
          formattedText={form.formattedText}
          aiProposal={form.aiReviewModal.proposal}
          onClose={() => setShowPostStepper(false)}
          onSuccess={() => {
            setShowPostStepper(false);
            if (onSuccess) onSuccess();
          }}
        />
      )}
    </div>
  );
}

