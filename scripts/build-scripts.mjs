import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

async function build() {
  // Ensure directories exist
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  // Build service-worker
  await esbuild.build({
    entryPoints: [join(rootDir, 'background/service-worker.ts')],
    bundle: true,
    outfile: join(distDir, 'background/service-worker.js'),
    format: 'esm',
    platform: 'browser',
    target: 'chrome120',
    external: ['chrome'],
  });
  console.log('Built background/service-worker.js');

  // Build content-script
  await esbuild.build({
    entryPoints: [join(rootDir, 'content/content-script.ts')],
    bundle: true,
    outfile: join(distDir, 'content/content-script.js'),
    format: 'esm',
    platform: 'browser',
    target: 'chrome120',
    external: ['chrome'],
  });
  console.log('Built content/content-script.js');
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
