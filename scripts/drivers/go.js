/**
 * GO & GO-MODULES DRIVRUTIN (v8.6)
 * Hanterar Go-paket, paketytor (doc.go), go test-kronologi, AI-zoner och domänisolering.
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
  // Stöd för både pkg/ och src/ struktur i Go-projekt
  const targetDir = fs.existsSync(path.join(ROOT_DIR, 'pkg')) 
    ? path.join(ROOT_DIR, 'pkg') 
    : SRC_DIR;

  const featuresDir = path.join(targetDir, 'features');

  // 1. VALIDERAT AI-SÄKERHETSZONER FÖR GO
  if (fs.existsSync(featuresDir)) {
    for (const domain of fs.readdirSync(featuresDir)) {
      const domainPath = path.join(featuresDir, domain);
      if (!fs.statSync(domainPath).isDirectory()) continue;

      const sanitizerPath = path.join(domainPath, 'domain', 'ai_zones', 'sanitizer.go');
      if (fs.existsSync(sanitizerPath)) {
        const content = fs.readFileSync(sanitizerPath, 'utf-8');
        if (/\b(net\/http|os|sys|io\/ioutil)\b/.test(content)) {
          logError('SÄKERHETSZON-ÖVERTRÄDELSE', `${path.relative(ROOT_DIR, sanitizerPath)} läcker I/O eller nätverks-paket.`);
        }
      }
    }
  }

  // 2. KÄLLKODS- OCH GO TEST-SKANNING
  if (fs.existsSync(targetDir)) {
    let oldestTestTime = Infinity, oldestProdCodeTime = Infinity;
    let newestProdCodeTime = 0, newestTestTime = 0;
    const modifiedDomains = new Set();

    const scanGo = (dir) => {
      for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (['vendor'].includes(file)) continue;
          scanGo(fullPath);
        } else if (file.endsWith('.go')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const relPath = path.relative(targetDir, fullPath);

          if (!ignoreMtime && stat.mtimeMs > t3c) {
            if (relPath.startsWith('features' + path.sep)) {
              const domName = relPath.split(path.sep)[1];
              if (domName) modifiedDomains.add(domName);
            }
          }

          if (!ignoreMtime && stat.mtimeMs <= t3c) {
            logError('SEKVENSFEL', `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" sparades FÖRE 3c.`);
          }

          // Global AI-skanning för Go
          const hasAiImport = /(google\.golang\.org\/genai|github\.com\/sashabaranov\/go-openai|github\.com\/tmc\/langchaingo)/i.test(content);
          const isInsideAiZone = relPath.includes(`domain${path.sep}ai_zones`);
          const isServerCode = relPath.startsWith('cmd') || relPath.startsWith('server');

          if (hasAiImport && !isInsideAiZone && !isServerCode) {
            logError('AI-ISOLERINGSÖVERTRÄDELSE', `${path.relative(ROOT_DIR, fullPath)} innehåller AI-anrop utanför domain/ai_zones/.`);
          }

          const isTest = file.endsWith('_test.go') || relPath.includes('tests' + path.sep);
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

    scanGo(targetDir);

    if (modifiedDomains.size > 1) {
      logError('DOMÄNÖVERTRÄDELSE (MAX 1 DOMÄN)', `Ändringar upptäcktes i ${modifiedDomains.size} domäner samtidigt (${Array.from(modifiedDomains).join(', ')}). Dela upp i separata cykler.`);
    }

    if (t4 > 0 && newestProdCodeTime <= t3c && newestTestTime <= t3c) {
      logError('TOM PRODUKTION', '4_producera.md skapades men inga .go- eller testfiler har ändrats efter 3c.');
    }

    if (!ignoreMtime && oldestProdCodeTime !== Infinity && oldestTestTime !== Infinity && oldestTestTime > oldestProdCodeTime) {
      logError('TDD-ÖVERTRÄDELSE', 'Produktionskod påbörjades innan några Go-enhetstester (_test.go) skapats.');
    }

    if (!ignoreMtime && t4 > 0 && t4 <= newestProdCodeTime) {
      logError('SEKVENSFEL', '4_producera.md sparades innan all Go-kod var färdigskriven.');
    }
  }
}