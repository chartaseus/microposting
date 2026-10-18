import sqlite from "https://esm.town/v/std/sqlite/main.ts";
import type { Micropost } from "../types.ts";

const TABLE = "microposts";
const COLUMNS = "id, raw_text, rendered_text, tags, modified, is_deleted";

// returns false if a post already exists within the last ~2 seconds.
// intentional: swallows double-click submits, the first post is already saved.
// (the window is 2s, not 1s, so a double click straddling a second boundary is still caught)
async function addPost(
  { id, raw_text, rendered_text, tags }: {
    id: number;
    raw_text: string;
    rendered_text: string;
    tags: string | null;
  },
): Promise<boolean> {
  const { rows } = await sqlite.execute({
    sql: `INSERT INTO ${TABLE} (id, raw_text, rendered_text, tags)
          SELECT :id, :raw_text, :rendered_text, :tags
          WHERE NOT EXISTS (SELECT 1 FROM ${TABLE} WHERE id >= :id - 1)
          RETURNING id;`,
    args: { id, raw_text, rendered_text, tags },
  });

  return rows.length > 0;
}

/** get all undeleted microposts */
async function getLivePosts(): Promise<Micropost[]> {
  const { rows } = await sqlite.execute(
    `SELECT ${COLUMNS}
      FROM ${TABLE}
      WHERE is_deleted = FALSE
      ORDER BY id DESC
      LIMIT 100;`,
  );

  return rows.map(_toMicropost);
}

async function getPostById(
  id: number,
): Promise<Micropost | undefined> {
  const { rows } = await sqlite.execute({
    sql: `SELECT ${COLUMNS} FROM ${TABLE} WHERE id = ?;`,
    args: [id],
  });
  return rows[0] ? _toMicropost(rows[0]) : undefined;
}

/** get all microposts including deleted ones */
async function getAllPosts(): Promise<Micropost[]> {
  const { rows } = await sqlite.execute(
    `SELECT ${COLUMNS} FROM ${TABLE} ORDER BY id DESC;`,
  );
  return rows.map(_toMicropost);
}

async function editPost(
  { id, raw_text, rendered_text, tags, modified, is_deleted }: {
    id: number;
    raw_text: string;
    rendered_text: string;
    tags: string | null;
    modified: number;
    is_deleted: 0 | 1;
  },
): Promise<boolean> {
  const { rows } = await sqlite.execute({
    sql: `UPDATE ${TABLE} 
            SET raw_text = :raw_text, 
              rendered_text = :rendered_text, 
              tags = :tags, 
              modified = :modified,
              is_deleted = :is_deleted
            WHERE id = :id 
            RETURNING id, modified;`,
    args: { id, raw_text, rendered_text, tags, modified, is_deleted },
  });

  return rows.length > 0;
}

async function softDeletePost(id: number) {
  const { rows } = await sqlite.execute({
    sql: `UPDATE ${TABLE} 
            SET is_deleted = TRUE 
            WHERE id = ? 
            RETURNING is_deleted;`,
    args: [id],
  });

  return rows.length > 0;
}

async function getTags() {
  const { rows } = await sqlite.execute(
    `SELECT DISTINCT tag_item.value AS tag
      FROM ${TABLE}, json_each(${TABLE}.tags) AS tag_item
      WHERE tags IS NOT NULL
      ORDER BY tag;`,
  );

  return rows.map((row) => row.tag as string);
}

function _toMicropost(row: Record<string, unknown>): Micropost {
  return {
    id: Number(row.id),
    raw_text: String(row.raw_text),
    rendered_text: String(row.rendered_text ?? ""),
    tags: row.tags == null ? [] : JSON.parse(String(row.tags)),
    modified: row.modified == null ? null : Number(row.modified),
    is_deleted: row.is_deleted ? 1 : 0,
  };
}

export {
  addPost,
  editPost,
  getAllPosts,
  getLivePosts,
  getPostById,
  getTags,
  softDeletePost,
};