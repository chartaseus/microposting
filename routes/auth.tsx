/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { Context } from "https://esm.sh/hono@4";
import type { AppEnv } from "../types.ts";
import { Login } from "../views/Login.tsx";

type Ctx = Context<AppEnv>;

function loginPage(c: Ctx) {
  if (c.get("loggedIn")) return c.redirect("/");

  return c.render(<Login />, { showFooter: false, title: "Log in" });
}

export { loginPage };