import * as esbuild from "esbuild";
import { fileURLToPath } from "node:url";
import { options as buildOptions } from "./build.js";

/** @type {esbuild.BuildOptions} */
export const devOptions = {
  ...buildOptions,
  minify: false,
  write: false,
  sourcemap: true,
};

export async function dev() {
  const context = await esbuild.context(devOptions);
  const { host, port } = await context.serve({ servedir: "www" });
  console.log(`server started on ${host}:${port}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await dev();
}
