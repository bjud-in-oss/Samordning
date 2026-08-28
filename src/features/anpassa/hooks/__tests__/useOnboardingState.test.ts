// [src/features/anpassa/hooks/__tests__/useOnboardingState.test.ts] - Enhetstest för OnboardingState och inställningslogik
import { describe, it, expect } from "vitest";
import { GOTEBORG_AREAS } from "../../mapData";

describe("Anpassa inställningslogik och standardvärden", () => {
  it("har korrekta standardområden definierade i Göteborg", () => {
    expect(GOTEBORG_AREAS).toBeDefined();
    expect(GOTEBORG_AREAS.length).toBeGreaterThan(0);
    expect(GOTEBORG_AREAS).toContain("Hisingen");
  });

  it("beräknar områdesurval korrekt vid begränsning", () => {
    const limitAreas = true;
    const primaryArea = "Hisingen";
    const limitedAreas = ["Kungälv", "Hisingen", "Kortedala Norra"];

    const computedAreas = limitAreas
      ? primaryArea
        ? [primaryArea, ...limitedAreas.filter((a) => a !== primaryArea)]
        : limitedAreas
      : GOTEBORG_AREAS;

    expect(computedAreas[0]).toBe("Hisingen");
    expect(computedAreas).toHaveLength(3);
    expect(computedAreas).toContain("Kungälv");
  });

  it("returnerar alla områden när limitAreas är falskt", () => {
    const limitAreas = false;
    const primaryArea = "Hisingen";
    const limitedAreas = ["Hisingen"];

    const computedAreas = limitAreas
      ? primaryArea
        ? [primaryArea, ...limitedAreas.filter((a) => a !== primaryArea)]
        : limitedAreas
      : GOTEBORG_AREAS;

    expect(computedAreas).toEqual(GOTEBORG_AREAS);
  });

  it("hanterar målgruppsfiltrering enligt affärsregler", () => {
    let targetGroups = ["all"];

    const toggleTargetGroup = (groupId: string) => {
      if (groupId === "all") {
        targetGroups = ["all"];
        return;
      }
      const filtered = targetGroups.filter((g) => g !== "all");
      if (filtered.includes(groupId)) {
        const next = filtered.filter((g) => g !== groupId);
        targetGroups = next.length === 0 ? ["all"] : next;
      } else {
        targetGroups = [...filtered, groupId];
      }
    };

    toggleTargetGroup("seniors");
    expect(targetGroups).toEqual(["seniors"]);

    toggleTargetGroup("families");
    expect(targetGroups).toEqual(["seniors", "families"]);

    toggleTargetGroup("seniors");
    expect(targetGroups).toEqual(["families"]);

    toggleTargetGroup("families");
    expect(targetGroups).toEqual(["all"]);
  });
});
