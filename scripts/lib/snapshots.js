import fs from 'fs';
import path from 'path';

export function createPreStep4Snapshots(p3cContent, snapshotDir, srcDir) {
  try {
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true });
    }
    const matches = p3cContent.match(/`([^`]+\.(tsx?|jsx?))`|([a-zA-Z0-9_\-\/]+\.(tsx?|jsx?))/g) || [];
    for (const match of matches) {
      const cleanPath = match.replace(/`/g, '').trim();
      const fullSrcPath = path.isAbsolute(cleanPath) ? cleanPath : path.join(srcDir, cleanPath.replace(/^src\//, ''));
      if (fs.existsSync(fullSrcPath) && fs.statSync(fullSrcPath).isFile()) {
        const destPath = path.join(snapshotDir, path.basename(fullSrcPath));
        fs.copyFileSync(fullSrcPath, destPath);
      }
    }
  } catch (e) {
    // Tyst snapshot
  }
}