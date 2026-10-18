import { jsxRenderer } from "https://esm.sh/hono@4/jsx-renderer";
import { Layout } from "../views/Layout.tsx";
import "../types.ts";

// Wraps anything passed to `c.render(...)` in the shared <Layout>.
export const renderer = jsxRenderer(Layout);