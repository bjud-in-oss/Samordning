/**
 * DETERMINISTISK PROCESS- OCH KODREVISOR (v8.4)
 * Mekanisk spärr för sekvenser, TDD, FSD, radgräns, skriptfusk och tom produktion.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DOC_DIR = path.join(ROOT_DIR, 'doc');
const LAST_CYCLE_DIR = path.join(DOC_DIR, 'LAST_CYCLE');
const SRC_DIR = path.join(ROOT_DIR, 'src');

const ignoreMtime = process.argv.includes('--ignore-mtime') || process.argv.includes('--fresh-clone');
let hasErrors = false;

function logError(title, message) {
  console.error(`\n❌ [MEKANISK SPÄRR] ${title}`);
  console.error(`   ${message}`);
  hasErrors = true;
}

function getMtime(filePath) {
  return fs.existsSync(filePath) ? fs.statSync(filePath).mtimeMs : 0;
}

function readFile(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

if (!fs.existsSync(LAST_CYCLE_DIR)) {
  logError('PROCESSMINNE SAKNAS', 'Mappen "doc/LAST_CYCLE/" saknas.');
} else {
  // 1. STEG 1 & SKRIPTFUSK
  const p1a = path.join(LAST_CYCLE_DIR, '1a_orientera.md');
  const p1b = path.join(LAST_CYCLE_DIR, '1b_kartlagga.md');
  const t1a = getMtime(p1a);
  const t1b = getMtime(p1b);
  const tScript = getMtime(__filename);

  if (t1a === 0 || t1b === 0) logError('STEG 1 SAKNAS', '1a_orientera.md eller 1b_kartlagga.md saknas.');
  if (!ignoreMtime && t1b <= t1a) logError('SEKVENSFEL', '1b_kartlagga.md måste sparas strikt EFTER 1a_orientera.md.');

  // Spärr mot manipulering av verifieringsskriptet under cykeln
  if (!ignoreMtime && t1a > 0 && tScript > t1a) {
    logError('SKRIPTMANIPULERING', 'scripts/verify-architecture.js har redigerats under pågående cykel.');
  }

  if (t1a > 0) {
    const jsonMatch = readFile(p1a).match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      logError('FORMATFEL (ADR-010)', '1a_orientera.md saknar giltigt ```json ... ```-block.');
    } else {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (!parsed.status || !parsed.current_domain || !parsed.next_step) {
          logError('FORMATFEL (ADR-010)', 'JSON-blocket saknar "status", "current_domain" eller "next_step".');
        }
      } catch (e) {
        logError('JSON-PARSE-FEL (ADR-010)', 'JSON-blocket i 1a_orientera.md kunde inte tolkas.');
      }
    }
  }

  // 2. STEG 2: STRATEGISKT NÄTVERK
  const p2a = path.join(LAST_CYCLE_DIR, '2a_forandra_utat_vision.md');
  const p2b = path.join(LAST_CYCLE_DIR, '2b_evaluera_yttre_anpassning.md');
  const p2c = path.join(LAST_CYCLE_DIR, '2c_forandra_inat_refaktorisering.md');
  const p2d = path.join(LAST_CYCLE_DIR, '2d_evaluera_inre_struktur.md');
  const p2e = path.join(LAST_CYCLE_DIR, '2e_forsoning_och_forlikning.md');
  const p2f = path.join(LAST_CYCLE_DIR, '2f_evaluera_syntes.md');

  const t2a = getMtime(p2a), t2b = getMtime(p2b), t2c = getMtime(p2c);
  const t2d = getMtime(p2d), t2e = getMtime(p2e), t2f = getMtime(p2f);

  if (!ignoreMtime) {
    if (t2a <= t1b) logError('SEKVENSFEL', '2a måste sparas strikt EFTER 1b.');
    if (t2b <= t2a) logError('SEKVENSFEL', '2b måste sparas strikt EFTER 2a.');
  }

  let strategyPassedTime = 0;
  if (/BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2b))) {
    strategyPassedTime = t2b;
  } else {
    if (!ignoreMtime) {
      if (t2c <= t2b) logError('SEKVENSFEL', '2c måste sparas EFTER 2b.');
      if (t2d <= t2c) logError('SEKVENSFEL', '2d måste sparas EFTER 2c.');
    }
    if (/BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2d))) {
      strategyPassedTime = t2d;
    } else {
      if (!ignoreMtime) {
        if (t2e <= t2d) logError('SEKVENSFEL', '2e måste sparas EFTER 2d.');
        if (t2f <= t2e) logError('SEKVENSFEL', '2f måste sparas EFTER 2e.');
      }
      if (fs.existsSync(p2e) && /(tvärdomän|bibliotek|säkerhetsregler|kontrakt|adr)/i.test(readFile(p2e))) {
        if (!ignoreMtime && getMtime(path.join(DOC_DIR, 'ADR.md')) <= t2e) {
          logError('DOKUMENTATIONSSKULD', '2e kräver en ADR-uppdatering, men doc/ADR.md har inte sparats efter 2e.');
        }
      }
      if (/BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2f))) {
        strategyPassedTime = t2f;
      } else {
        logError('STRATEGISK SPÄRR', 'Inget "BESLUT: GÅ_TILL_DESIGN" nåddes i Steg 2.');
      }
    }
  }

  // 3. STEG 3: DESIGNKEDJA
  const p3a = path.join(LAST_CYCLE_DIR, '3a_helhet_orkestrering_och_integration.md');
  const p3b = path.join(LAST_CYCLE_DIR, '3b_doman_kontrakt_och_fraktal_dokumentation.md');
  const p3c = path.join(LAST_CYCLE_DIR, '3c_fil_operativ_kallkodsspecifikation.md');
  const t3a = getMtime(p3a), t3b = getMtime(p3b), t3c = getMtime(p3c);

  if (!ignoreMtime) {
    if (t3a <= strategyPassedTime) logError('SEKVENSFEL', '3a måste sparas strikt EFTER Steg 2-godkännandet.');
    if (t3b <= t3a) logError('SEKVENSFEL', '3b måste sparas strikt EFTER 3a.');
    if (t3c <= t3b) logError('SEKVENSFEL', '3c måste sparas strikt EFTER 3b.');
  }

  if (!(t3c > 0 && /BESLUT:\s*GODKÄND/i.test(readFile(p3c)))) {
    logError('DOMSTOLSSPÄRR', '3c_fil_operativ_kallkodsspecifikation.md saknar "BESLUT: GODKÄND".');
  }

  // 4. SAMLOKALISERAD DOMÄNDOKUMENTATION & FASADER
  const featuresDir = path.join(SRC_DIR, 'features');
  if (fs.existsSync(featuresDir)) {
    for (const domain of fs.readdirSync(featuresDir)) {
      const domainPath = path.join(featuresDir, domain);
      if (!fs.statSync(domainPath).isDirectory()) continue;

      const domainDocDir = path.join(domainPath, 'doc');
      if (fs.existsSync(domainDocDir) && fs.statSync(domainDocDir).isDirectory()) {
        for (const docFile of fs.readdirSync(domainDocDir)) {
          if (docFile.endsWith('.md') && !ignoreMtime && getMtime(path.join(domainDocDir, docFile)) <= t3c) {
            logError('SEKVENSFEL', `Dokumentation "${docFile}" sparades FÖRE 3c var godkänd.`);
          }
        }
      }

      const indexPath = path.join(domainPath, 'index.ts');
      if (fs.existsSync(indexPath)) {
        const clean = fs.readFileSync(indexPath, 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        const invalidLine = clean.split('\n').map(l => l.trim()).filter(Boolean).find(l => !/^(export|import)\b/.test(l));
        if (invalidLine) logError('FASAD-ÖVERTRÄDELSE (ADR-009)', `${path.relative(ROOT_DIR, indexPath)} har otillåten rad: "${invalidLine}"`);
      }
    }
  }

  // 5. TDD OCH KÄLLKODSKONTROLL
  if (fs.existsSync(SRC_DIR)) {
    let oldestTestTime = Infinity, oldestProdCodeTime = Infinity;
    let newestProdCodeTime = 0, newestTestTime = 0;

    const scanSrc = (dir) => {
      for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanSrc(fullPath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
          if (!ignoreMtime && stat.mtimeMs <= t3c) {
            logError('SEKVENSFEL', `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" sparades FÖRE 3c.`);
          }

          const isTest = file.includes('__tests__') || file.endsWith('.test.ts') || file.endsWith('.test.tsx');
          if (isTest) {
            if (stat.mtimeMs < oldestTestTime) oldestTestTime = stat.mtimeMs;
            if (stat.mtimeMs > newestTestTime) newestTestTime = stat.mtimeMs;
          } else {
            if (stat.mtimeMs < oldestProdCodeTime) oldestProdCodeTime = stat.mtimeMs;
            if (stat.mtimeMs > newestProdCodeTime) newestProdCodeTime = stat.mtimeMs;
          }

          if (fs.readFileSync(fullPath, 'utf-8').split('\n').length > 250) {
            logError('STORLEKSGRÄNS ÖVERSKRIDEN', `${path.relative(ROOT_DIR, fullPath)} överstiger 250 rader.`);
          }

          if (/(from\s+['"][^'"]*\/features\/[^/]+\/(components|hooks|api|domain|doc)\/|from\s+['"]\.\.\/\.\.\/)/.test(fs.readFileSync(fullPath, 'utf-8'))) {
            logError('FSD-ÖVERTRÄDELSE', `${path.relative(ROOT_DIR, fullPath)} importerar internt eller kliver bakåt.`);
          }
        }
      }
    };

    scanSrc(SRC_DIR);

    const p4 = path.join(LAST_CYCLE_DIR, '4_producera.md');
    const t4 = getMtime(p4);

    // Mekanisk spärr mot tom kodproduktion
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

if (hasErrors) {
  console.error('\n⛔ BYGGET STOPPADES AV MEKANISK KONTROLL.\n');
  process.exit(1);
} else {
  console.log('✅ Alla sekvenser, fasader, TDD-kronologier och produktionstester godkända.');
}