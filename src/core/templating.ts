import { renderToString } from "react-dom/server";
import document from "../templates/document.tsx";

export interface PageProps {
  title: string;
  content: string;
}

export default function (props: PageProps) {
  return renderToString(
    document(props),
  );
}
