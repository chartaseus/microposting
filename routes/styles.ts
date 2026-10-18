import type { Context } from "https://esm.sh/hono@4";
import type { AppEnv } from "../types.ts";
import { serveFile } from "https://esm.town/v/std/utils/index.ts";

export async function styles(c: Context<AppEnv>) {
  return await serveFile(c.req.path.replace("/", "/public/"));
}