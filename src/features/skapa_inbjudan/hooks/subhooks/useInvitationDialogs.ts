// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Dialog Buffers Sub-Hook

import { useState } from "react";
import { ActiveDialogType } from "../../domain/types";

interface UseInvitationDialogsParams {
  selectedTime: string;
  locationName: string;
  activityText: string;
  selectedAreas: string[];
  selectedAudience: string[];
  selectedOrganization: string;
}

export function useInvitationDialogs({
  selectedTime,
  locationName,
  activityText,
  selectedAreas,
  selectedAudience,
  selectedOrganization
}: UseInvitationDialogsParams) {
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

  const openDialog = (dialog: ActiveDialogType) => {
    if (dialog === "time") setTempTime(selectedTime);
    if (dialog === "location") setTempLocation(locationName);
    if (dialog === "activity") setTempActivity(activityText);
    if (dialog === "area") setTempAreas(selectedAreas);
    if (dialog === "audience") setTempAudience(selectedAudience);
    if (dialog === "organization") setTempOrg(selectedOrganization);
    setActiveDialog(dialog);
  };

  return {
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
    showQrSection,
    setShowQrSection,
    openDialog
  };
}
