import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'dist');

async function build() {
  if (!existsSync(srcDir)) {
    mkdirSync(srcDir, { recursive: true });
  }

  // Build service-worker
  await esbuild.build({
    entryPoints: [join(rootDir, 'background/service-worker.ts')],
    bundle: true,
    outfile: join(srcDir, 'background/service-worker.js'),
    format: 'esm',
    platform: 'browser',
    target: 'chrome120',
    external: ['chrome'],
    alias: {
      '@': join(rootDir, 'src'),
    },
  });
  console.log('Built background/service-worker.js');

  // Build content-script
  await esbuild.build({
    entryPoints: [join(rootDir, 'content/content-script.ts')],
    bundle: true,
    outfile: join(srcDir, 'content/content-script.js'),
    format: 'esm',
    platform: 'browser',
    target: 'chrome120',
    external: ['chrome'],
  });
  console.log('Built content/content-script.js');

  // Copy manifest
  const manifest = JSON.parse(readFileSync(join(rootDir, 'public/manifest.json'), 'utf-8'));
  writeFileSync(join(srcDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Copied manifest.json');

  // Copy icons
  const iconsDir = join(srcDir, 'icons');
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
  }
  [16, 48, 128].forEach(size => {
    copyFileSync(
      join(rootDir, 'public/icons', `icon${size}.png`),
      join(iconsDir, `icon${size}.png`)
    );
    console.log(`Copied icons/icon${size}.png`);
  });
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
