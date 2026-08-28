import fs from 'fs';
import path from 'path';

export function logError(title, message, state) {
  console.error(`\n❌ [MEKANISK SPÄRR v9.5] ${title}`);
  console.error(`   ${message}`);
  state.hasErrors = true;
}

export function getMtime(filePath) {
  return fs.existsSync(filePath) ? fs.statSync(filePath).mtimeMs : 0;
}

export function readFile(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

export function detectLanguageDriver(rootDir) {
  if (fs.existsSync(path.join(rootDir, 'go.mod'))) return 'go';
  if (fs.existsSync(path.join(rootDir, 'Cargo.toml'))) return 'rust';
  if (fs.existsSync(path.join(rootDir, 'pyproject.toml')) || fs.existsSync(path.join(rootDir, 'requirements.txt'))) return 'python';
  return 'ts';
}