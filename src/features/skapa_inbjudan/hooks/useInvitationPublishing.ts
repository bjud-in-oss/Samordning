// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Publishing & Pre-flight Sub-Hook

import { useState } from "react";
import { AiReviewProposal } from "../domain/types";
import { sendSimulatedSms, checkAnnouncementContent } from "../domain/publishService";
import { washAnnouncementText } from "@/src/features/mission_router";

interface UseInvitationPublishingParams {
  activityText: string;
  selectedTime: string;
  locationName: string;
  selectedOrganization: string;
  organizerPersonName: string;
  consentConfirmed: boolean;
  formattedText: string;
  selectedAudience: string[];
  selectedAreas: string[];
  setSelectedTime: (time: string) => void;
  setLocationName: (location: string) => void;
  showToast: (msg: string, duration?: number) => void;
  isAdmin?: boolean;
  onSuccess?: () => void;
}

export function useInvitationPublishing({
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
  isAdmin = false,
  onSuccess
}: UseInvitationPublishingParams) {
  const [sending, setSending] = useState<boolean>(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState<boolean>(false);

  // Smart AI Review Modal State
  const [aiReviewModal, setAiReviewModal] = useState<{ open: boolean; proposal: AiReviewProposal }>({
    open: false,
    proposal: { missingFields: [] }
  });

  const handleAttemptPublish = async () => {
    // 1. Check missing fields
    const missingFields: string[] = [];
    if (!activityText.trim()) missingFields.push("Beskrivning av aktivitet");
    if (!selectedTime.trim()) missingFields.push("Tid & datum");
    if (!locationName.trim()) missingFields.push("Mötesplats");
    if (!selectedOrganization.trim()) missingFields.push("Arrangör");
    if (!consentConfirmed) missingFields.push("Bekräftelse av personuppgiftsansvar");

    // If consent is missing, don't even proceed to AI
    if (!consentConfirmed) {
      showToast("Vänligen bekräfta integritetsvillkoren för att fortsätta.", 2500);
      return;
    }

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

    // 3. Organizer clarity & trust checks
    let organizerNotice = "";
    const isIndividualOrg = selectedOrganization.toLowerCase().includes("enskild") || selectedOrganization.toLowerCase().includes("familj");
    if (isIndividualOrg && !organizerPersonName.trim()) {
      organizerNotice = "När arrangören är satt till Enskild/Familj är det viktigt att det framgår vem som håller i aktiviteten (fyll gärna i personnamn eller familjenamn under Arrangör) för att arrangemanget ska kännas tryggt och kunna publiceras.";
    }

    if (activityText) {
      const phoneMatch = activityText.match(/(?:07\d[\d\s-]{6,10}|\+46\d[\d\s-]{6,10})/);
      const emailMatch = activityText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
      const contactNameMatch = activityText.match(/(?:kontakt|ring|smsa|hos|med|ansvarig|frågor till|fråga|arrangör)\s+([A-ZÅÄÖa-zåäö]{2,}(?:\s+[A-ZÅÄÖa-zåäö]{2,})?)/i);

      if (phoneMatch || emailMatch || contactNameMatch) {
        const detectedDetail = phoneMatch?.[0] || emailMatch?.[0] || contactNameMatch?.[0];
        const contactMsg = `Kontaktuppgifter eller ett personnamn upptäcktes i beskrivningen ("${detectedDetail}"). Är denna person egentligen arrangör för aktiviteten? Tänk på att detta även behöver framgå under fältet Arrangör och inte enbart i beskrivningstexten.`;
        organizerNotice = organizerNotice ? `${organizerNotice}\n\n${contactMsg}` : contactMsg;
      }
    }

    setSending(true);
    let reasonCopy = "";
    let hasPrivacyFlag = false;

    // Run AI check if activityText is present
    if (activityText.trim()) {
      const data = await checkAnnouncementContent(formattedText);
      if (data?.result?.hasPrivacyRisk || data?.result?.hasInappropriateContent) {
        hasPrivacyFlag = true;
        reasonCopy = data.result.reason || "Inbjudan innehåller information som kan vara känslig eller behöver extra granskning.";
      }
    }
    setSending(false);

    // If missing fields or privacy flags or extracted info or organizer notice exists -> show Smart Review Modal
    if (missingFields.length > 0 || hasPrivacyFlag || extractedFromText.time || extractedFromText.location || Boolean(organizerNotice)) {
      setAiReviewModal({
        open: true,
        proposal: {
          missingFields,
          extractedFromText: (extractedFromText.time || extractedFromText.location) ? extractedFromText : undefined,
          organizerNotice: organizerNotice || undefined,
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
      // If admin, send with admin sender so backend auto-approves
      const senderNumber = isAdmin ? "0736108997" : "0700000000";
      const { success, id } = await sendSimulatedSms(`#WEBB\n${formattedText}`, senderNumber);

      if (success) {
        const newProposal = {
          id: id || `prop-${Date.now()}`,
          category: selectedAudience[0] || "Vara en vän",
          area: selectedAreas.join(", ") || locationName || "",
          locationName,
          time: selectedTime,
          scrubbedText: washAnnouncementText(activityText),
          responsibleParty: selectedOrganization + (organizerPersonName ? ` (${organizerPersonName})` : ""),
          createdAt: new Date().toISOString(),
          status: isAdmin ? "active" : "pending"
        };
        if (typeof localStorage !== "undefined") {
          const stored = localStorage.getItem("my_pending_proposals");
          const list: Array<{ id: string }> = stored ? JSON.parse(stored) : [];
          localStorage.setItem("my_pending_proposals", JSON.stringify([newProposal, ...list.filter(p => p.id !== newProposal.id)]));
        }

        if (isAdmin) {
          showToast("Inbjudan publicerades direkt i anslagsflödet!", 1500);
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 600);
        } else {
          setSubmittedSuccessfully(true);
        }
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
    sending,
    submittedSuccessfully,
    setSubmittedSuccessfully,
    aiReviewModal,
    setAiReviewModal,
    handleAttemptPublish,
    handleAutoFillExtracted,
    executePublish
  };
}
