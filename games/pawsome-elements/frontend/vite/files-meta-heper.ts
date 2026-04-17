import { join, relative, resolve } from 'path';
import { readdirSync, statSync, readFileSync } from 'fs';
import { normalizePath } from 'vite';
import { md5 } from 'hash-wasm';
import createIgnore from 'ignore';

interface TraverseFile {
  path: string;
  hash: string;
  size: number;
}

function createIsIgnored(root: string): (filePath: string) => boolean {
  const gitignorePath = resolve(root, '.gitignore');
  const ignore = createIgnore();

  if (statSync(gitignorePath).isFile()) {
    const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
    ignore.add(gitignoreContent);
  }

  return (filePath: string) => ignore.ignores(relative(root, filePath));
}

async function processFile(
  fullPath: string,
  basePathForNormalization: string,
  publicPrefix: string,
  onFile: (file: TraverseFile) => any,
) {
  const buffer = readFileSync(fullPath);
  const relativePath = normalizePath(relative(basePathForNormalization, fullPath));
  const path = normalizePath(join(publicPrefix, relativePath));
  const hash = await md5(buffer);
  onFile({ path, size: buffer.byteLength, hash });
}

async function traverseDirectory(
  absoluteDir: string,
  basePathForNormalization: string,
  publicPrefix: string,
  onFile: (file: TraverseFile) => any,
  isIgnored: (filePath: string) => boolean,
) {
  const entries = readdirSync(absoluteDir);

  for (const entry of entries) {
    const fullPath = resolve(absoluteDir, entry);

    if (isIgnored(fullPath)) continue;

    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      await traverseDirectory(fullPath, basePathForNormalization, publicPrefix, onFile, isIgnored);
    } else if (stats.isFile()) {
      await processFile(fullPath, basePathForNormalization, publicPrefix, onFile);
    }
  }
}

export async function getFilesMeta(fromDir: string, toDir: string): Promise<TraverseFile[]> {
  const root = process.cwd();
  const absoluteStaticPath = resolve(root, fromDir);
  const isIgnored = createIsIgnored(root);

  try {
    const files: TraverseFile[] = [];
    await traverseDirectory(absoluteStaticPath, absoluteStaticPath, toDir, (file) => files.push(file), isIgnored);
    return files;
  } catch (err) {
    throw new Error(`Error traversing static directory: ${err}`);
  }
}
