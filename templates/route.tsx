import React from "react";
import { Link } from "@reach/router";

export default function Route({ content }: { path: string; content: string }) {
  return (
    <div>
      <Link to="/hello">Yep</Link>
      <main className="route" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
