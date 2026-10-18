/** @jsxImportSource https://esm.sh/hono@4/jsx */
import type { FC } from "https://esm.sh/hono@4/jsx";
import type { Micropost } from "../types.ts";

export const Form: FC<{
  micro?: Micropost;
  tags: string[];
  action: string;
}> = ({ micro, tags, action }) => {
  const { raw_text: rawText = "", is_deleted: isDeleted } = micro ?? {};
  const postTags = new Set(micro?.tags ?? []);
  const tagOptions = tags.map((tag) => (
    <option key={tag} selected={postTags.has(tag)}>{tag}</option>
  ));

  return (
    <main>
      <form method="post" action={action}>
        {isDeleted === 1
          ? (
            <fieldset>
              <legend>Undo delete?</legend>
              <label>
                <input
                  type="radio"
                  name="undoDelete"
                  value="1"
                  checked
                />{" "}
                Yes
              </label>{" "}
              <label>
                <input
                  type="radio"
                  name="undoDelete"
                  value="0"
                />{" "}
                No
              </label>
            </fieldset>
          )
          : ""}
        <fieldset>
          <legend>What’s on your mind?</legend>
          <textarea
            name="raw_text"
            spellCheck="true"
            rows={10}
            required
          >
            {rawText}
          </textarea>
        </fieldset>
        <fieldset>
          <legend>Tags</legend>
          {tags.length
            ? (
              <select
                multiple
                name="tags"
                id="tags"
                size={tags.length > 3 ? 3 : tags.length}
                title="ℹ️ Hold Ctrl to select multiple tags"
              >
                {tagOptions}
              </select>
            )
            : ""}
          <label for="newtag">New tag:</label>
          <input type="text" id="newtag" name="newTag" />
        </fieldset>
        <button type="submit">Send ʕง-ᴥ-ʔง</button>
      </form>
    </main>
  );
};