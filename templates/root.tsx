import React from "react";
import { Link, Router } from "@reach/router";

import Route from "./route.tsx";

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
        <Route path={route.path} content={route.title} />
      ))}
    </Router>
  );
}
