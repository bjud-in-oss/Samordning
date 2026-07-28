// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Single Page Form Orchestrator

import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Send, QrCode } from "lucide-react";
import { CreateInvitationFormProps } from "./domain/types";
import { useInvitationForm } from "./hooks/useInvitationForm";
import { FavoritesBar } from "./components/FavoritesBar";
import { PreviewCard } from "./components/PreviewCard";
import { GatewayQrModal } from "./components/GatewayQrModal";
import { AiFlagModal } from "./components/AiFlagModal";
import { AiReviewModal } from "./components/AiReviewModal";
import { PostSubmissionSteps } from "./components/PostSubmissionSteps";
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
  const [showPostSubmissionSteps, setShowPostSubmissionSteps] = useState<boolean>(false);

  const handlePrimarySendClick = () => {
    // Open post-submission steps
    setShowPostSubmissionSteps(true);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Notification */}
      {form.toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white font-mono text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{form.toast}</span>
        </div>
      )}

      {/* Live Interactive Preview Card - Hidden when editing a field in dialog */}
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
          activeDialog={form.activeDialog}
          onOpenDialog={form.openDialog}
        />
      )}

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

      {/* Send Button in bottom right corner */}
      {!form.activeDialog && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handlePrimarySendClick}
            disabled={form.sending}
            className="px-6 py-2.5 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send size={15} />
            <span>{form.sending ? "Granskar & skickar..." : "Sänd"}</span>
          </button>
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

      {/* Post-Submission Sequential Cards Modal */}
      {showPostSubmissionSteps && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <PostSubmissionSteps
            formattedText={form.formattedText}
            selectedTime={form.selectedTime}
            locationName={form.locationName}
            selectedOrganization={form.selectedOrganization}
            organizerPersonName={form.organizerPersonName}
            activityText={form.activityText}
            selectedAreas={form.selectedAreas}
            selectedAudience={form.selectedAudience}
            onFinished={() => {
              setShowPostSubmissionSteps(false);
              if (onSuccess) onSuccess();
            }}
            onCancel={() => setShowPostSubmissionSteps(false)}
          />
        </div>
      )}
    </div>
  );
}

