import * as esbuild from 'esbuild';
import { fileURLToPath } from 'node:url';

/** @type {esbuild.BuildOptions} */
export const options = {
  entryPoints: ['src/main.tsx'],
  outdir: 'www/js',
  format: 'esm',
  minify: true,
  bundle: true,
};

export async function build() {
  await esbuild.build(options);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await build();
}
