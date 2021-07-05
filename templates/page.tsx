import React from "react";

export default function Route({ content }: { path: string; content: string }) {
  return (
    <div>
      <main className="route" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
