/**
 * DETERMINISTISK MASTER-KONTROLL (v6.2)
 * Kombinerar loop-kontroll, tidsstämplar, Feature-Sliced Design och FSD-konsumtion.
 * Körs automatiskt via npm test.
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
// 1. KONTROLL AV PROCESSLOGGAR OCH EVIGA LOOPAR (4-STEGSMODELLEN)
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

    // A. Verifiera sekvens i tidsstämplar
    if (t2 < t1) logError('SEKVENSFEL', '2_planera.md sparades före 1_kartlagga.md.');
    if (t3 < t2) logError('SEKVENSFEL', '3_designa.md sparades före 2_planera.md.');

    // B. Verifiera beslut i Steg 3
    const step3Content = fs.readFileSync(step3Path, 'utf-8');
    const isApproved = /BESLUT:\s*GODKÄND/i.test(step3Content);

    // C. Kontrollera evig omstartsloop (Räkna konsekutiva OMSTART)
    const cycleFiles = fs.readdirSync(LAST_CYCLE_DIR).filter(f => f.endsWith('.md')).sort();
    let consecutiveOmstarter = 0;

    for (const file of cycleFiles) {
      const content = fs.readFileSync(path.join(LAST_CYCLE_DIR, file), 'utf-8');
      if (/BESLUT:\s*OMSTART/i.test(content)) {
        consecutiveOmstarter++;
      } else if (/BESLUT:\_GODKÄND/i.test(content)) {
        consecutiveOmstarter = 0;
      }
    }

    if (consecutiveOmstarter >= 2) {
      logError('EVIG LOOP UPPTÄCKT', `Processen har fastnat i en omstartsloop (${consecutiveOmstarter} st OMSTART i rad). Exekvering stoppad.`);
    } else if (!isApproved) {
      logError('DOMSTOLSSPÄRR', '3_designa.md saknar "BESLUT: GODKÄND". Källkod får inte redigeras.');
    }

    // ---------------------------------------------------------------------------
    // 2. KÄLLKODSSPÄRR (src/ får inte ha ändrats FÖRE 3_designa.md låstes)
    // ---------------------------------------------------------------------------
    if (fs.existsSync(SRC_DIR) && isApproved) {
      const visitedPaths = new Set();

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
          } else if (/\.(ts|tsx|js|jsx)$/.test(file) && !file.includes('__tests__')) {
            if (stat.mtimeMs < t3 - 2000) {
              logError(
                'TIDSSTÄMPELÖVERTRÄDELSE',
                `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" ändrades före "3_designa.md" sparades.`
              );
              break;
            }
          }
        }
      };
      checkSrcTimestamps(SRC_DIR);
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
            for (const docFile of requiredDocs) {
              if (!fs.existsSync(path.join(targetDocDir, docFile))) {
                logError('DOKUMENTATION OFULLSTÄNDIG', `Domänen saknar "doc/features/${featureName}/${docFile}".`);
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
          logError('STORLEKSGRÄNS ÖVERSKRIDEN', `Filen "${path.relative(ROOT_DIR, fullPath)}" har ${lines} rader (max 250).`);
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
  console.log('✅ Arkitektur-, process- och loopkontroll godkänd.');
}