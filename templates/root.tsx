import React from "react";
import { Router } from "@reach/router";

import Page from "./page.tsx";

interface RootProps {
  routes: Route[];
}

export interface Route {
  title: string;
  path: string;
}

export default function Root(props: RootProps) {
  return (
    <Router>
      {props.routes.map((route) => (
        <Page path={route.path} content={route.title} />
      ))}
    </Router>
  );
}
