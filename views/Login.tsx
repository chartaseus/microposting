/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { FC } from "https://esm.sh/hono@4/jsx";
import { user } from "../config.ts";

export const Login: FC = () => (
  <>
    <p>
      If you're{" "}
      {user.displayName}, you can log in with your Val Town account to post.
    </p>
    <a href="/auth/login" class="vt-login">
      <img src="/auth/logo" alt="Val Town Logo" width={20} height={20} />
      <span>Log in with Val Town</span>
    </a>
    <p>
      Not <a href="/">{user.displayName}</a>?{" "}
      <a href="https://www.val.town/x/foliage/microposting">
        Remix this Val Town project
      </a>{" "}
      to create your own microposting app.
    </p>
  </>
);