import * as esbuild from "esbuild";
import * as importMapPlugin from "./plugins/import-map.ts";

const decoder = new TextDecoder();
const importMapBytes = Deno.readFileSync(`${Deno.cwd()}/import_map.json`);

importMapPlugin.load(JSON.parse(decoder.decode(importMapBytes)));

await esbuild.build({
  bundle: true,
  entryPoints: [`${Deno.cwd()}/templates/render.tsx`],
  outdir: `${Deno.cwd()}/.generated/static`,
  plugins: [importMapPlugin.plugin()],
  treeShaking: true,
  format: "esm",
});

self.close();
