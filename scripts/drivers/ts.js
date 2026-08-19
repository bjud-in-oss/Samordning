/**
 * TYPESCRIPT & FSD DRIVRUTIN (v8.6)
 * Utför global AI-skanning, fasadvalidering, FSD-gränskontroller, TDD-kronologi och domänbegränsningar.
 */

import fs from 'fs';
import path from 'path';

export async function verifyTypeScriptCodebase({
  ROOT_DIR,
  SRC_DIR,
  t3c,
  ignoreMtime,
  logError,
  p4Path,
  t4
}) {
  const featuresDir = path.join(SRC_DIR, 'features');

  // 1. SAMLOKALISERAD DOKUMENTATION, FASADER OCH ZONER
  if (fs.existsSync(featuresDir)) {
    for (const domain of fs.readdirSync(featuresDir)) {
      const domainPath = path.join(featuresDir, domain);
      if (!fs.statSync(domainPath).isDirectory()) continue;

      const indexPath = path.join(domainPath, 'index.ts');
      if (fs.existsSync(indexPath)) {
        const clean = fs.readFileSync(indexPath, 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        const invalidLine = clean.split('\n').map(l => l.trim()).filter(Boolean).find(l => !/^(export|import)\b/.test(l));
        if (invalidLine) logError('FASAD-ÖVERTRÄDELSE (ADR-009)', `${path.relative(ROOT_DIR, indexPath)} har otillåten rad: "${invalidLine}"`);
      }

      // Validering av AI-Säkerhetszoner (Sanitizer får ej läcka globala API:er)
      const sanitizerPath = path.join(domainPath, 'domain', 'ai_zones', 'sanitizer.ts');
      if (fs.existsSync(sanitizerPath)) {
        const content = fs.readFileSync(sanitizerPath, 'utf-8');
        if (/\b(window|document|localStorage|sessionStorage|fetch)\b/.test(content)) {
          logError('SÄKERHETSZON-ÖVERTRÄDELSE', `${path.relative(ROOT_DIR, sanitizerPath)} läcker globala API:er.`);
        }
      }
    }
  }

  // 2. KÄLLKODS- OCH TDD-SKANNING (INKL GLOBAL AI-SKANNING OCH MAX 1 DOMÄN)
  if (fs.existsSync(SRC_DIR)) {
    let oldestTestTime = Infinity, oldestProdCodeTime = Infinity;
    let newestProdCodeTime = 0, newestTestTime = 0;
    const modifiedDomains = new Set();

    const scanSrc = (dir) => {
      for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanSrc(fullPath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const relPath = path.relative(SRC_DIR, fullPath);

          // Identifiera modifierade domäner efter 3c
          if (!ignoreMtime && stat.mtimeMs > t3c) {
            if (relPath.startsWith('features' + path.sep)) {
              const domName = relPath.split(path.sep)[1];
              if (domName) modifiedDomains.add(domName);
            }
          }

          if (!ignoreMtime && stat.mtimeMs <= t3c) {
            logError('SEKVENSFEL', `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" sparades FÖRE 3c.`);
          }

          // Global AI-Skanning: AI-anrop/moduler FÅR ENDAST finnas i domain/ai_zones/ eller server/
          const hasAiImport = /(@google\/genai|openai|fetch\(['"]\/api\/ai)/i.test(content);
          const isInsideAiZone = relPath.includes(`domain${path.sep}ai_zones`);
          const isServerCode = path.relative(ROOT_DIR, fullPath).startsWith('server');

          if (hasAiImport && !isInsideAiZone && !isServerCode) {
            logError('AI-ISOLERINGSÖVERTRÄDELSE', `${path.relative(ROOT_DIR, fullPath)} innehåller AI-anrop utanför domain/ai_zones/.`);
          }

          const isTest = file.includes('__tests__') || file.endsWith('.test.ts') || file.endsWith('.test.tsx');
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

          if (/(from\s+['"][^'"]*\/features\/[^/]+\/(components|hooks|api|domain|doc)\/|from\s+['"]\.\.\/\.\.\/)/.test(content)) {
            logError('FSD-ÖVERTRÄDELSE', `${path.relative(ROOT_DIR, fullPath)} importerar internt eller kliver bakåt.`);
          }
        }
      }
    };

    scanSrc(SRC_DIR);

    // Spärr mot fler än 1 domän per cykel
    if (modifiedDomains.size > 1) {
      logError('DOMÄNÖVERTRÄDELSE (MAX 1 DOMÄN)', `Ändringar upptäcktes i ${modifiedDomains.size} domäner samtidigt (${Array.from(modifiedDomains).join(', ')}). Dela upp i separata cykler.`);
    }

    // Spärr mot tom kodproduktion
    if (t4 > 0 && newestProdCodeTime <= t3c && newestTestTime <= t3c) {
      logError('TOM PRODUKTION', '4_producera.md skapades men inga källkods- eller testfiler i src/ har ändrats efter 3c.');
    }

    if (!ignoreMtime && oldestProdCodeTime !== Infinity && oldestTestTime !== Infinity && oldestTestTime > oldestProdCodeTime) {
      logError('TDD-ÖVERTRÄDELSE', 'Produktionskod påbörjades innan några enhetstester skapats.');
    }

    if (!ignoreMtime && t4 > 0 && t4 <= newestProdCodeTime) {
      logError('SEKVENSFEL', '4_producera.md sparades innan all källkod var färdigskriven.');
    }
  }
}