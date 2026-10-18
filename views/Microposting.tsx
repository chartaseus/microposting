/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { FC } from "https://esm.sh/hono@4/jsx";
import { raw } from "https://esm.sh/hono@4/html";
import type { Micropost } from "../types.ts";
import { Footer } from "./Footer.tsx";
import { formatDate } from "../utils.ts";

export const Microposting: FC<{ micros: Micropost[] }> = ({ micros }) => (
  <>
    {
      /* this <title> line is hoisted into the <head> of the page.
        (yes you can modify the title) */
    }
    <title>Microposting</title>

    {
      /* this is the start of the <body> part of your microposts public page.
         customize/restructure it to your heart's content. */
    }

    <header>
      <h1>microposts</h1>
      <p>
        <i>a poster posting into the void</i>
      </p>
      <nav>
        <a href="#footer">About</a> •{" "}
        <a href="https://foliage.val.run">↖ Homepage</a>
      </nav>
    </header>

    <main>
      {micros?.map((micro) => {
        return (
          <article id={micro.id.toString()}>
            {raw(micro.rendered_text)}
            <div class="metadata">
              <small>
                {micro.tags.map((tag) => "#" + tag).join(", ")}
              </small>
              <small>
                {<a href={`/${micro.id}`}>{formatDate(micro.id, "short")}</a>}
              </small>
            </div>
          </article>
        );
      })}
      {micros?.length === 100 && (
        <p>Only the most recent 100 micros are shown.</p>
      )}
    </main>

    {
      /* this is a JSX component. has the id "footer" if you want to style or link to it.
         you can use vanilla HTML <footer>, but you will lose the login-aware navigation links. */
    }
    <Footer>
      <p>
        I like posting but don't want to be on social media. you can't @ me but
        you can always <a href="mailto:not@realemail.address">email me</a>.
      </p>
    </Footer>

    {/* </body> */}
  </>
);