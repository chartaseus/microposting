import { Hono } from "https://esm.sh/hono@4";
import type { AppEnv } from "./types.ts";
import { secureHeaders } from "https://esm.sh/hono@4/secure-headers";
import { renderer } from "./middleware/renderer.ts";
import { trimTrailingSlash } from "https://esm.sh/hono@4/trailing-slash";
import { styles } from "./routes/styles.ts";
import { microposting } from "./routes/microposting.tsx";
import { notFound, onError } from "./routes/errors.tsx";
import { oauthMiddleware } from "https://esm.town/v/std/oauth/middleware.ts";
import { loadAuth } from "./middleware/auth.ts";
import { loginPage } from "./routes/auth.tsx";

const app = new Hono<AppEnv>();

app.use(
  "*",
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      imgSrc: ["data:", "https:"],
      mediaSrc: ["https:"],
      frameSrc: ["https:"],
      baseUri: ["'none'"],
      formAction: ["'self'"],
    },
    xFrameOptions: false,
  }),
);

app.get("/:filename{.+\\.css}", styles);

app.use("*", loadAuth);
app.use("*", renderer);
app.use(trimTrailingSlash());

app.route("/", microposting);

app.get("/login", loginPage);

app.notFound(notFound);
app.onError(onError);

export default oauthMiddleware(app.fetch);