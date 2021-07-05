import React from "react";
import ReactDOM from "react-dom";
import Root from "../templates/root.tsx";

const root = document.getElementById("momentum");

const res = await fetch("/_/routes.json");
const routes = await res.json();

if (root) {
  ReactDOM.hydrate(
    <Root routes={routes} />,
    root,
  );
}
