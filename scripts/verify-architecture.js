/**
 * DETERMINISTISK PROCESS- OCH KODREVISOR (v8.3)
 * Verifierar Steg 1-orientering (JSON-tillstånd), Steg 2-nätverk, Steg 3-design,
 * TDD-kronologi, FSD-gränser, 250-radersregeln, ADR-kopplingar och index.ts-fasader.
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
  // --- 1. VERIFIERA STEG 1 (ORIENTERING OCH KARTLÄGGNING) ---
  const p1a = path.join(LAST_CYCLE_DIR, '1a_orientera.md');
  const p1b = path.join(LAST_CYCLE_DIR, '1b_kartlagga.md');
  const t1a = getMtime(p1a);
  const t1b = getMtime(p1b);

  if (t1a === 0) logError('STEG 1 SAKNAS', '1a_orientera.md saknas (tillståndskontroll och avbrottsanalys).');
  if (t1b === 0) logError('STEG 1 SAKNAS', '1b_kartlagga.md saknas.');
  if (!ignoreMtime && t1b < t1a) logError('SEKVENSFEL', '1b_kartlagga.md måste sparas efter 1a_orientera.md.');

  // JSON-validering i 1a_orientera.md (ADR-010)
  if (t1a > 0) {
    const content1a = readFile(p1a);
    const jsonMatch = content1a.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      logError('FORMATFEL (ADR-010)', '1a_orientera.md saknar ett giltigt ```json ... ```-block i slutet.');
    } else {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (!parsed.status || !parsed.current_domain || !parsed.next_step) {
          logError('FORMATFEL (ADR-010)', 'JSON-blocket i 1a_orientera.md saknar nycklarna "status", "current_domain" eller "next_step".');
        }
      } catch (e) {
        logError('JSON-PARSE-FEL (ADR-010)', 'JSON-blocket i 1a_orientera.md kunde inte tolkas.');
      }
    }

    if (!ignoreMtime) {
      const elapsedSeconds = (Date.now() - t1a) / 1000;
      if (elapsedSeconds > 1500) {
        console.warn(`\n⏳ [TIDSVARNING] Den pågående cykeln har pågått i ${Math.round(elapsedSeconds)} sekunder.`);
        console.warn('   Spara nuvarande tillstånd till disk och be om bekräftelse för nästa delsteg.\n');
      }
    }
  }

  // --- 2. VERIFIERA DYNAMISKT STRATEGISKT NÄTVERK (STEG 2) ---
  const p2a = path.join(LAST_CYCLE_DIR, '2a_forandra_utat_vision.md');
  const p2b = path.join(LAST_CYCLE_DIR, '2b_evaluera_yttre_anpassning.md');
  const p2c = path.join(LAST_CYCLE_DIR, '2c_forandra_inat_refaktorisering.md');
  const p2d = path.join(LAST_CYCLE_DIR, '2d_evaluera_inre_struktur.md');
  const p2e = path.join(LAST_CYCLE_DIR, '2e_forsoning_och_forlikning.md');
  const p2f = path.join(LAST_CYCLE_DIR, '2f_evaluera_syntes.md');

  const t2a = getMtime(p2a);
  const t2b = getMtime(p2b);
  const t2c = getMtime(p2c);
  const t2d = getMtime(p2d);
  const t2e = getMtime(p2e);
  const t2f = getMtime(p2f);

  if (!ignoreMtime) {
    if (t2a < t1b) logError('SEKVENSFEL', '2a_forandra_utat_vision.md måste sparas efter 1b_kartlagga.md.');
    if (t2b < t2a) logError('SEKVENSFEL', '2b_evaluera_yttre_anpassning.md måste sparas efter 2a.');
  }

  let strategyPassedTime = 0;
  const isApproved2b = /BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2b));

  if (isApproved2b) {
    strategyPassedTime = t2b;
  } else {
    if (!ignoreMtime) {
      if (t2c < t2b) logError('SEKVENSFEL', '2c_forandra_inat_refaktorisering.md måste sparas efter 2b.');
      if (t2d < t2c) logError('SEKVENSFEL', '2d_evaluera_inre_struktur.md måste sparas efter 2c.');
    }

    const isApproved2d = /BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2d));
    if (isApproved2d) {
      strategyPassedTime = t2d;
    } else {
      if (!ignoreMtime) {
        if (t2e < t2d) logError('SEKVENSFEL', '2e_forsoning_och_forlikning.md måste sparas efter 2d.');
        if (t2f < t2e) logError('SEKVENSFEL', '2f_evaluera_syntes.md måste sparas efter 2e.');
      }

      if (fs.existsSync(p2e)) {
        const content2e = readFile(p2e);
        const requiresAdrUpdate = /(tvärdomän|bibliotek|säkerhetsregler|kontrakt|adr)/i.test(content2e);
        if (requiresAdrUpdate) {
          const adrPath = path.join(DOC_DIR, 'ADR.md');
          const tAdr = getMtime(adrPath);
          if (!ignoreMtime && tAdr < t2e) {
            logError('DOKUMENTATIONSSKULD', '2e_forsoning_och_forlikning.md kräver en ADR-uppdatering, men doc/ADR.md har inte sparats efter 2e.');
          }
        }
      }

      const isApproved2f = /BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2f));
      if (isApproved2f) {
        strategyPassedTime = t2f;
      } else {
        logError('STRATEGISK SPÄRR', 'Inget "BESLUT: GÅ_TILL_DESIGN" nåddes i Steg 2-nätverket.');
      }
    }
  }

  // --- 3. VERIFIERA TAKTISK DESIGNKEDJA (STEG 3) ---
  const p3a = path.join(LAST_CYCLE_DIR, '3a_helhet_orkestrering_och_integration.md');
  const p3b = path.join(LAST_CYCLE_DIR, '3b_doman_kontrakt_och_fraktal_dokumentation.md');
  const p3c = path.join(LAST_CYCLE_DIR, '3c_fil_operativ_kallkodsspecifikation.md');

  const t3a = getMtime(p3a);
  const t3b = getMtime(p3b);
  const t3c = getMtime(p3c);

  if (!ignoreMtime) {
    if (t3a < strategyPassedTime) logError('SEKVENSFEL', '3a_helhet...md måste sparas efter att Steg 2 godkändes.');
    if (t3b < t3a) logError('SEKVENSFEL', '3b_doman...md måste sparas efter 3a.');
    if (t3c < t3b) logError('SEKVENSFEL', '3c_fil...md måste sparas efter 3b.');
  }

  const isDesignApproved = t3c > 0 && /BESLUT:\s*GODKÄND/i.test(readFile(p3c));
  if (!isDesignApproved) {
    logError('DOMSTOLSSPÄRR', '3c_fil_operativ_kallkodsspecifikation.md saknar "BESLUT: GODKÄND".');
  }

  // --- 4. SAMLOKALISERAD DOMÄNDOKUMENTATION & FASADER ---
  const featuresDir = path.join(SRC_DIR, 'features');
  if (fs.existsSync(featuresDir)) {
    const domains = fs.readdirSync(featuresDir);
    for (const domain of domains) {
      const domainPath = path.join(featuresDir, domain);
      if (!fs.statSync(domainPath).isDirectory()) continue;

      // A. Dokumentationstidsstämplar
      const domainDocDir = path.join(domainPath, 'doc');
      if (isDesignApproved && fs.existsSync(domainDocDir) && fs.statSync(domainDocDir).isDirectory()) {
        for (const docFile of fs.readdirSync(domainDocDir)) {
          if (docFile.endsWith('.md')) {
            const docPath = path.join(domainDocDir, docFile);
            if (!ignoreMtime && getMtime(docPath) < t3c) {
              logError('SEKVENSFEL', `Dokumentationsfilen "${path.relative(ROOT_DIR, docPath)}" sparades FÖRE 3c var godkänd.`);
            }
          }
        }
      }

      // B. Fasad-kontroll för index.ts (ADR-009)
      const indexPath = path.join(domainPath, 'index.ts');
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf-8');
        const cleanContent = indexContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        const lines = cleanContent.split('\n').map(l => l.trim()).filter(Boolean);
        const invalidLine = lines.find(line => !/^(export|import)\b/.test(line));
        if (invalidLine) {
          logError('FASAD-ÖVERTRÄDELSE (ADR-009)', `${path.relative(ROOT_DIR, indexPath)} innehåller affärslogik eller icke-export-sats: "${invalidLine}"`);
        }
      }
    }
  }

  // --- 5. TDD OCH KÄLLKODSKONTROLL (STEG 4) ---
  if (fs.existsSync(SRC_DIR) && isDesignApproved) {
    let oldestTestTime = Infinity;
    let oldestProdCodeTime = Infinity;
    let newestProdCodeTime = 0;

    const scanSrc = (dir) => {
      for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanSrc(fullPath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
          if (!ignoreMtime && stat.mtimeMs < t3c) {
            logError('SEKVENSFEL', `Källkodsfilen "${path.relative(ROOT_DIR, fullPath)}" sparades FÖRE 3c.`);
          }

          const isTest = file.includes('__tests__') || file.endsWith('.test.ts') || file.endsWith('.test.tsx');
          if (isTest) {
            if (stat.mtimeMs < oldestTestTime) oldestTestTime = stat.mtimeMs;
          } else {
            if (stat.mtimeMs < oldestProdCodeTime) oldestProdCodeTime = stat.mtimeMs;
            if (stat.mtimeMs > newestProdCodeTime) newestProdCodeTime = stat.mtimeMs;
          }

          const lines = fs.readFileSync(fullPath, 'utf-8').split('\n').length;
          if (lines > 250) {
            logError('STORLEKSGRÄNS ÖVERSKRIDEN', `${path.relative(ROOT_DIR, fullPath)} har ${lines} rader (max 250).`);
          }

          const fileLines = fs.readFileSync(fullPath, 'utf-8').split('\n');
          const invalidFsdImport = /from\s+['"][^'"]*\/features\/[^/]+\/(components|hooks|api|domain|doc)\//;
          if (fileLines.some(line => invalidFsdImport.test(line))) {
            logError('FSD-ÖVERTRÄDELSE', `${path.relative(ROOT_DIR, fullPath)} importerar internt från en annan domän.`);
          }
        }
      }
    };

    scanSrc(SRC_DIR);

    if (!ignoreMtime && oldestProdCodeTime !== Infinity && oldestTestTime !== Infinity && oldestTestTime > oldestProdCodeTime) {
      logError('TDD-ÖVERTRÄDELSE', 'Produktionskod påbörjades på disk innan några enhetstester skapats.');
    }

    const p4 = path.join(LAST_CYCLE_DIR, '4_producera.md');
    const t4 = getMtime(p4);
    if (!ignoreMtime && t4 > 0 && t4 < newestProdCodeTime) {
      logError('SEKVENSFEL', '4_producera.md sparades innan all källkod var färdigskriven.');
    }
  }
}

if (hasErrors) {
  console.error('\n⛔ BYGGET STOPPADES AV MEKANISK KONTROLL.\n');
  process.exit(1);
} else {
  console.log('✅ Sekvens, orientering (JSON), fasader (ADR-009), nätverk, samlokaliserad dokumentation, TDD-ordning och FSD-regler godkända.');
}