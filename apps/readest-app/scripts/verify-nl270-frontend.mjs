import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';

const outputDirectory = resolve(process.argv[2] ?? 'out');
const staticDirectory = resolve(outputDirectory, '_next/static');
const requiredMarkers = [
  '新建无锚点对话',
  '针对选中文字提问',
  'data-selection-action-menu',
  'foundation-selection',
];

const listFiles = (directory) =>
  readdirSync(directory)
    .flatMap((name) => {
      const path = resolve(directory, name);
      return statSync(path).isDirectory() ? listFiles(path) : [path];
    })
    .sort();

const staticFiles = listFiles(staticDirectory);
for (const marker of requiredMarkers) {
  if (!staticFiles.some((path) => readFileSync(path).includes(Buffer.from(marker)))) {
    throw new Error(`Missing frontend marker: ${marker}`);
  }
  console.log(`Frontend marker: ${marker}`);
}

const outputFiles = listFiles(outputDirectory);
const frontendHash = createHash('sha256');
for (const path of outputFiles) {
  const fileHash = createHash('sha256').update(readFileSync(path)).digest('hex');
  const normalizedPath = relative(outputDirectory, path).split(sep).join('/');
  frontendHash.update(`${fileHash}  ${normalizedPath}\n`);
}

console.log(`Frontend files: ${outputFiles.length}`);
console.log(`Frontend SHA256: ${frontendHash.digest('hex')}`);
