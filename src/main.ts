import * as oak from "oak";
import { join } from "std/path/mod.ts";
import { walkSync } from "std/fs/mod.ts";
import { templating } from "./core/mod.ts";
import type { PageProps } from "./core/mod.ts";

const app = new oak.Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use((ctx) => {
  const path = ctx.request.url.pathname;
  const basePath = join(`${Deno.cwd()}/pages/`);
  let data: PageProps | undefined = undefined;

  for (const entry of walkSync(basePath)) {
    if (entry.isDirectory) continue;

    const convertedPath = entry.path.replace(basePath, "").replace("\\", "/");

    if (`/${convertedPath}`.replace(".json", "") === path) {
      const stringifiedJson = Deno.readTextFileSync(entry.path);
      data = JSON.parse(stringifiedJson);
      break;
    }
  }

  if (!data) {
    throw new Error("404");
  }

  ctx.response.type = "html";
  ctx.response.body = templating(data);
});

await app.listen({ port: 8000 });
