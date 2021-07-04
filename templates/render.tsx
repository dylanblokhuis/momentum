import React from "react";
import ReactDOM from "react-dom";
import Root from "../templates/root.tsx";

const root = document.getElementById("momentum");

console.log(window.location.pathname);

if (root) {
  ReactDOM.hydrate(<Root />, root);
}
