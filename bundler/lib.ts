import * as esbuild from "esbuild";
import { join } from "std/path/mod.ts";
import { existsSync } from "std/fs/mod.ts";

import * as importMapPlugin from "./plugins/import-map.ts";

/**
 * Users have the option use overwrite, so this functions checks that.
 */
function getPathWithFallback(relativePath: string): string {
  if (existsSync(join(Deno.cwd(), relativePath))) {
    return join(Deno.cwd(), relativePath);
  }

  const installedLocation = join(
    import.meta.url.replace("file:///", ""),
    "..",
    "..",
  );

  return join(installedLocation, relativePath);
}

const decoder = new TextDecoder();
const importMapBytes = Deno.readFileSync(
  getPathWithFallback("./import_map.json"),
);

importMapPlugin.load(JSON.parse(decoder.decode(importMapBytes)));

const output = await esbuild.build({
  entryPoints: [getPathWithFallback("./templates/render.tsx")],
  outdir: join(Deno.cwd(), "./public/static"),
  plugins: [
    importMapPlugin.plugin(),
  ],
  bundle: true,
  // minify: true,
  platform: "neutral",
  treeShaking: true,
  splitting: true,
  format: "esm",
});

console.log(output);

esbuild.stop();
self.close();
