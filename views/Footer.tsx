/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { Child, FC } from "https://esm.sh/hono@4/jsx";
import { Actions } from "./Actions.tsx";

export const Footer: FC<{ children?: Child }> = ({ children }) => (
  <footer id="footer">
    {children}
    <Actions />
  </footer>
);