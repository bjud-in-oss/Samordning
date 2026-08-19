/**
 * PYTHON & FASTAPI/FLASK DRIVRUTIN (v8.6)
 * Hanterar Python-paket, __init__.py-fasader, TDD-kronologi (pytest), AI-zoner och domänisolering.
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
  // Stöd för både src/ och app/ struktur i Python-projekt
  const targetDir = fs.existsSync(path.join(ROOT_DIR, 'app')) 
    ? path.join(ROOT_DIR, 'app') 
    : SRC_DIR;

  const featuresDir = path.join(targetDir, 'features');

  // 1. MODULYTOR OCH PAKETFASADER (__init__.py)
  if (fs.existsSync(featuresDir)) {
    for (const domain of fs.readdirSync(featuresDir)) {
      const domainPath = path.join(featuresDir, domain);
      if (!fs.statSync(domainPath).isDirectory()) continue;

      const initPath = path.join(domainPath, '__init__.py');
      if (fs.existsSync(initPath)) {
        const clean = fs.readFileSync(initPath, 'utf-8').replace(/#.*/g, '').trim();
        const invalidLine = clean.split('\n').map(l => l.trim()).filter(Boolean).find(l => !/^(from|import|__all__)\b/.test(l));
        if (invalidLine) {
          logError('FASAD-ÖVERTRÄDELSE (ADR-009)', `${path.relative(ROOT_DIR, initPath)} har otillåten rad: "${invalidLine}"`);
        }
      }

      // Validering av AI-Säkerhetszoner för Python (sanitizer.py får ej läcka I/O eller miljövariabler)
      const sanitizerPath = path.join(domainPath, 'domain', 'ai_zones', 'sanitizer.py');
      if (fs.existsSync(sanitizerPath)) {
        const content = fs.readFileSync(sanitizerPath, 'utf-8');
        if (/\b(requests|httpx|urllib|os\.environ|sys|socket)\b/.test(content)) {
          logError('SÄKERHETSZON-ÖVERTRÄDELSE', `${path.relative(ROOT_DIR, sanitizerPath)} läcker I/O eller miljöåtkomst.`);
        }
      }
    }
  }

  // 2. KÄLLKODS- OCH PYTEST-SKANNING
  if (fs.existsSync(targetDir)) {
    let oldestTestTime = Infinity, oldestProdCodeTime = Infinity;
    let newestProdCodeTime = 0, newestTestTime = 0;
    const modifiedDomains = new Set();

    const scanPy = (dir) => {
      for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Hoppa över virtualenvs och pycache
          if (['.venv', 'venv', '__pycache__', '.pytest_cache'].includes(file)) continue;
          scanPy(fullPath);
        } else if (file.endsWith('.py')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const relPath = path.relative(targetDir, fullPath);

          // Modifierade domäner efter 3c
          if (!ignoreMtime && stat.mtimeMs > t3c) {
            if (relPath.startsWith('features' + path.sep)) {
              const domName = relPath.split(path.sep)[1];
              if (domName) modifiedDomains.add(domName);
            }
          }

          if (!ignoreMtime && stat.mtimeMs <= t3c) {
            logError('SEKVENSFEL', `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" sparades FÖRE 3c.`);
          }

          // Global AI-Skanning för Python
          const hasAiImport = /(google\.generativeai|google\.genai|openai|langchain|anthropic)/i.test(content);
          const isInsideAiZone = relPath.includes(`domain${path.sep}ai_zones`);
          const isServicesCode = relPath.startsWith('services') || relPath.startsWith('core');

          if (hasAiImport && !isInsideAiZone && !isServicesCode) {
            logError('AI-ISOLERINGSÖVERTRÄDELSE', `${path.relative(ROOT_DIR, fullPath)} innehåller AI-anrop utanför domain/ai_zones/.`);
          }

          const isTest = file.startsWith('test_') || file.endsWith('_test.py') || relPath.includes('tests' + path.sep);
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

    scanPy(targetDir);

    // Max 1 domän per cykel
    if (modifiedDomains.size > 1) {
      logError('DOMÄNÖVERTRÄDELSE (MAX 1 DOMÄN)', `Ändringar upptäcktes i ${modifiedDomains.size} domäner samtidigt (${Array.from(modifiedDomains).join(', ')}). Dela upp i separata cykler.`);
    }

    // Tom produktion
    if (t4 > 0 && newestProdCodeTime <= t3c && newestTestTime <= t3c) {
      logError('TOM PRODUKTION', '4_producera.md skapades men inga .py- eller testfiler i target-mappen har ändrats efter 3c.');
    }

    if (!ignoreMtime && oldestProdCodeTime !== Infinity && oldestTestTime !== Infinity && oldestTestTime > oldestProdCodeTime) {
      logError('TDD-ÖVERTRÄDELSE', 'Produktionskod påbörjades innan några pytest-enhetstester skapats.');
    }

    if (!ignoreMtime && t4 > 0 && t4 <= newestProdCodeTime) {
      logError('SEKVENSFEL', '4_producera.md sparades innan all Python-kod var färdigskriven.');
    }
  }
}