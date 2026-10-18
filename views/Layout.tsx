/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { PropsWithChildren } from "https://esm.sh/hono@4/jsx";
import { Header } from "./Header.tsx";
import { Footer } from "./Footer.tsx";

type LayoutProps = PropsWithChildren<{
  showHeader?: boolean;
  showFooter?: boolean;
  title?: string;
  stylesheet?: string;
}>;

export const Layout = ({
  children,
  showHeader = true,
  showFooter = true,
  title,
  stylesheet = "/styles.css",
}: LayoutProps) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <link rel="stylesheet" href={stylesheet} />
      <link
        rel="icon"
        href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><text x='0' y='.75em' font-size='200'>💬</text></svg>"
      />
    </head>
    <body>
      {showHeader && <Header title={title} />}
      {children}
      {showFooter && <Footer />}
    </body>
  </html>
);