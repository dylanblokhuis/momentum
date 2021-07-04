import * as oak from "oak";

async function runGenerator() {
  console.log("Running generator");

  const generator = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-write",
      "--allow-read",
      "--import-map=import_map.json",
      "--unstable",
      "generator/lib.ts",
    ],
  });

  await generator.status();
}

await runGenerator();

async function runBundler() {
  console.log("Running bundler");

  const generator = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-write",
      "--allow-read",
      "--allow-env",
      "--allow-run",
      "--import-map=import_map.json",
      "--unstable",
      "bundler/lib.ts",
    ],
  });

  await generator.status();
}

await runBundler();

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

// Static
app.use(async (context) => {
  if (context.request.url.pathname === "/_/regenerate") {
    await runGenerator();
    await runBundler();

    context.response.body = "Generated new static files";
    return;
  }

  try {
    await oak.send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/.generated`,
      index: "index.html",
      extensions: ["html"],
    });
  } catch (error) {
    console.error(error);
    context.response.status = 404;
    context.response.body = "Not found: 404";
  }
});

console.log("Server listening at port 3000");
await app.listen({ port: 3000 });
