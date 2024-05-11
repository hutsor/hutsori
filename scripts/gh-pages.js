import { publish } from 'gh-pages';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { build } from './build.js';

export async function deploy() {
  await build();
  await promisify((cb) => publish('www', { nojekyll: true }, cb))();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await deploy();
}
