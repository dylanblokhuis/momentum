import React from "react";
import ReactDOM from "react-dom";
import Root from "../templates/root.tsx";

const root = document.getElementById("momentum");

async function load() {
  const res = await fetch("/_/routes.json");
  const routes = await res.json();

  if (root) {
    (ReactDOM as any).hydrateRoot(
      root,
      <Root routes={routes} />,
    );
  }
}

load();
