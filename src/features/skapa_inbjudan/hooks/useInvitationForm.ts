// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Form State & Logic Hook

import { useState } from "react";
import { FavoriteItem, ActiveDialogType, AiReviewProposal } from "../domain/types";
import { GATEWAY_NUMBER } from "../domain/constants";
import { washAnnouncementText } from "../../mission_router/domain/parser";

export function useInvitationForm(onSuccess?: () => void) {
  // Favorites with custom names in localStorage
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("mission_router_named_favorites");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [favModalOpen, setFavModalOpen] = useState(false);
  const [newFavName, setNewFavName] = useState("");

  // Form State
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>(["Alla målgrupper"]);
  const [activityText, setActivityText] = useState<string>("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [organizerPersonName, setOrganizerPersonName] = useState<string>("");

  // Recurring & Reminder states
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [hasReminder, setHasReminder] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>("1 timme innan");

  // Mandatory Privacy Consent Checkbox
  const [consentConfirmed, setConsentConfirmed] = useState<boolean>(false);

  // Active In-place Dialog
  const [activeDialog, setActiveDialog] = useState<ActiveDialogType>(null);

  // Temporary dialog buffers
  const [tempLocation, setTempLocation] = useState<string>("");
  const [tempAreas, setTempAreas] = useState<string[]>([]);
  const [tempAudience, setTempAudience] = useState<string[]>([]);
  const [tempOrg, setTempOrg] = useState<string>("");
  const [tempActivity, setTempActivity] = useState<string>("");
  const [tempTime, setTempTime] = useState<string>("");
  const [showPersonNameModal, setShowPersonNameModal] = useState<boolean>(false);
  const [showQrSection, setShowQrSection] = useState<boolean>(false);

  // Helper to open a dialog with initialized buffer
  const openDialog = (dialog: ActiveDialogType) => {
    if (dialog === "time") setTempTime(selectedTime);
    if (dialog === "location") setTempLocation(locationName);
    if (dialog === "activity") setTempActivity(activityText);
    if (dialog === "area") setTempAreas(selectedAreas);
    if (dialog === "audience") setTempAudience(selectedAudience);
    if (dialog === "organization") setTempOrg(selectedOrganization);
    setActiveDialog(dialog);
  };

  // AI Moderation & Submission
  const [sending, setSending] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Smart AI Review Modal State
  const [aiReviewModal, setAiReviewModal] = useState<{ open: boolean; proposal: AiReviewProposal }>({
    open: false,
    proposal: { missingFields: [] }
  });

  // Formatted Output Text
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

  // Favorites Handlers
  const handleSaveFavorite = () => {
    if (!newFavName.trim()) return;
    const newFav: FavoriteItem = {
      id: Date.now().toString(),
      name: newFavName.trim(),
      time: selectedTime,
      location: locationName,
      areas: selectedAreas,
      audience: selectedAudience,
      organization: selectedOrganization,
      organizerName: organizerPersonName,
      activity: activityText,
      isRecurring,
      reminderTime: hasReminder ? reminderTime : ""
    };
    const updated = [newFav, ...favorites.slice(0, 9)];
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_named_favorites", JSON.stringify(updated));
    }
    setNewFavName("");
    setFavModalOpen(false);
    setToast(`Inbjudan sparades som favoriten "${newFav.name}"!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplyFavorite = (fav: FavoriteItem) => {
    setSelectedTime(fav.time || "");
    setLocationName(fav.location || "");
    setSelectedAreas(fav.areas || []);
    setSelectedAudience(fav.audience || ["Alla målgrupper"]);
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
    setToast(`Laddade in favoriten "${fav.name}"`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRemoveFavorite = (favId: string) => {
    const updated = favorites.filter(f => f.id !== favId);
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_named_favorites", JSON.stringify(updated));
    }
  };

  // Smart Pre-flight Submission Check
  const handleAttemptPublish = async () => {
    // 1. Check missing fields
    const missingFields: string[] = [];
    if (!activityText.trim()) missingFields.push("Beskrivning av aktivitet");
    if (!selectedTime.trim()) missingFields.push("Tid & datum");
    if (!locationName.trim()) missingFields.push("Mötesplats");
    if (!selectedOrganization.trim()) missingFields.push("Arrangör");
    if (!consentConfirmed) missingFields.push("Bekräftelse av personuppgiftsansvar");

    // 2. Check text for extractable details
    const extractedFromText: { time?: string; location?: string } = {};
    if (activityText) {
      const timeMatch = activityText.match(/(kl\.?\s*\d{1,2}(:\d{2})?|\d{1,2}:\d{2}|idag\s+kl\s*\d{1,2}|imorgon\s+kl\s*\d{1,2})/i);
      if (timeMatch && !selectedTime.trim()) {
        extractedFromText.time = timeMatch[0];
      }
      const locMatch = activityText.match(/(i\s+[A-ZÅÄÖa-zåäö]{3,}|på\s+[A-ZÅÄÖa-zåäö]{3,}|kapellet|kyrkan|slottsskogen)/i);
      if (locMatch && !locationName.trim()) {
        extractedFromText.location = locMatch[0];
      }
    }

    setSending(true);
    let reasonCopy = "";
    let hasPrivacyFlag = false;

    // Run AI check if activityText is present
    if (activityText.trim()) {
      try {
        const response = await fetch("/api/wash-announcement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: formattedText })
        });
        const data = await response.json();
        if (data.result?.hasPrivacyRisk || data.result?.hasInappropriateContent) {
          hasPrivacyFlag = true;
          reasonCopy = data.result.reason || "Inbjudan innehåller information som kan vara känslig eller behöver extra granskning.";
        }
      } catch (err) {
        console.error("AI Check error:", err);
      }
    }
    setSending(false);

    // If missing fields or privacy flags or extracted info exists -> show Smart AI Review Modal
    if (missingFields.length > 0 || hasPrivacyFlag || extractedFromText.time || extractedFromText.location) {
      setAiReviewModal({
        open: true,
        proposal: {
          missingFields,
          extractedFromText: (extractedFromText.time || extractedFromText.location) ? extractedFromText : undefined,
          reasonCopy,
          hasPrivacyFlag
        }
      });
      return;
    }

    // All clean & complete -> publish directly
    await executePublish();
  };

  const handleAutoFillExtracted = (extracted: { time?: string; location?: string }) => {
    if (extracted.time && !selectedTime) setSelectedTime(extracted.time);
    if (extracted.location && !locationName) setLocationName(extracted.location);
    setAiReviewModal({ open: false, proposal: { missingFields: [] } });
  };

  const executePublish = async () => {
    setSending(true);
    try {
      const response = await fetch("/api/sim/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "0700000000",
          body: `#WEBB\n${formattedText}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newProposal = {
          id: data.id || `prop-${Date.now()}`,
          category: selectedAudience[0] || "Vara en vän",
          area: selectedAreas.join(", ") || locationName || "Göteborg",
          locationName,
          time: selectedTime,
          scrubbedText: washAnnouncementText(activityText),
          responsibleParty: selectedOrganization + (organizerPersonName ? ` (${organizerPersonName})` : ""),
          createdAt: new Date().toISOString(),
          status: "pending"
        };
        if (typeof localStorage !== "undefined") {
          const stored = localStorage.getItem("my_pending_proposals");
          const list = stored ? JSON.parse(stored) : [];
          localStorage.setItem("my_pending_proposals", JSON.stringify([newProposal, ...list.filter((p: any) => p.id !== newProposal.id)]));
        }

        setToast("Din inbjudan har skickats in för granskning och publicering!");
        setTimeout(() => {
          setToast(null);
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        alert("Kunde inte publicera inbjudan. Försök igen.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Nätverksfel vid publicering.");
    } finally {
      setSending(false);
      setAiReviewModal({ open: false, proposal: { missingFields: [] } });
    }
  };

  return {
    favorites,
    favModalOpen,
    setFavModalOpen,
    newFavName,
    setNewFavName,
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
    activeDialog,
    setActiveDialog,
    tempLocation,
    setTempLocation,
    tempAreas,
    setTempAreas,
    tempAudience,
    setTempAudience,
    tempOrg,
    setTempOrg,
    tempActivity,
    setTempActivity,
    tempTime,
    setTempTime,
    showPersonNameModal,
    setShowPersonNameModal,
    openDialog,
    showQrSection,
    setShowQrSection,
    sending,
    toast,
    aiReviewModal,
    setAiReviewModal,
    handleAutoFillExtracted,
    formattedText,
    isFormValid,
    handleSaveFavorite,
    handleApplyFavorite,
    handleRemoveFavorite,
    handleAttemptPublish,
    executePublish
  };
}

