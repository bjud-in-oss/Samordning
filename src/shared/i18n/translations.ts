// [src/shared/i18n/translations.ts] - Shared Multi-Language Translations Index

import { dictSv } from "./dict_sv";
import { dictEn } from "./dict_en";
import { dictEs, dictSw, dictVi } from "./dict_other";

export type UiLanguage = "sv" | "en" | "es" | "sw" | "vi";

export interface TranslationDict {
  gatewayTitle: string;
  gatewaySubtitle: string;
  gatewayPrompt: string;
  introScreenText: string;
  introScreenBtn: string;
  introScreenBtnOk: string;
  introScreenBtnCustomize: string;
  
  // OnboardingForm
  onboardingHeader: string;
  onboardingSubtitle: string;
  onboardingIntro: string;
  customizeChoicesBtn: string;
  
  // Step 1: Plats och närområde
  step1Title: string;
  step1Subtitle: string;
  
  // Step 2: Språkstöd
  step2Title: string;
  step2Subtitle: string;

  // Step 3: Grupptillhörighet
  step3Title: string;
  step3Subtitle: string;
  
  // Step 4: Format
  step4Title: string;
  step4Subtitle: string;
  
  formatPhysicalTitle: string;
  formatPhysicalDesc: string;
  formatDigitalTitle: string;
  formatDigitalDesc: string;
  formatSpiritualTitle: string;
  formatSpiritualDesc: string;

  orgChoiceLabel: string;
  orgBror: string;
  orgSyster: string;

  iosTipHeader: string;
  iosTipBody: string;
  pushHeader: string;
  pushSubtitle: string;
  pushBtnActive: string;
  pushBtnInactive: string;
  saveBtn: string;
  saveFeedback: string;

  // AlertDetail
  alertDetailTitle: string;
  loadingInfo: string;
  successTitle: string;
  successDeliveredTitle: string;
  successDeliveredDesc: string;
  successClosedTitle: string;
  successClosedDesc: string;
  inactiveTitle: string;
  inactiveDesc: string;
  backToHome: string;
  backBtn: string;
  activeRequest: string;
  approxLocation: string;
  timeLabel: string;
  participantsLabel: string;
  languageLabel: string;
  privacyNotice: string;
  respondTitle: string;
  respondSubtitle: string;
  quickReply1: string;
  quickReply2: string;
  quickReply3: string;
  quickReply4: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendResponseBtn: string;
  sendingText: string;
  footerNotice: string;

  // New keys for tabs and status bar
  tabInvitations: string;
  tabCreateInvitation: string;
  tabCustomize: string;
  primaryAreaLabel: string;
  noAreaSelected: string;
  showingCount: string;
  bulletinBoardStatus: string;
  realtimeSynced: string;
  syncingText: string;
  syncSynced: string;
  syncSyncing: string;

  // Intro & Disclaimer
  introHeading: string;
  introShortText: string;
  introFullText: string;
  readMoreBtn: string;
  readLessBtn: string;
  disclaimerText: string;
}

export const TRANSLATIONS: Record<UiLanguage, TranslationDict> = {
  sv: dictSv,
  en: dictEn,
  es: dictEs,
  sw: dictSw,
  vi: dictVi
};
