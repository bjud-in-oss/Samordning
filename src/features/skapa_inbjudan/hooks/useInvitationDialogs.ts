// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Dialog Buffers Sub-Hook

import { useState } from "react";
import { ActiveDialogType } from "../domain/types";

interface UseInvitationDialogsParams {
  selectedTime: string;
  locationName: string;
  activityText: string;
  selectedAreas: string[];
  selectedAudience: string[];
  selectedOrganization: string;
  organizerPersonName?: string;
  isRecurring?: boolean;
  hasReminder?: boolean;
  reminderTime?: string;
}

export function useInvitationDialogs({
  selectedTime,
  locationName,
  activityText,
  selectedAreas,
  selectedAudience,
  selectedOrganization,
  organizerPersonName = "",
  isRecurring = false,
  hasReminder = false,
  reminderTime = "1 timme innan"
}: UseInvitationDialogsParams) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialogType>(null);

  // Temporary dialog draft buffers
  const [tempLocation, setTempLocation] = useState<string>(locationName);
  const [tempAreas, setTempAreas] = useState<string[]>(selectedAreas);
  const [tempAudience, setTempAudience] = useState<string[]>(selectedAudience);
  const [tempOrg, setTempOrg] = useState<string>(selectedOrganization);
  const [tempPersonName, setTempPersonName] = useState<string>(organizerPersonName);
  const [tempActivity, setTempActivity] = useState<string>(activityText);
  const [tempTime, setTempTime] = useState<string>(selectedTime);
  const [tempIsRecurring, setTempIsRecurring] = useState<boolean>(isRecurring);
  const [tempHasReminder, setTempHasReminder] = useState<boolean>(hasReminder);
  const [tempReminderTime, setTempReminderTime] = useState<string>(reminderTime);
  const [showPersonNameModal, setShowPersonNameModal] = useState<boolean>(false);
  const [showQrSection, setShowQrSection] = useState<boolean>(false);

  const resetDialogBuffers = () => {
    setTempTime(selectedTime || "");
    setTempLocation(locationName || "");
    setTempActivity(activityText || "");
    setTempAreas(selectedAreas ? [...selectedAreas] : []);
    setTempAudience(selectedAudience ? [...selectedAudience] : []);
    setTempOrg(selectedOrganization || "");
    setTempPersonName(organizerPersonName || "");
    setTempIsRecurring(!!isRecurring);
    setTempHasReminder(!!hasReminder);
    setTempReminderTime(reminderTime || "1 timme innan");
    setShowPersonNameModal(false);
  };

  const openDialog = (dialog: ActiveDialogType) => {
    resetDialogBuffers();
    setActiveDialog(dialog);
  };

  const closeDialog = () => {
    resetDialogBuffers();
    setActiveDialog(null);
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
    tempPersonName,
    setTempPersonName,
    tempActivity,
    setTempActivity,
    tempTime,
    setTempTime,
    tempIsRecurring,
    setTempIsRecurring,
    tempHasReminder,
    setTempHasReminder,
    tempReminderTime,
    setTempReminderTime,
    showPersonNameModal,
    setShowPersonNameModal,
    showQrSection,
    setShowQrSection,
    openDialog,
    closeDialog,
    resetDialogBuffers
  };
}
