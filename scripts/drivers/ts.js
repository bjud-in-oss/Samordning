/**
 * TYPESCRIPT & FSD DRIVRUTIN (v9.5)
 * Orkestrerare för TS/FSD-kontrollerna i scripts/lib/ts-rules.js
 */
import fs from 'fs';
import path from 'path';
import {
  verify3cDomainLimit,
  verifyFsdStructure,
  verifySrcFiles
} from '../lib/ts-rules.js';

export async function verifyTypeScriptCodebase({
  ROOT_DIR,
  SRC_DIR,
  t3c,
  logError,
  t4
}) {
  const featuresDir = path.join(SRC_DIR, 'features');
  const LAST_CYCLE_DIR = path.join(ROOT_DIR, 'doc', 'LAST_CYCLE');
  const SNAPSHOT_DIR = path.join(LAST_CYCLE_DIR, 'snapshots', 'pre_step4');
  const p3cPath = path.join(LAST_CYCLE_DIR, '3c_fil_operativ_kallkodsspecifikation.md');
  const p3cContent = fs.existsSync(p3cPath) ? fs.readFileSync(p3cPath, 'utf-8') : '';

  verify3cDomainLimit(p3cContent, logError);
  verifyFsdStructure(featuresDir, ROOT_DIR, logError);
  verifySrcFiles({
    SRC_DIR,
    ROOT_DIR,
    t3c,
    t4,
    p3cContent,
    SNAPSHOT_DIR,
    featuresDir,
    logError
  });
}