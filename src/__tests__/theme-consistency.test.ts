import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

function getAllTsxFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTsxFiles(filePath));
    } else if (file.endsWith(".tsx")) {
      results.push(filePath);
    }
  }
  return results;
}

describe("CSS Theme Consistency & Regression Guard", () => {
  it("säkerställer att src/index.css definierar alla centrala färgvariabler och teman på :root", () => {
    const cssPath = path.join(process.cwd(), "src", "index.css");
    expect(fs.existsSync(cssPath)).toBe(true);
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    // Kontrollera centrala basvariabler
    expect(cssContent).toContain("--color-primary");
    expect(cssContent).toContain("--color-secondary");
    expect(cssContent).toContain("--color-bg");
    expect(cssContent).toContain("--color-text");
    expect(cssContent).toContain("--color-paper");

    // Kontrollera knappar, flöde och modaler
    expect(cssContent).toContain("--color-btn-invite-bg");
    expect(cssContent).toContain("--color-btn-invite-text");
    expect(cssContent).toContain("--color-modal-bg");
    expect(cssContent).toContain("--color-modal-overlay");
    expect(cssContent).toContain("--color-stream-card-bg");
    expect(cssContent).toContain("--color-stream-card-border");

    // Kontrollera definierade dynamiska teman
    expect(cssContent).toContain('[data-theme="default"]');
    expect(cssContent).toContain('[data-theme="high-contrast"]');
    expect(cssContent).toContain('[data-theme="autumn"]');
    expect(cssContent).toContain('[data-theme="spring"]');
    expect(cssContent).toContain('[data-theme="winter"]');
  });

  it("förhindrar hårdkodade Tailwind-färgklasser (emerald, teal, green, raw hex) i alla komponenter", () => {
    const srcDir = path.join(process.cwd(), "src");
    const tsxFiles = getAllTsxFiles(srcDir).filter(
      (f) => !f.includes("ThemeSelectorSection.tsx") // Exkludera färgprovsdefinitioner
    );

    const bannedColorPatterns = [
      /\b(bg|text|border|ring)-(emerald|teal|green)-[0-9]{2,3}\b/,
      /\b(bg|text|border)-\[#(?:[0-9a-fA-F]{3,6})\]\b/,
    ];

    const violations: { file: string; line: number; match: string }[] = [];

    for (const filePath of tsxFiles) {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        for (const pattern of bannedColorPatterns) {
          const match = line.match(pattern);
          if (match) {
            violations.push({
              file: path.relative(process.cwd(), filePath),
              line: index + 1,
              match: match[0],
            });
          }
        }
      });
    }

    expect(
      violations,
      `Följande komponenter innehåller otillåtna hårdkodade färgklasser:\n${violations
        .map((v) => `  - ${v.file}:${v.line} -> ${v.match}`)
        .join("\n")}`
    ).toEqual([]);
  });
});
