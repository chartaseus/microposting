/** @jsxImportSource https://esm.sh/hono@4/jsx */
import { Hono } from "https://esm.sh/hono@4";
import type { Context } from "https://esm.sh/hono@4";
import type { AppEnv } from "../types.ts";
import { requireAuth } from "../middleware/auth.ts";
import { readPostForm } from "../postForm.ts";
import {
  addPost,
  editPost,
  getAllPosts,
  getLivePosts,
  getPostById,
  getTags,
  softDeletePost,
} from "../database/queries.ts";
import { Article } from "../views/Article.tsx";
import { Form } from "../views/Form.tsx";
import { Microposting } from "../views/Microposting.tsx";
import { Manage } from "../views/Manage.tsx";

type Ctx = Context<AppEnv>;

async function frontPage(c: Ctx) {
  return c.render(
    <Microposting micros={await getLivePosts()} />,
    { showHeader: false, showFooter: false, stylesheet: "/microposting.css" },
  );
}

async function microPage(c: Ctx) {
  const id = Number(c.req.param("id"));
  const micro = await getPostById(id);
  if (!micro || micro.is_deleted) return c.notFound();

  return c.render(<Article micro={micro} />, {
    title: "μ",
    stylesheet: "/microposting.css",
  });
}

async function postPage(c: Ctx) {
  return c.render(<Form tags={await getTags()} action="/post" />, {
    title: "Post",
  });
}

async function post(c: Ctx) {
  const form = await readPostForm(c);
  if (!form) return c.text("No posting empty micropost, I'm afraid", 400);

  await addPost({
    id: Math.floor(Date.now() / 1000),
    raw_text: form.raw_text,
    rendered_text: form.rendered_text,
    tags: form.tags,
  });

  return c.redirect("/");
}

async function managePage(c: Ctx) {
  return c.render(<Manage micros={await getAllPosts()} />, { title: "Manage" });
}

async function editPage(c: Ctx) {
  const id = parseInt(c.req.param("id") ?? "");
  const micro = await getPostById(id);
  if (!micro) return c.notFound();
  const tags = await getTags();
  return c.render(
    <Form
      micro={micro}
      tags={tags}
      action={`/${id}/edit`}
    />,
    { title: "Edit" },
  );
}

async function edit(c: Ctx) {
  const id = Number(c.req.param("id"));
  const form = await readPostForm(c);
  if (!form) return c.text("No posting empty micropost, I'm afraid", 400);

  // the form only shows "Undo delete?" radio on deleted posts.
  // "1" = yes, restore it; "0" = no, keep it deleted. absent = a live post
  const is_deleted = form.undoDelete === "0" ? 1 : 0;

  const updated = await editPost({
    id,
    raw_text: form.raw_text,
    rendered_text: form.rendered_text,
    tags: form.tags,
    modified: Math.floor(Date.now() / 1000),
    is_deleted,
  });
  if (!updated) return c.notFound();

  return c.redirect(`/manage#${id}`);
}

async function softDelete(c: Ctx) {
  const id = Number(c.req.param("id"));
  if (!(await softDeletePost(id))) return c.notFound();
  return c.redirect(`/manage#${id}`);
}

// routing

const ID = "/:id{[0-9]+}";

const microposting = new Hono<AppEnv>();

microposting.get("/", frontPage);
microposting.get(ID, microPage);

microposting.get("/post", requireAuth, postPage);
microposting.post("/post", requireAuth, post);
microposting.get("/manage", requireAuth, managePage);
microposting.get(`${ID}/edit`, requireAuth, editPage);
microposting.post(`${ID}/edit`, requireAuth, edit);
microposting.post(`${ID}/delete`, requireAuth, softDelete);

export { microposting };