// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/anpassa/domain/schema.ts] - Executable Zod Schemas
import { z } from "zod";

export const OnboardingFormatSchema = z.enum(["physical", "telephone"]);
export type OnboardingFormat = z.infer<typeof OnboardingFormatSchema>;

export const OnboardingSavedTagsSchema = z.object({
  areas: z.array(z.string()).optional(),
  primaryArea: z.string().optional(),
  limitAreas: z.boolean().optional(),
  limitedAreas: z.array(z.string()).optional(),
  limitOrganizations: z.boolean().optional(),
  limitedOrganizations: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  organization: z.string().optional(),
  formats: z.array(OnboardingFormatSchema).optional(),
  alwaysNotify: z.boolean().optional(),
  spiritualTips: z.boolean().optional(),
  targetGroups: z.array(z.string()).optional(),
  allowDigital: z.boolean().optional()
});

export type OnboardingSavedTags = z.infer<typeof OnboardingSavedTagsSchema>;
