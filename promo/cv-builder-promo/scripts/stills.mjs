// Usage: node scripts/stills.mjs <compositionId> <outDir> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [id, outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id});
for (const f of frames) {
  const output = path.resolve(outDir, `${id}-${String(f).padStart(4, '0')}.jpg`);
  await renderStill({serveUrl, composition, frame: Number(f), output, imageFormat: 'jpeg', jpegQuality: 85});
  console.log(output);
}
