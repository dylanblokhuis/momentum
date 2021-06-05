import React from "react"
import type { PageProps } from "../core/templating.ts"

export default function Document(props: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
      </head>
      <body>
        <h1>{props.title}</h1>
        <p>{props.content}</p>
      </body>
    </html>
  )
}
