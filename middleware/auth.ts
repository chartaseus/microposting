import { createMiddleware } from "https://esm.sh/hono@4/factory";
import { getOAuthUserData } from "https://esm.town/v/std/oauth/middleware.ts";
import type { AppEnv } from "../types.ts";
import { parseVal } from "https://esm.town/v/std/utils/index.ts";

const val = parseVal(import.meta.url);

const loadAuth = createMiddleware<AppEnv>(async (c, next) => {
  const session = await getOAuthUserData(c.req.raw);
  c.set("loggedIn", session !== null);
  c.set("isOwner", session?.user.username === val.username);
  await next();
});

const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  if (!c.get("loggedIn")) return c.redirect("/auth/login");
  if (!c.get("isOwner")) return c.text("Forbidden", 403);
  await next();
});

export { loadAuth, requireAuth };