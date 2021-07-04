import * as oak from "oak";
import { blue, bold, cyan, green, magenta } from "std/fmt/colors.ts";

async function runGenerator() {
  console.log(magenta("Running generator"));

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

await runGenerator();

async function runBundler() {
  console.log(blue("Running bundler"));

  const generator = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-write",
      "--allow-read",
      "--allow-env",
      "--allow-run",
      "--import-map=import_map.json",
      "bundler/lib.ts",
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

await runBundler();

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

console.log(green("Server listening at port 3000"));
await app.listen({ port: 3000 });
