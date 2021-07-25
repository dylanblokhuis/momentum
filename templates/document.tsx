import React from "react";

export interface DocumentProps {
  title: string;
  content: string;
  path: string;
  scripts: DocumentScript[];
}

export interface DocumentScript {
  src?: string;
  type?: "module" | undefined;
  children?: string;
}

export default function Document(
  { title, content, scripts }: DocumentProps,
) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="generator" content="momentum" />
        <title>{title}</title>
        <link
          as="fetch"
          rel="preload"
          href="/_/routes.json"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div id="momentum" dangerouslySetInnerHTML={{ __html: content }} />

        {scripts.map((script) => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            dangerouslySetInnerHTML={{ __html: script.children || "" }}
            async
          />
        ))}
      </body>
    </html>
  );
}
