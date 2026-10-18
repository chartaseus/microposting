/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { FC } from "https://esm.sh/hono@4/jsx";
import type { Micropost } from "../types.ts";

const DeleteButton: FC<{ micro: Micropost }> = ({ micro }) => (
  <>
    <button
      type="button"
      commandfor={`delete-${micro.id}`}
      command="show-modal"
    >
      Delete
    </button>
    <dialog id={`delete-${micro.id}`} closedby="any">
      <form action={`/${micro.id}/delete`} method="post">
        <p>
          Your micropost will still be in the database. You can restore it
          later.
        </p>
        <button type="submit">Confirm</button>
      </form>
    </dialog>
  </>
);

const PostActions: FC<{ micro: Micropost }> = ({ micro }) => (
  <div class="actions">
    <a href={`/${micro.id}/edit`}>Edit</a>
    {!micro.is_deleted && <DeleteButton micro={micro} />}
  </div>
);

export { PostActions };