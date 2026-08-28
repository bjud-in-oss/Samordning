import { execSync } from 'child_process';
import { logError } from './utils.js';

export function verifyGitProtectedFiles(rootDir, driverLang, state) {
  const protectedFiles = [
    'scripts/verify-architecture.js',
    `scripts/drivers/${driverLang}.js`,
    'doc/AGENTS.md'
  ];

  for (const relPath of protectedFiles) {
    try {
      const diffOutput = execSync(`git diff HEAD -- "${relPath}"`, { cwd: rootDir, encoding: 'utf-8' }).trim();
      if (diffOutput) {
        logError('INSTRUKTIONSMANIPULERING (GIT)', `Filen "${relPath}" har redigerats under cykeln. Alla regeländringar kräver en godkänd git commit.`, state);
      }
    } catch (e) {
      logError('GIT-VERIFIERINGSFEL', `Kunde inte granska "${relPath}" mot Git HEAD.`, state);
    }
  }
}