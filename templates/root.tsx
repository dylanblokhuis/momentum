import React from "react";
import { Router } from "@reach/router";

import Home from "./home.tsx";
import Page from "./page.tsx";

// const hierarchy = {
//   "home": Home,
//   "page": Page,
// };

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
      {props.routes.map((route) => {
        if (route.path === "/") {
          return (
            <Home
              key={route.path}
              path={route.path}
              content={route.title}
            />
          );
        }

        return (
          <Page key={route.path} path={route.path} content={route.title} />
        );
      })}
    </Router>
  );
}
