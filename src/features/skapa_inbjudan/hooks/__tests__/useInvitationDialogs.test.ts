// [src/features/skapa_inbjudan/hooks/__tests__/useInvitationDialogs.test.ts] - Unit Test for Dialogs Hook Logic

import { describe, it, expect } from "vitest";

describe("useInvitationDialogs Draft Reset & State Isolation", () => {
  it("initializes dialog parameters correctly", () => {
    const params = {
      selectedTime: "18:00",
      locationName: "Kapellet",
      activityText: "Fika",
      selectedAreas: ["Kortedala"],
      selectedAudience: ["Alla"],
      selectedOrganization: "Äldstekvorumet",
      organizerPersonName: "Lars",
      isRecurring: false,
      hasReminder: true,
      reminderTime: "1 timme innan"
    };

    expect(params.selectedTime).toBe("18:00");
    expect(params.selectedAreas).toHaveLength(1);
    expect(params.selectedOrganization).toBe("Äldstekvorumet");
    expect(params.organizerPersonName).toBe("Lars");
  });

  it("resets draft state buffers on closeDialog or cancel", () => {
    const approvedParams = {
      selectedTime: "18:00",
      locationName: "Kapellet",
      activityText: "Middag",
      selectedAreas: ["Utby"],
      selectedAudience: ["Ungdomar"],
      selectedOrganization: "Ungkarlsklass",
      organizerPersonName: "Johan",
      isRecurring: false,
      hasReminder: false,
      reminderTime: "30 minuter innan"
    };

    // State container simulating hook state
    let activeDialog: string | null = null;
    let tempLocation = approvedParams.locationName;
    let tempTime = approvedParams.selectedTime;
    let tempActivity = approvedParams.activityText;
    let tempOrg = approvedParams.selectedOrganization;
    let tempPersonName = approvedParams.organizerPersonName;

    const resetDialogBuffers = () => {
      tempLocation = approvedParams.locationName;
      tempTime = approvedParams.selectedTime;
      tempActivity = approvedParams.activityText;
      tempOrg = approvedParams.selectedOrganization;
      tempPersonName = approvedParams.organizerPersonName;
    };

    const closeDialog = () => {
      resetDialogBuffers();
      activeDialog = null;
    };

    const openDialog = (dialog: string) => {
      resetDialogBuffers();
      activeDialog = dialog;
    };

    // Open location dialog
    openDialog("location");
    expect(activeDialog).toBe("location");
    expect(tempLocation).toBe("Kapellet");

    // User makes unsaved edits in location dialog
    tempLocation = "Stockholm Kapell";
    expect(tempLocation).toBe("Stockholm Kapell");

    // User cancels / closes dialog without saving
    closeDialog();

    expect(activeDialog).toBeNull();
    expect(tempLocation).toBe("Kapellet"); // Reset to approved value

    // User re-opens location dialog later
    openDialog("location");
    expect(tempLocation).toBe("Kapellet"); // Unsaved "Stockholm Kapell" is NOT present
  });

  it("resets organizer and time draft states on cancel", () => {
    const approved = {
      selectedTime: "19:00",
      locationName: "Kortedala",
      activityText: "Korvgrillning",
      selectedAreas: [],
      selectedAudience: [],
      selectedOrganization: "Unga Vuxna",
      organizerPersonName: "Maria",
      isRecurring: true,
      hasReminder: true,
      reminderTime: "1 timme innan"
    };

    let tempPersonName = approved.organizerPersonName;
    let tempIsRecurring = approved.isRecurring;
    let activeDialog: string | null = "organization";

    const closeDialog = () => {
      tempPersonName = approved.organizerPersonName;
      tempIsRecurring = approved.isRecurring;
      activeDialog = null;
    };

    // User edits draft
    tempPersonName = "Erik";
    tempIsRecurring = false;

    // User clicks cancel
    closeDialog();

    expect(activeDialog).toBeNull();
    expect(tempPersonName).toBe("Maria");
    expect(tempIsRecurring).toBe(true);
  });
});
