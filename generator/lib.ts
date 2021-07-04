import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { ensureFileSync } from "std/fs/mod.ts";
import Root from "../templates/root.tsx";
import Document from "../templates/document.tsx";

const pages = [
  {
    title: "Home",
    path: "/",
    data: {
      image: "https://via.placeholder.com/350x150.jpg",
    },
  },
  {
    title: "hello",
    path: "/hello",
    data: {
      content: "Hello",
    },
  },
  {
    title: "Yo",
    path: "/hello/yo",
    data: {
      content: "Yo",
    },
  },
];

for (const page of pages) {
  const hydratableHtml = renderToString(
    createElement(Root, {
      data: page.data,
      path: page.path,
    }),
  );

  const html = renderToStaticMarkup(
    createElement(Document, {
      title: page.title,
      content: hydratableHtml,
    }),
  );

  const splitted = page.path.split("/");
  splitted.shift();

  let filePath;
  if (splitted[0] === "") {
    filePath = "index";
  } else {
    filePath = splitted.join("/");
  }

  console.log(`${filePath}.html`);

  const encoder = new TextEncoder();
  ensureFileSync(`${Deno.cwd()}/public/${filePath}.html`);
  Deno.writeFileSync(
    `${Deno.cwd()}/public/${filePath}.html`,
    encoder.encode("<!DOCTYPE html>" + html),
  );

  ensureFileSync(`${Deno.cwd()}/public/page-data/${filePath}.json`);
  Deno.writeFileSync(
    `${Deno.cwd()}/public/page-data/${filePath}.json`,
    encoder.encode(JSON.stringify(page.data)),
  );
}

self.close();
