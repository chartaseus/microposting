/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { FC } from "https://esm.sh/hono@4/jsx";

export const Header: FC<{ title?: string }> = ({ title }) => (
  <header id="top">
    <title>{title ? `Microposting | ${title}` : "Microposting"}</title>
    <h1>
      <a href="/">Microposting</a>
      {title && ` / ${title}`}
    </h1>
  </header>
);