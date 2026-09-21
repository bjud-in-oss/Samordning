// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Form State & Logic Facade Hook

import { useState } from "react";
import { FavoriteItem } from "../domain/types";
import { washAnnouncementText } from "@/src/features/mission_router";
import { useInvitationFavorites } from "./useInvitationFavorites";
import { useInvitationDialogs } from "./useInvitationDialogs";
import { useInvitationPublishing } from "./useInvitationPublishing";

export function useInvitationForm(onSuccess?: () => void, isAdmin: boolean = false) {
  // Primary Form State
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [activityText, setActivityText] = useState<string>("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [organizerPersonName, setOrganizerPersonName] = useState<string>("");

  // Recurring & Reminder states
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [hasReminder, setHasReminder] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>("1 timme innan");

  // Mandatory Privacy Consent Checkbox
  const [consentConfirmed, setConsentConfirmed] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string, duration = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  // Dialog Buffers & Modals Sub-Hook
  const dialogs = useInvitationDialogs({
    selectedTime,
    locationName,
    activityText,
    selectedAreas,
    selectedAudience,
    selectedOrganization,
    organizerPersonName,
    isRecurring,
    hasReminder,
    reminderTime
  });

  // Apply favorite helper callback
  const handleApplyFavorite = (fav: FavoriteItem) => {
    setSelectedTime(fav.time || "");
    setLocationName(fav.location || "");
    setSelectedAreas(fav.areas || []);
    setSelectedAudience(fav.audience || []);
    setSelectedOrganization(fav.organization || "");
    setOrganizerPersonName(fav.organizerName || "");
    setActivityText(fav.activity || "");
    setIsRecurring(!!fav.isRecurring);
    if (fav.reminderTime) {
      setHasReminder(true);
      setReminderTime(fav.reminderTime);
    } else {
      setHasReminder(false);
    }
  };

  // Favorites Sub-Hook
  const favs = useInvitationFavorites({
    selectedTime,
    locationName,
    selectedAreas,
    selectedAudience,
    selectedOrganization,
    organizerPersonName,
    activityText,
    isRecurring,
    hasReminder,
    reminderTime,
    onApply: handleApplyFavorite,
    showToast
  });

  // Computed Formatted Output Text
  const formattedText = [
    selectedTime ? `Tid: ${selectedTime}` : "",
    locationName ? `Mötesplats: ${locationName}` : "",
    selectedAreas.length > 0 ? `Bjud in från områden: ${selectedAreas.join(", ")}` : "",
    selectedAudience.length > 0 ? `Målgrupp: ${selectedAudience.join(", ")}` : "",
    selectedOrganization ? `Arrangör: ${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}` : "",
    activityText ? `Aktivitet: ${washAnnouncementText(activityText)}` : "",
    hasReminder && reminderTime ? `Påminnelse: ${reminderTime}` : "",
    isRecurring ? `Upprepas: Varje vecka` : ""
  ].filter(Boolean).join("\n");

  const isFormValid =
    Boolean(selectedTime.trim()) &&
    Boolean(locationName.trim()) &&
    Boolean(activityText.trim()) &&
    Boolean(selectedOrganization.trim()) &&
    selectedAudience.length > 0 &&
    consentConfirmed;

  // Publishing & AI Review Sub-Hook
  const publishing = useInvitationPublishing({
    activityText,
    selectedTime,
    locationName,
    selectedOrganization,
    organizerPersonName,
    consentConfirmed,
    formattedText,
    selectedAudience,
    selectedAreas,
    setSelectedTime,
    setLocationName,
    showToast,
    isAdmin,
    onSuccess
  });

  return {
    // Form fields & setters
    selectedTime,
    setSelectedTime,
    locationName,
    setLocationName,
    selectedAreas,
    setSelectedAreas,
    selectedAudience,
    setSelectedAudience,
    activityText,
    setActivityText,
    selectedOrganization,
    setSelectedOrganization,
    organizerPersonName,
    setOrganizerPersonName,
    isRecurring,
    setIsRecurring,
    hasReminder,
    setHasReminder,
    reminderTime,
    setReminderTime,
    consentConfirmed,
    setConsentConfirmed,

    // Favorites
    favorites: favs.favorites,
    favModalOpen: favs.favModalOpen,
    setFavModalOpen: favs.setFavModalOpen,
    newFavName: favs.newFavName,
    setNewFavName: favs.setNewFavName,
    handleSaveFavorite: favs.handleSaveFavorite,
    handleApplyFavorite: favs.handleApplyFavorite,
    handleRemoveFavorite: favs.handleRemoveFavorite,

    // Dialogs & Buffers
    activeDialog: dialogs.activeDialog,
    setActiveDialog: dialogs.setActiveDialog,
    tempLocation: dialogs.tempLocation,
    setTempLocation: dialogs.setTempLocation,
    tempAreas: dialogs.tempAreas,
    setTempAreas: dialogs.setTempAreas,
    tempAudience: dialogs.tempAudience,
    setTempAudience: dialogs.setTempAudience,
    tempOrg: dialogs.tempOrg,
    setTempOrg: dialogs.setTempOrg,
    tempPersonName: dialogs.tempPersonName,
    setTempPersonName: dialogs.setTempPersonName,
    tempActivity: dialogs.tempActivity,
    setTempActivity: dialogs.setTempActivity,
    tempTime: dialogs.tempTime,
    setTempTime: dialogs.setTempTime,
    tempIsRecurring: dialogs.tempIsRecurring,
    setTempIsRecurring: dialogs.setTempIsRecurring,
    tempHasReminder: dialogs.tempHasReminder,
    setTempHasReminder: dialogs.setTempHasReminder,
    tempReminderTime: dialogs.tempReminderTime,
    setTempReminderTime: dialogs.setTempReminderTime,
    showPersonNameModal: dialogs.showPersonNameModal,
    setShowPersonNameModal: dialogs.setShowPersonNameModal,
    showQrSection: dialogs.showQrSection,
    setShowQrSection: dialogs.setShowQrSection,
    openDialog: dialogs.openDialog,
    closeDialog: dialogs.closeDialog,

    // Publishing & State
    sending: publishing.sending,
    submittedSuccessfully: publishing.submittedSuccessfully,
    setSubmittedSuccessfully: publishing.setSubmittedSuccessfully,
    toast,
    aiReviewModal: publishing.aiReviewModal,
    setAiReviewModal: publishing.setAiReviewModal,
    handleAutoFillExtracted: publishing.handleAutoFillExtracted,
    formattedText,
    isFormValid,
    handleAttemptPublish: publishing.handleAttemptPublish,
    executePublish: publishing.executePublish
  };
}
