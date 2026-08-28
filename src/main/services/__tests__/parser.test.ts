// [src/main/services/__tests__/parser.test.ts] - Unit Tests for Parser & Geocoding Service
import { describe, it, expect } from "vitest";
import { 
  washAnnouncementText, 
  calculateSecondsUntilTime, 
  findClosestDistrict, 
  parseMissionaryMessage, 
  isApprovedSender, 
  runFallbackWash 
} from "../parser";

describe("Parser & Geocoding Service", () => {
  it("washAnnouncementText removes parenthetical text and trims lines", () => {
    const raw = "Middag hos oss (ta med dessert)\n [.?] \nVälkomna!";
    const cleaned = washAnnouncementText(raw);
    expect(cleaned).toBe("Middag hos oss\nVälkomna!");
  });

  it("isApprovedSender correctly validates trusted emails", () => {
    expect(isApprovedSender("biskop@goteseb.se")).toBe(true);
    expect(isApprovedSender("random@example.com")).toBe(false);
  });

  it("findClosestDistrict maps lat/lng to nearest Gothenburg district", () => {
    const district = findClosestDistrict(57.7958, 12.0432);
    expect(district).toBe("Angered");
  });

  it("calculateSecondsUntilTime returns valid duration", () => {
    const seconds = calculateSecondsUntilTime("23:59");
    expect(seconds).toBeGreaterThan(0);
    expect(seconds).toBeLessThanOrEqual(86400);
  });

  it("parseMissionaryMessage extracts brackets correctly", () => {
    const text = "Behov: [Angered] [18:00] [Broder] [Svenska]";
    const result = parseMissionaryMessage(text);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.locationName).toBe("Angered");
      expect(result.time).toBe("18:00");
      expect(result.gender).toBe("Broder");
      expect(result.language).toBe("Svenska");
      expect(result.resolvedArea).toBe("Angered");
    }
  });

  it("runFallbackWash extracts metadata and warnings", () => {
    const text = "Vi vill erbjuda lektion i Kortedala kl 19:00 för intresserad på svenska";
    const result = runFallbackWash(text);
    expect(result.extractedMetadata.category).toBe("Få näring av Guds ord");
    expect(result.extractedMetadata.area).toBe("Kortedala");
    expect(result.extractedMetadata.time).toBe("19:00");
    expect(result.extractedMetadata.language).toBe("Svenska");
    expect(result.warnings.missingAreaForTeaching).toBe(false);
  });
});
