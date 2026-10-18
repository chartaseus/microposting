/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { Child, FC } from "https://esm.sh/hono@4/jsx";
import { raw } from "https://esm.sh/hono@4/html";
import { formatDate } from "../utils.ts";
import type { Micropost } from "../types.ts";

export const Article: FC<{
  micro: Micropost;
  class?: string;
  children?: Child;
}> = ({ micro, class: className, children }) => {
  const date = formatDate(micro.id);

  return (
    <>
      <article id={micro.id.toString()} class={className}>
        {raw(micro.rendered_text)}
        <div class="micropost-footer">
          <div class="metadata">
            <small>
              {micro.tags.map((tag) => "#" + tag).join(", ")}
            </small>
            <small>
              {micro.is_deleted ? date : <a href={`/${micro.id}`}>{date}</a>}
            </small>
          </div>
          {children}
        </div>
      </article>
    </>
  );
};