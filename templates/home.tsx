import React from "react";

export default function Home({ content }: { path: string; content: string }) {
  return (
    <div>
      <main className="home" dangerouslySetInnerHTML={{ __html: content }} />
      <h1>Welcome to home!</h1>
    </div>
  );
}
