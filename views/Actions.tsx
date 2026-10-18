/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { FC } from "https://esm.sh/hono@4/jsx";
import { useRequestContext } from "https://esm.sh/hono@4/jsx-renderer";
import type { AppEnv } from "../types.ts";

export const Actions: FC = () => {
  const c = useRequestContext<AppEnv>();
  const isOwner = c.get("isOwner");
  const loggedIn = c.get("loggedIn");
  const link = (path: string) => (c.req.path === path ? "#" : path);

  return (
    <>
      {(loggedIn && !isOwner) && (
        <p>
          <small>
            <i>
              You’re not the owner of this microposting instance.{" "}
              <a href="https://www.val.town/x/foliage/microposting">
                Remix this Val Town project
              </a>{" "}
              to create your own microposting app.
            </i>
          </small>
        </p>
      )}
      <nav class="actions">
        {isOwner
          ? (
            <>
              <a href={link("/post")}>Post</a>
              <a href={link("/manage")}>Manage</a>
              <form method="post" action="/auth/logout">
                <button type="submit">Log out</button>
              </form>
            </>
          )
          : loggedIn
          ? (
            <form method="post" action="/auth/logout">
              <button type="submit">Log out</button>
            </form>
          )
          : <a href="/login">Log in</a>}
      </nav>
    </>
  );
};