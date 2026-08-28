// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/inbjudningar/domain/schema.ts] - Executable Zod Schemas
import { z } from "zod";

export const SavedFilterTagsSchema = z.object({
  limitAreas: z.boolean().optional(),
  limitedAreas: z.array(z.string()).optional(),
  primaryArea: z.string().optional(),
  enabledCategories: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  organizations: z.array(z.string()).optional()
});

export type SavedFilterTags = z.infer<typeof SavedFilterTagsSchema>;

export const ModerationActionSchema = z.enum(["approve", "reject", "edit"]);
export type ModerationAction = z.infer<typeof ModerationActionSchema>;
