/**
 * DETERMINISTISK MASTER-KONTROLL OCH PROCESSREVISOR (v6.2)
 * Körs automatiskt via npm test eller i CI/CD-pipelinen.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DOC_DIR = path.join(ROOT_DIR, 'doc');
const LAST_CYCLE_DIR = path.join(DOC_DIR, 'LAST_CYCLE');
const FEATURE_DOC_DIR = path.join(DOC_DIR, 'features');
const SRC_DIR = path.join(ROOT_DIR, 'src');

let hasErrors = false;

function logError(title, message) {
  console.error(`\n❌ [MEKANISK SPÄRR] ${title}`);
  console.error(`   ${message}`);
  hasErrors = true;
}

// -----------------------------------------------------------------------------
// 1. KONTROLL AV PROCESSLOGGAR, TIDSSTÄMPLAR OCH LOOPAR (4-STEGSMODELLEN)
// -----------------------------------------------------------------------------
if (!fs.existsSync(LAST_CYCLE_DIR)) {
  logError(
    'PROCESSMINNE SAKNAS',
    'Mappen "doc/LAST_CYCLE/" saknas. Arkitektursnurran måste köras före källkodsändringar.'
  );
} else {
  const step1Path = path.join(LAST_CYCLE_DIR, '1_kartlagga.md');
  const step2Path = path.join(LAST_CYCLE_DIR, '2_planera.md');
  const step3Path = path.join(LAST_CYCLE_DIR, '3_designa.md');

  if (!fs.existsSync(step1Path)) logError('STEG 1 SAKNAS', 'Filen "doc/LAST_CYCLE/1_kartlagga.md" saknas.');
  if (!fs.existsSync(step2Path)) logError('STEG 2 SAKNAS', 'Filen "doc/LAST_CYCLE/2_planera.md" saknas.');
  if (!fs.existsSync(step3Path)) logError('STEG 3 SAKNAS', 'Filen "doc/LAST_CYCLE/3_designa.md" saknas.');

  if (fs.existsSync(step1Path) && fs.existsSync(step2Path) && fs.existsSync(step3Path)) {
    const t1 = fs.statSync(step1Path).mtimeMs;
    const t2 = fs.statSync(step2Path).mtimeMs;
    const t3 = fs.statSync(step3Path).mtimeMs;

    // A. Verifiera kronologisk sekvens i processloggarna
    if (t2 < t1) logError('SEKVENSFEL', '2_planera.md sparades före 1_kartlagga.md.');
    if (t3 < t2) logError('SEKVENSFEL', '3_designa.md sparades före 2_planera.md.');

    // B. Verifiera godkänt beslut i Steg 3
    const step3Content = fs.readFileSync(step3Path, 'utf-8');
    const isApproved = /BESLUT:\s*GODKÄND/i.test(step3Content);

    // C. Kontroll av evig omstartsloop (Räknar historiska OMSTART i rad)
    const cycleFiles = fs.readdirSync(LAST_CYCLE_DIR).filter(f => f.endsWith('.md')).sort();
    let consecutiveOmstarter = 0;

    for (const file of cycleFiles) {
      const content = fs.readFileSync(path.join(LAST_CYCLE_DIR, file), 'utf-8');
      if (/BESLUT:\s*OMSTART/i.test(content)) {
        consecutiveOmstarter++;
      } else if (/BESLUT:\s*GODKÄND/i.test(content)) {
        consecutiveOmstarter = 0;
      }
    }

    if (consecutiveOmstarter >= 2) {
      logError('EVIG OMSTARTSLOOP', `Processen har fastnat i en loop (${consecutiveOmstarter} st OMSTART i rad). Manuell granskning krävs.`);
    } else if (!isApproved) {
      logError('DOMSTOLSSPÄRR', '3_designa.md saknar "BESLUT: GODKÄND". Källkod i src/ får inte redigeras.');
    }

    // ---------------------------------------------------------------------------
    // 2. KÄLLKODSSPÄRR OCH TDD-ORDNING (src/ får inte tjuvstarta)
    // ---------------------------------------------------------------------------
    if (fs.existsSync(SRC_DIR) && isApproved) {
      const visitedPaths = new Set();
      let newestTestTime = 0;
      let oldestSourceCodeEditTime = Infinity;

      const checkSrcTimestamps = (dir) => {
        const realPath = fs.realpathSync(dir);
        if (visitedPaths.has(realPath)) return;
        visitedPaths.add(realPath);

        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            checkSrcTimestamps(fullPath);
          } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
            // Kontroll 1: Har koden ändrats FÖRE 3_designa.md låstes?
            if (stat.mtimeMs < t3 - 2000) {
              logError(
                'TIDSSTÄMPELÖVERTRÄDELSE',
                `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" ändrades före "3_designa.md" sparades.`
              );
            }

            // Mät TDD-ordning (Test vs Produktionskod)
            if (file.includes('__tests__') || file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
              if (stat.mtimeMs > newestTestTime) newestTestTime = stat.mtimeMs;
            } else {
              if (stat.mtimeMs < oldestSourceCodeEditTime) oldestSourceCodeEditTime = stat.mtimeMs;
            }
          }
        }
      };

      checkSrcTimestamps(SRC_DIR);

      // Kontroll 2: TDD-ordning (Innebär att produktionskoden inte får vara äldre än testfilen)
      if (oldestSourceCodeEditTime !== Infinity && newestTestTime !== 0 && oldestSourceCodeEditTime < newestTestTime - 2000) {
        logError('TDD-ÖVERTRÄDELSE', 'Produktionskod sparades på disk innan enhetstesterna skapades/uppdaterades.');
      }
    }
  }
}

// -----------------------------------------------------------------------------
// 3. CODEBASE-, FRAKTAL DOKUMENTATION OCH FSD-REGLER
// -----------------------------------------------------------------------------
if (fs.existsSync(SRC_DIR)) {
  const visitedPaths = new Set();

  const scanCodebase = (dir) => {
    const realPath = fs.realpathSync(dir);
    if (visitedPaths.has(realPath)) return;
    visitedPaths.add(realPath);

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // A. Kontrollera att fraktal doku ligger under doc/features/[domän]/
        if (dir.endsWith(path.join('src', 'features'))) {
          const featureName = file;
          const targetDocDir = path.join(FEATURE_DOC_DIR, featureName);
          const requiredDocs = ['INDEX.md', 'BUSINESS_RULES.md', 'UI_WORKFLOWS.md', 'INTEGRATIONS.md'];

          if (!fs.existsSync(targetDocDir)) {
            logError('DOKUMENTATION SAKNAS', `Mappen "doc/features/${featureName}/" saknas.`);
          } else {
            const step2Path = path.join(LAST_CYCLE_DIR, '2_planera.md');
            const t2 = fs.existsSync(step2Path) ? fs.statSync(step2Path).mtimeMs : 0;

            for (const docFile of requiredDocs) {
              const docPath = path.join(targetDocDir, docFile);
              if (!fs.existsSync(docPath)) {
                logError('DOKUMENTATION OFULLSTÄNDIG', `Domänen saknar "doc/features/${featureName}/${docFile}".`);
              } else if (t2 > 0 && fs.statSync(docPath).mtimeMs < t2 - 2000) {
                // Kräv att dokumentationen uppdaterades under nuvarande cykel
                logError('DOKUMENTATION FÖRÅLDRAD', `Filen "doc/features/${featureName}/${docFile}" uppdaterades inte under Steg 3.`);
              }
            }
          }

          // B. Kontrollera konsumtionskrav (Import utanför den egna domänen)
          const importRegex = new RegExp(`from\\s+['"].*\\/features\\/${featureName}['"]`, 'g');
          let isConsumedExternally = false;

          const verifyConsumption = (searchDir) => {
            const searchFiles = fs.readdirSync(searchDir);
            for (const sFile of searchFiles) {
              const sPath = path.join(searchDir, sFile);
              if (fs.statSync(sPath).isDirectory()) {
                if (!sPath.startsWith(fullPath)) verifyConsumption(sPath);
              } else if (/\.(ts|tsx|js|jsx)$/.test(sFile)) {
                const sContent = fs.readFileSync(sPath, 'utf-8');
                if (importRegex.test(sContent)) {
                  isConsumedExternally = true;
                  break;
                }
              }
            }
          };

          verifyConsumption(SRC_DIR);
          if (!isConsumedExternally) {
            logError('KONSUMTIONSSPÄRR', `Domänen "${featureName}" konsumeras inte externt.`);
          }
        }
        scanCodebase(fullPath);
      } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const lines = fileContent.split('\n').length;

        // C. Radantal (<250 rader)
        if (lines > 250) {
          logError('STORLEKSGRÄNS ÖVERSKRIDEN', `Filen "${path.relative(ROOT_DIR, fullPath)}" har ${lines} rader (max 250 tillåtet).`);
        }

        // D. FSD-regel: Förbjud direkta importer till undermappar i andra features
        const invalidFsdImport = /from\s+['"][^'"]*\/features\/[^/]+\/(components|hooks|api|domain)\//;
        const fileLines = fileContent.split('\n');
        if (fileLines.some(line => invalidFsdImport.test(line))) {
          logError('FSD-ÖVERTRÄDELSE', `Filen "${path.relative(ROOT_DIR, fullPath)}" importerar internt från en annan domän.`);
        }
      }
    }
  };

  scanCodebase(SRC_DIR);
}

// -----------------------------------------------------------------------------
// 4. MÅLLINJE OCH AVBROTT
// -----------------------------------------------------------------------------
if (hasErrors) {
  console.error('\n⛔ BYGGET STOPPADES AV MEKANISK KONTROLL.');
  console.error('   AI Studio måste åtgärda avvikelserna i doc/LAST_CYCLE/ innan koden godkänns.\n');
  process.exit(1);
} else {
  console.log('✅ Arkitektur-, process-, TDD- och loopkontroll godkänd.');
}