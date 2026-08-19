/**
 * RUST & CARGO DRIVRUTIN (v8.6)
 * Hanterar Rust-crates, mod.rs/lib.rs-fasader, cargo test-kronologi, AI-zoner och domänisolering.
 */

import fs from 'fs';
import path from 'path';

export async function verifyCodebase({
  ROOT_DIR,
  SRC_DIR,
  t3c,
  ignoreMtime,
  logError,
  p4Path,
  t4
}) {
  const featuresDir = path.join(SRC_DIR, 'features');

  // 1. MODULYTOR OCH FASADER (mod.rs / lib.rs)
  if (fs.existsSync(featuresDir)) {
    for (const domain of fs.readdirSync(featuresDir)) {
      const domainPath = path.join(featuresDir, domain);
      if (!fs.statSync(domainPath).isDirectory()) continue;

      const modPath = path.join(domainPath, 'mod.rs');
      if (fs.existsSync(modPath)) {
        const clean = fs.readFileSync(modPath, 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        const invalidLine = clean.split('\n').map(l => l.trim()).filter(Boolean).find(l => !/^(pub\s+use|pub\s+mod|use)\b/.test(l));
        if (invalidLine) {
          logError('FASAD-ÖVERTRÄDELSE (ADR-009)', `${path.relative(ROOT_DIR, modPath)} har otillåten rad: "${invalidLine}"`);
        }
      }

      // Validering av AI-Säkerhetszoner för Rust (sanitizer.rs får ej läcka I/O, std::fs, std::net)
      const sanitizerPath = path.join(domainPath, 'domain', 'ai_zones', 'sanitizer.rs');
      if (fs.existsSync(sanitizerPath)) {
        const content = fs.readFileSync(sanitizerPath, 'utf-8');
        if (/\b(std::fs|std::net|reqwest|tokio::net)\b/.test(content)) {
          logError('SÄKERHETSZON-ÖVERTRÄDELSE', `${path.relative(ROOT_DIR, sanitizerPath)} läcker I/O eller nätverksåtkomst.`);
        }
      }
    }
  }

  // 2. KÄLLKODS- OCH CARGO TEST-SKANNING
  if (fs.existsSync(SRC_DIR)) {
    let oldestTestTime = Infinity, oldestProdCodeTime = Infinity;
    let newestProdCodeTime = 0, newestTestTime = 0;
    const modifiedDomains = new Set();

    const scanRs = (dir) => {
      for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (['target'].includes(file)) continue;
          scanRs(fullPath);
        } else if (file.endsWith('.rs')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const relPath = path.relative(SRC_DIR, fullPath);

          if (!ignoreMtime && stat.mtimeMs > t3c) {
            if (relPath.startsWith('features' + path.sep)) {
              const domName = relPath.split(path.sep)[1];
              if (domName) modifiedDomains.add(domName);
            }
          }

          if (!ignoreMtime && stat.mtimeMs <= t3c) {
            logError('SEKVENSFEL', `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" sparades FÖRE 3c.`);
          }

          // Global AI-Skanning för Rust
          const hasAiImport = /(async_openai|rig_core|llm|reqwest::Client)/i.test(content);
          const isInsideAiZone = relPath.includes(`domain${path.sep}ai_zones`);
          const isServerCode = relPath.startsWith('server') || relPath.startsWith('bin');

          if (hasAiImport && !isInsideAiZone && !isServerCode) {
            logError('AI-ISOLERINGSÖVERTRÄDELSE', `${path.relative(ROOT_DIR, fullPath)} innehåller AI-anrop utanför domain/ai_zones/.`);
          }

          const isTest = content.includes('#[cfg(test)]') || content.includes('#[test]') || relPath.includes('tests' + path.sep);
          if (isTest) {
            if (stat.mtimeMs < oldestTestTime) oldestTestTime = stat.mtimeMs;
            if (stat.mtimeMs > newestTestTime) newestTestTime = stat.mtimeMs;
          } else {
            if (stat.mtimeMs < oldestProdCodeTime) oldestProdCodeTime = stat.mtimeMs;
            if (stat.mtimeMs > newestProdCodeTime) newestProdCodeTime = stat.mtimeMs;
          }

          if (content.split('\n').length > 250) {
            logError('STORLEKSGRÄNS ÖVERSKRIDEN', `${path.relative(ROOT_DIR, fullPath)} överstiger 250 rader.`);
          }
        }
      }
    };

    scanRs(SRC_DIR);

    if (modifiedDomains.size > 1) {
      logError('DOMÄNÖVERTRÄDELSE (MAX 1 DOMÄN)', `Ändringar upptäcktes i ${modifiedDomains.size} domäner samtidigt (${Array.from(modifiedDomains).join(', ')}). Dela upp i separata cykler.`);
    }

    if (t4 > 0 && newestProdCodeTime <= t3c && newestTestTime <= t3c) {
      logError('TOM PRODUKTION', '4_producera.md skapades men inga .rs- eller testfiler i src/ har ändrats efter 3c.');
    }

    if (!ignoreMtime && oldestProdCodeTime !== Infinity && oldestTestTime !== Infinity && oldestTestTime > oldestProdCodeTime) {
      logError('TDD-ÖVERTRÄDELSE', 'Produktionskod påbörjades innan några Rust-enhetstester skapats.');
    }

    if (!ignoreMtime && t4 > 0 && t4 <= newestProdCodeTime) {
      logError('SEKVENSFEL', '4_producera.md sparades innan all Rust-kod var färdigskriven.');
    }
  }
}