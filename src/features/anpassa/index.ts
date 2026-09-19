// [src/features/anpassa/index.ts] - Public API Barrier

export { default as OnboardingWizard } from "./OnboardingWizard";
export { default as SettingsTicker } from "./SettingsTicker";
export { default as Step1Geography } from "./Step1Geography";
export { default as Step2Language } from "./Step2Language";
export { default as Step3Organizations } from "./Step3Organizations";
export { default as Step4Formats } from "./Step4Formats";
export { useOnboardingState } from "./hooks/useOnboardingState";
export type { OnboardingStateSavedTags, UseOnboardingStateProps } from "./hooks/useOnboardingState";

export {
  OnboardingFormatSchema,
  OnboardingSavedTagsSchema
} from "./domain/schema";

export type {
  OnboardingFormat,
  OnboardingSavedTags
} from "./domain/schema";

export { MAP_DISTRICTS, GOTEBORG_AREAS, AREA_TO_DISTRICT_MAP, DISTRICT_NAME_MAPPING } from "./mapData";
export type { MapDistrict } from "./mapData";
