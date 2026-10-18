// routes/errors.tsx
/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { Context } from "https://esm.sh/hono@4";
import type { AppEnv } from "../types.ts";

function notFound(c: Context<AppEnv>) {
  c.status(404);
  return c.render(
    <main>
      <p>You’ve strayed too far.</p>
      <p>
        <a href="/">← go home</a>
      </p>
    </main>,
    { title: "Not found" },
  );
}

function onError(err: Error, c: Context<AppEnv>) {
  console.error(err);
  return c.html(
    `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Error</title>
<link rel="stylesheet" href="/styles.css">
<p>Whoa wat iz diz?
<p><a href="/">(← go home for now?)</a>`,
    500,
  );
}

export { notFound, onError };