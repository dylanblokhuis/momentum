import * as oak from "oak";
import { blue, bold, cyan, green, magenta } from "std/fmt/colors.ts";
import { join } from "std/path/mod.ts";

const installedLocation = join(import.meta.url.replace("file:///", ""), "..");

async function runGenerator() {
  console.log(magenta("Running generator"));

  const generator = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-write",
      "--allow-read",
      `--import-map=${join(installedLocation, "./import_map.json")}`,
      "--unstable",
      `${join(installedLocation, "./generator/lib.ts")}`,
    ],
    stdout: "piped",
  });

  const outputBytes = await generator.output();

  const decoder = new TextDecoder();
  const output = decoder.decode(outputBytes);

  const lines = output.split("\n");
  lines.pop();

  for (const line of lines) {
    console.log(`${magenta("[Generator]")} - ${bold(line)}`);
  }
}

async function runBundler() {
  console.log(blue("Running bundler"));

  const generator = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-write",
      "--allow-read",
      "--allow-env",
      "--allow-net",
      "--allow-run",
      "--unstable",
      `--import-map=${join(installedLocation, "./import_map.json")}`,
      `${join(installedLocation, "./bundler/lib.ts")}`,
    ],
    stdout: "piped",
  });
  const outputBytes = await generator.output();

  const decoder = new TextDecoder();
  const output = decoder.decode(outputBytes);

  const lines = output.split("\n");
  lines.pop();

  for (const line of lines) {
    console.log(`${blue("[Bundler]")} - ${bold(line)}`);
  }
}

const app = new oak.Application();

// Logger
app.use(async (context, next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
});

// Response Time
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Static
app.use(async (context) => {
  if (context.request.url.pathname === "/_/regenerate") {
    await Promise.all([runGenerator(), runBundler()]);

    context.response.body = "regenerated!";
    return;
  }

  try {
    await oak.send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/public/`,
      index: "index.html",
      extensions: ["html"],
    });
  } catch (_error) {
    // console.error(error);
    context.response.status = 404;
    context.response.body = "Not found: 404";
  }
});

await Promise.all([runGenerator(), runBundler()]);

console.log(green("Server listening at port 3000"));
await app.listen({ port: 3000 });
