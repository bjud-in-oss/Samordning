/**
 * DETERMINISTISK MASTER-KONTROLL FÖR SEPARERADE STEG-FILER (v5.1)
 * Körs automatiskt via npm test före alla tester.
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
// 1. KONTROLL AV SEPARERADE STEG-FILER (doc/LAST_CYCLE/)
// -----------------------------------------------------------------------------
if (!fs.existsSync(LAST_CYCLE_DIR)) {
  logError(
    'PROCESSMINNE SAKNAS',
    'Mappen "doc/LAST_CYCLE/" saknas. Arkitektursnurran måste köras före källkodsändringar.'
  );
} else {
  const step1Path = path.join(LAST_CYCLE_DIR, '1_kartlagga.md');
  const step2Path = path.join(LAST_CYCLE_DIR, '2_forandra.md');
  const step3Path = path.join(LAST_CYCLE_DIR, '3_vanda.md');
  const step4Path = path.join(LAST_CYCLE_DIR, '4_forlika.md');

  if (!fs.existsSync(step1Path)) logError('STEG 1 SAKNAS', 'Filen "doc/LAST_CYCLE/1_kartlagga.md" saknas.');
  if (!fs.existsSync(step2Path)) logError('STEG 2 SAKNAS', 'Filen "doc/LAST_CYCLE/2_forandra.md" saknas.');
  if (!fs.existsSync(step3Path)) logError('STEG 3 SAKNAS', 'Filen "doc/LAST_CYCLE/3_vanda.md" saknas.');
  if (!fs.existsSync(step4Path)) logError('STEG 4 SAKNAS', 'Filen "doc/LAST_CYCLE/4_forlika.md" saknas.');

  if (fs.existsSync(step1Path) && fs.existsSync(step2Path) && fs.existsSync(step3Path) && fs.existsSync(step4Path)) {
    const t1 = fs.statSync(step1Path).mtimeMs;
    const t2 = fs.statSync(step2Path).mtimeMs;
    const t3 = fs.statSync(step3Path).mtimeMs;
    const t4 = fs.statSync(step4Path).mtimeMs;

    // Verifiera tidsstämplar mellan stegen
    if (t2 < t1) logError('SEKVENSFEL', '2_forandra.md sparades före 1_kartlagga.md.');
    if (t3 < t2) logError('SEKVENSFEL', '3_vanda.md sparades före 2_forandra.md.');
    if (t4 < t3) logError('SEKVENSFEL', '4_forlika.md sparades före 3_vanda.md.');

    // Verifiera beslut i Steg 4
    const step4Content = fs.readFileSync(step4Path, 'utf-8');
    const isApproved = /BESLUT:\s*GODKÄND/i.test(step4Content);
    const isReLoop = /BESLUT:\s*OMSTART/i.test(step4Content);

    if (isReLoop) {
      logError('OMSTART KRÄVS', '4_forlika.md har markerats med BESLUT: OMSTART. Börja om från 1_kartlagga.md.');
    } else if (!isApproved) {
      logError('DOMSTOLSSPÄRR', '4_forlika.md saknar "BESLUT: GODKÄND". Källkod får inte redigeras.');
    }

    // ---------------------------------------------------------------------------
    // 2. KÄLLKODSSPÄRR (src/ får inte ha ändrats FÖRE 4_forlika.md låstes)
    // ---------------------------------------------------------------------------
    if (fs.existsSync(SRC_DIR) && isApproved) {
      const now = Date.now();
      const FIFTEEN_MINUTES = 15 * 60 * 1000;
      const checkSrcTimestamps = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            checkSrcTimestamps(fullPath);
          } else if (/\.(ts|tsx|js|jsx)$/.test(file) && !file.includes('__tests__')) {
            // Kontrollera endast nyligen ändrade filer (senaste 15 minuterna)
            if (now - stat.mtimeMs < FIFTEEN_MINUTES) {
              if (stat.mtimeMs < t4 - 2000) {
                logError(
                  'TIDSSTÄMPELÖVERTRÄDELSE',
                  `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" ändrades före "4_forlika.md" sparades.`
                );
                break;
              }
            }
          }
        }
      };
      checkSrcTimestamps(SRC_DIR);
    }
  }
}

// -----------------------------------------------------------------------------
// 3. CODEBASE- OCH FSD-REGLER
// -----------------------------------------------------------------------------
if (fs.existsSync(SRC_DIR)) {
  const scanCodebase = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Kontrollera att fraktal doku ligger under doc/features/[domän]/
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

          // Kontrollera konsumtionskrav
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

        if (lines > 250) {
          logError('STORLEKSGRÄNS ÖVERSKRIDEN', `Filen "${path.relative(ROOT_DIR, fullPath)}" har ${lines} rader (max 250).`);
        }

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
  console.log('✅ Arkitektur- och processkontroll godkänd.');
}