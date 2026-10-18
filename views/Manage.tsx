/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { FC } from "https://esm.sh/hono@4/jsx";
import type { Micropost } from "../types.ts";
import { Article } from "./Article.tsx";
import { PostActions } from "./PostActions.tsx";

export const Manage: FC<{ micros: Micropost[] }> = ({ micros }) => {
  return (
    <>
      <input type="checkbox" id="hidedeleted" />&nbsp;
      <label for="hidedeleted">hide deleted microposts</label>
      {micros.map((micro) => (
        <Article
          key={micro.id}
          micro={micro}
          class={micro.is_deleted ? "deleted" : undefined}
        >
          <PostActions micro={micro} />
        </Article>
      ))}
    </>
  );
};