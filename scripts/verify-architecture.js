/**
 * DETERMINISTISK MASTER-KONTROLL FOR SNURRA 1 OCH SNURRA 2 (v5.0)
 * Körs automatiskt via npm test före alla tester.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const LAST_CYCLE_PATH = path.join(ROOT_DIR, 'doc', 'LAST_CYCLE.md');
const SRC_DIR = path.join(ROOT_DIR, 'src');

let hasErrors = false;

function logError(title, message) {
  console.error(`\n❌ [MEKANISK SPÄRR] ${title}`);
  console.error(`   ${message}`);
  hasErrors = true;
}

// -----------------------------------------------------------------------------
// 1. KONTROLL AV SNURRA 1 (doc/LAST_CYCLE.md)
// -----------------------------------------------------------------------------
if (!fs.existsSync(LAST_CYCLE_PATH)) {
  logError(
    'PROCESSMINNE SAKNAS',
    'Filen "doc/LAST_CYCLE.md" saknas. Arkitektursnurran måste köras före källkodsändringar.'
  );
} else {
  const content = fs.readFileSync(LAST_CYCLE_PATH, 'utf-8');
  const stats = fs.statSync(LAST_CYCLE_PATH);
  const lastCycleMtime = stats.mtimeMs;

  // Hämta den senaste cykeln
  const cycleBlocks = content.split(/(?=###\s*1\.\s*Att kartlägga)/gi);
  const latestCycle = cycleBlocks[cycleBlocks.length - 1] || '';

  // Verifiera att alla 5 steg finns i korrekt ordning i senaste cykeln
  const requiredSteps = [
    '### 1. Att kartlägga',
    '### 2. Att förändra',
    '### 3. Att vända',
    '### 4. Att förlika',
    '### 5. Att producera'
  ];

  let lastIndex = -1;
  for (const step of requiredSteps) {
    const index = latestCycle.indexOf(step);
    if (index === -1) {
      logError(
        'SNURRA 1 OFULLSTÄNDIG',
        `Senaste cykeln i "doc/LAST_CYCLE.md" saknar steget "${step}".`
      );
    } else if (index < lastIndex) {
      logError(
        'FELAKTIG SEKVENS',
        `Stegen i "doc/LAST_CYCLE.md" står i fel ordning. "${step}" dök upp före ett tidigare steg.`
      );
    }
    lastIndex = index;
  }

  // Verifiera att Steg 4 har ett godkänt beslut
  const isApproved = /BESLUT:\s*GODKÄND/i.test(latestCycle);
  const isReLoop = /BESLUT:\s*OMSTART|STATUS:\s*(Re-loop|Krasch|Omstart)/i.test(latestCycle);

  if (isReLoop && !latestCycle.includes('### 1. Att kartlägga', latestCycle.indexOf('BESLUT:'))) {
    logError(
      'UROPPLÖST OMSTART',
      'Processen har markerats för omstart/krasch. En ny cykel måste startas från "### 1. Att kartlägga".'
    );
  } else if (!isApproved) {
    logError(
      'DOMSTOLSSPÄRR',
      'Steg 4 i "doc/LAST_CYCLE.md" saknar "BESLUT: GODKÄND". Produktionskod får inte ändras förrän beslutet är låst.'
    );
  }

  // ---------------------------------------------------------------------------
  // 2. TIDSSTÄMPELKONTROLL (Planering -> Testfil -> Produktionskod)
  // ---------------------------------------------------------------------------
  if (fs.existsSync(SRC_DIR)) {
    const checkFileOrder = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          checkFileOrder(fullPath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(file) && !file.includes('__tests__')) {
          // Källkodsfiler får inte vara nyare än processloggens senaste sparande (med 2s marginal)
          if (stat.mtimeMs > lastCycleMtime + 2000) {
            logError(
              'TIDSSTÄMPELÖVERTRÄDELSE',
              `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" ändrades efter "doc/LAST_CYCLE.md". Planeringen måste sparas först.`
            );
            break;
          }
        }
      }
    };
    checkFileOrder(SRC_DIR);
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
        // Kontroll av fraktal dokumentation för domäner i src/features/
        if (dir.endsWith(path.join('src', 'features'))) {
          const docDir = path.join(fullPath, 'doc');
          const requiredDocs = ['INDEX.md', 'BUSINESS_RULES.md', 'UI_WORKFLOWS.md', 'INTEGRATIONS.md'];
          
          if (!fs.existsSync(docDir)) {
            logError('FRAKTAL DOKUMENTATION SAKNAS', `Mappen "${path.relative(ROOT_DIR, fullPath)}" saknar sin lokala "doc/"-mapp.`);
          } else {
            for (const docFile of requiredDocs) {
              if (!fs.existsSync(path.join(docDir, docFile))) {
                logError('DOKUMENTATION OFULLSTÄNDIG', `Domänen "${file}" saknar obligatoriska "doc/${docFile}".`);
              }
            }
          }

          // Kontroll av konsumtionskrav (domänens publika index måste importeras externt)
          const featureName = file;
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
            logError(
              'KONSUMTIONSSPÄRR',
              `Domänen "${featureName}" konsumeras inte externt. Des publika gränssnitt måste importeras i en fil utanför mappen.`
            );
          }
        }
        scanCodebase(fullPath);
      } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const lines = fileContent.split('\n').length;

        // Max 250 rader kod
        if (lines > 250) {
          logError('STORLEKSGRÄNS ÖVERSKRIDEN', `Filen "${path.relative(ROOT_DIR, fullPath)}" har ${lines} rader (max 250 rader tillåtet).`);
        }

        // FSD-isolering: Förbjud direktimport från interna undermappar i andra domäner
        const invalidFsdImport = /from\s+['"][^'"]*\/features\/[^/]+\/(components|hooks|api|domain)\//;
        const fileLines = fileContent.split('\n');
        if (fileLines.some(line => invalidFsdImport.test(line))) {
          logError('FSD-ÖVERTRÄDELSE', `Filen "${path.relative(ROOT_DIR, fullPath)}" importerar internt från en annan domän. Använd domänens publika gränssnitt.`);
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
  console.error('   AI Studio måste åtgärda ovanstående avvikelser i doc/LAST_CYCLE.md innan koden godkänns.\n');
  process.exit(1);
} else {
  console.log('✅ Arkitektur- och processkontroll godkänd.');
}