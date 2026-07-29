// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Single Page Form Orchestrator

import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Send, QrCode } from "lucide-react";
import { CreateInvitationFormProps } from "./domain/types";
import { useInvitationForm } from "./hooks/useInvitationForm";
import { FavoritesBar } from "./components/FavoritesBar";
import { PreviewCard } from "./components/PreviewCard";
import { GatewayQrModal } from "./components/GatewayQrModal";
import { PostSubmissionStepper } from "./components/PostSubmissionStepper";
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

  // Background AI pillar categorization state
  const [pillarCategory, setPillarCategory] = useState<string>("Vara en vän");
  const [showStepper, setShowStepper] = useState<boolean>(false);

  // Background AI categorization effect
  useEffect(() => {
    const text = form.activityText.toLowerCase();
    if (!text) {
      setPillarCategory("Vara en vän");
      return;
    }
    if (text.includes("skrift") || text.includes("skrifter") || text.includes("mormons bok") || text.includes("lektion") || text.includes("undervisa") || text.includes("bibeln") || text.includes("guds ord")) {
      setPillarCategory("Läsa skrifterna");
    } else if (text.includes("städa") || text.includes("flytta") || text.includes("bära") || text.includes("hjälpa") || text.includes("tjänande") || text.includes("stöd")) {
      setPillarCategory("Hjälpa andra");
    } else {
      setPillarCategory("Vara en vän");
    }
  }, [form.activityText]);

  const handlePrimarySendClick = () => {
    setShowStepper(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 relative">
      {/* Toast Notification */}
      {form.toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white font-mono text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{form.toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-ink/10 pb-4 gap-3">
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
            <h1 className="text-2xl sm:text-3xl font-serif font-bold italic tracking-tight text-brand-ink">
              SKRIV INBJUDAN
            </h1>
            <p className="font-mono text-xs text-brand-ink/60">
              Klicka på valfritt fält i LiveCardet nedan för att redigera i fokus
            </p>
          </div>
        </div>

        {/* Header Corner Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => form.setShowQrSection(!form.showQrSection)}
            className="px-3.5 py-2 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/15 text-brand-ink font-mono text-xs uppercase font-semibold tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <QrCode size={14} className="text-brand-accent shrink-0" />
            <span>{form.showQrSection ? "Dölj QR" : "Mobil QR"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrimarySendClick}
            disabled={form.sending}
            className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Send size={14} />
            <span>Skicka inbjudan</span>
          </button>
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
      <div className={`transition-all duration-300 ${form.activeDialog ? "opacity-30 pointer-events-none scale-[0.98]" : "opacity-100"}`}>
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
          category={pillarCategory}
          focusedField={form.activeDialog}
          onOpenDialog={form.openDialog}
        />
      </div>

      {/* Focused Edit Backdrop & Dialog Modal */}
      {form.activeDialog && (
        <div className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-6 bg-white border border-brand-accent/30 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-150">
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
        </div>
      )}

      {/* Privacy Consent Checkbox */}
      <div className="pt-2 border-t border-brand-ink/10">
        <label className="flex items-start gap-3 cursor-pointer p-3.5 bg-brand-paper/60 rounded-2xl border border-brand-ink/5">
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

      {/* Bottom Actions Row */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => form.setShowQrSection(!form.showQrSection)}
          className="px-4 py-2.5 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/15 text-brand-ink font-mono text-xs uppercase font-semibold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <QrCode size={15} className="text-brand-accent shrink-0" />
          <span>{form.showQrSection ? "Dölj mobil-QR" : "Sänd från mobilen"}</span>
        </button>

        <button
          type="button"
          onClick={handlePrimarySendClick}
          disabled={form.sending}
          className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send size={15} />
          <span>Skicka inbjudan</span>
        </button>
      </div>

      {/* Gateway QR / SMS Fallback Section */}
      <GatewayQrModal
        isFormValid={form.isFormValid}
        showQrSection={form.showQrSection}
        setShowQrSection={form.setShowQrSection}
        formattedText={form.formattedText}
      />

      {/* 4-Step Sequential Post-Submission Stepper */}
      {showStepper && (
        <PostSubmissionStepper
          activityText={form.activityText}
          selectedTime={form.selectedTime}
          locationName={form.locationName}
          selectedAreas={form.selectedAreas}
          selectedAudience={form.selectedAudience}
          selectedOrganization={form.selectedOrganization}
          organizerPersonName={form.organizerPersonName}
          category={pillarCategory}
          formattedText={form.formattedText}
          onClose={() => setShowStepper(false)}
          onCompletePublish={form.executePublish}
          sending={form.sending}
        />
      )}
    </div>
  );
}


