import type { Context } from "https://esm.sh/hono@4";
import { Marked } from "https://esm.sh/marked@18";
import type { AppEnv } from "./types.ts";
import { stringifyTags } from "./utils.ts";

// private instance, so no global marked state is shared between files
const md = new Marked({ breaks: true });

export interface PostForm {
  raw_text: string;
  rendered_text: string;
  tags: string | null; // JSON string as stored in db
  undoDelete?: string; // only present on edit form of a deleted post
}

/** parse and validate post/edit form. returns null if input unusable. */
export async function readPostForm(
  c: Context<AppEnv>,
): Promise<PostForm | null> {
  const body = await c.req.parseBody({ all: true });

  const raw_text = typeof body.raw_text === "string"
    ? body.raw_text.trim()
    : "";
  if (!raw_text) return null;

  const newTag = typeof body.newTag === "string" ? body.newTag.trim() : "";
  const tags = body.tags as string | string[] | undefined;

  return {
    raw_text,
    rendered_text: await md.parse(raw_text),
    tags: stringifyTags(tags, newTag),
    undoDelete: typeof body.undoDelete === "string"
      ? body.undoDelete
      : undefined,
  };
}