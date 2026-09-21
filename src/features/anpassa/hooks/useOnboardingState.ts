// [src/features/anpassa/hooks/useOnboardingState.ts] - Samlad tillståndshantering för anpassningsguiden och preferenser

import { useState, useEffect, useRef } from "react";
import { GOTEBORG_AREAS } from "../mapData";
import type { OnboardingSavedTags, OnboardingFormat } from "../domain/schema";

export type OnboardingStateSavedTags = OnboardingSavedTags;

export interface UseOnboardingStateProps {
  onSave: (tags: {
    areas: string[];
    primaryArea?: string;
    limitAreas?: boolean;
    limitedAreas?: string[];
    limitOrganizations?: boolean;
    limitedOrganizations?: string[];
    languages: string[];
    organization: string;
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
    targetGroups?: string[];
    allowDigital?: boolean;
  }) => void;
  savedTags?: OnboardingStateSavedTags;
}

export function useOnboardingState({ onSave, savedTags }: UseOnboardingStateProps) {
  const [primaryArea, setPrimaryArea] = useState<string | undefined>(savedTags?.primaryArea);
  const [limitAreas, setLimitAreas] = useState<boolean>(savedTags?.limitAreas ?? false);
  const [limitedAreas, setLimitedAreas] = useState<string[]>(savedTags?.limitedAreas || []);
  
  const [targetGroups, setTargetGroups] = useState<string[]>(
    savedTags?.targetGroups || ["all"]
  );

  const [formats, setFormats] = useState<("physical" | "telephone")[]>(
    savedTags?.formats || ["physical", "telephone"]
  );
  const [allowDigital, setAllowDigital] = useState<boolean>(
    savedTags?.allowDigital ?? true
  );
  const [spiritualTips, setSpiritualTips] = useState<boolean>(
    savedTags?.spiritualTips ?? true
  );

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    savedTags?.languages || ["Svenska"]
  );

  const [organization] = useState<string>(
    savedTags?.organization || ""
  );
  const [limitOrganizations] = useState<boolean>(
    savedTags?.limitOrganizations ?? false
  );
  const [limitedOrganizations] = useState<string[]>(
    savedTags?.limitedOrganizations || []
  );
  const [alwaysNotify] = useState<boolean>(
    savedTags?.alwaysNotify ?? true
  );

  const [showMoreSettings, setShowMoreSettings] = useState<boolean>(false);

  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    onSaveRef.current({
      areas: limitAreas
        ? primaryArea
          ? [primaryArea, ...limitedAreas.filter((a) => a !== primaryArea)]
          : limitedAreas
        : GOTEBORG_AREAS,
      primaryArea,
      limitAreas,
      limitedAreas,
      limitOrganizations,
      limitedOrganizations,
      languages: selectedLanguages,
      organization,
      formats,
      alwaysNotify,
      spiritualTips,
      targetGroups,
      allowDigital,
    });
  }, [
    primaryArea,
    limitAreas,
    limitedAreas,
    limitOrganizations,
    limitedOrganizations,
    selectedLanguages,
    organization,
    formats,
    alwaysNotify,
    spiritualTips,
    targetGroups,
    allowDigital,
  ]);

  const toggleTargetGroup = (groupId: string) => {
    setTargetGroups((prev) => {
      if (groupId === "all") {
        return ["all"];
      }
      const filtered = prev.filter((g) => g !== "all");
      if (filtered.includes(groupId)) {
        const next = filtered.filter((g) => g !== groupId);
        return next.length === 0 ? ["all"] : next;
      } else {
        return [...filtered, groupId];
      }
    });
  };

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(langCode) ? prev.filter((l) => l !== langCode) : [...prev, langCode]
    );
  };

  const toggleFormat = (format: "physical" | "telephone") => {
    setFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  return {
    primaryArea,
    setPrimaryArea,
    limitAreas,
    setLimitAreas,
    limitedAreas,
    setLimitedAreas,
    targetGroups,
    toggleTargetGroup,
    formats,
    toggleFormat,
    allowDigital,
    setAllowDigital,
    spiritualTips,
    setSpiritualTips,
    selectedLanguages,
    toggleLanguage,
    organization,
    limitOrganizations,
    limitedOrganizations,
    alwaysNotify,
    showMoreSettings,
    setShowMoreSettings,
  };
}
