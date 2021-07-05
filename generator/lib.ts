import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { ensureFileSync } from "std/fs/mod.ts";
import { ServerLocation } from "@reach/router";

import Root from "../templates/root.tsx";
import Document, { DocumentScript } from "../templates/document.tsx";

const pages = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "hello",
    path: "/hello/",
  },
  {
    title: "Yo",
    path: "/hello/yo/",
  },
];

const encoder = new TextEncoder();

for (const page of pages) {
  const hydratableHtml = renderToString(
    createElement(ServerLocation, {
      url: page.path,
      children: createElement(Root, {
        routes: pages,
      }),
    }),
  );

  const scripts: DocumentScript[] = [
    {
      src: "/static/render.js",
      type: "module",
    },
  ];

  const html = renderToStaticMarkup(
    createElement(Document, {
      title: page.title,
      content: hydratableHtml,
      path: page.path,
      scripts: scripts,
    }),
  );

  const splitted = page.path.split("/");
  splitted.shift();

  // remove trailing slash from filePath
  if (page.path.length !== 1 && page.path.slice(page.path.length - 1) === "/") {
    splitted.pop();
  }

  let filePath;
  if (splitted[0] === "") {
    filePath = "index";
  } else {
    filePath = splitted.join("/");
  }

  let fullPath = `/${filePath}/index.html`;

  if (filePath === "index") {
    fullPath = `/index.html`;
  }

  console.log(fullPath);

  ensureFileSync(`${Deno.cwd()}/public${fullPath}`);
  Deno.writeFileSync(
    `${Deno.cwd()}/public${fullPath}`,
    encoder.encode("<!DOCTYPE html>" + html),
  );
}

ensureFileSync(`${Deno.cwd()}/public/_/routes.json`);
Deno.writeFileSync(
  `${Deno.cwd()}/public/_/routes.json`,
  encoder.encode(JSON.stringify(pages)),
);

self.close();
