import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { ensureFileSync } from "std/fs/mod.ts";
import Root from "../templates/root.tsx";

function document(title: string, content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <div id="momentum">${content}</div>

  <script src="/static/render.js" type="module"></script>
</body>
</html>
`;
}

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
  const content = renderToString(
    createElement(Root, {
      data: page.data,
      path: page.path,
    }),
  );

  const html = document(page.title, content);

  const splitted = page.path.split("/");

  splitted.shift();

  let filePath;
  if (splitted[0] === "") {
    filePath = "index";
  } else {
    filePath = splitted.join("/");
  }

  console.log(filePath);

  const encoder = new TextEncoder();
  ensureFileSync(`${Deno.cwd()}/.generated/${filePath}.html`);
  Deno.writeFileSync(
    `${Deno.cwd()}/.generated/${filePath}.html`,
    encoder.encode(html),
  );

  ensureFileSync(`${Deno.cwd()}/.generated/page-data/${filePath}.json`);
  Deno.writeFileSync(
    `${Deno.cwd()}/.generated/page-data/${filePath}.json`,
    encoder.encode(JSON.stringify(page.data)),
  );
}

self.close();
