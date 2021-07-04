import React from "react";

interface DocumentProps {
  title: string;
  content: string;
}

export default function Document({ title, content }: DocumentProps) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body>
        <div id="momentum" dangerouslySetInnerHTML={{ __html: content }} />

        <script src="/static/render.js" type="module" />
      </body>
    </html>
  );
}
