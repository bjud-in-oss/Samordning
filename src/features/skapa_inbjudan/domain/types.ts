// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Domain Types

import { UiLanguage } from "../../mission_router/translations";

export type ActiveDialogType = "time" | "location" | "activity" | "area" | "audience" | "organization" | null;

export interface AiReviewProposal {
  missingFields: string[];
  extractedFromText?: {
    time?: string;
    location?: string;
  };
  organizerNotice?: string;
  reasonCopy?: string;
  hasPrivacyFlag?: boolean;
}

export interface FavoriteItem {
  id: string;
  name: string;
  time: string;
  location: string;
  areas: string[];
  audience: string[];
  organization: string;
  organizerName: string;
  activity: string;
  isRecurring: boolean;
  reminderTime: string;
}

export interface CreateInvitationFormProps {
  uiLanguage: UiLanguage;
  savedTags?: any;
  isAdmin?: boolean;
  onBack?: () => void;
  onSuccess?: () => void;
}

