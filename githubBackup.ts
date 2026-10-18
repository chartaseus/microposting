// githubBackup.ts — back up this val's files to a GitHub repo, one commit per change.
//
// Copy this single file into any val. It reads ALL of the val's own files via the
// std/utils helpers, diffs them against the target repo's HEAD, and — only when
// something changed — pushes one commit (adds + edits + deletions together) using
// GitHub's git data API (blobs -> tree -> commit -> ref).
//
// Setup — environment variables on this val:
//   GITHUB_TOKEN  (required) classic PAT with `repo` scope, or fine-grained token
//                 with Contents read+write on the target repo
//   GITHUB_REPO   (required) "owner/name", e.g. "stevekrouse/my-backup"
//   GITHUB_BRANCH (optional) defaults to "main". The branch must already exist —
//                 create the repo initialized (e.g. with a README).
// No Val Town API token is needed: the std/utils helpers below read this val's own
// identity and files using the val-scoped token Val Town injects automatically.
//
// Make this file a Cron trigger (e.g. every hour) for scheduled backups, or run it
// manually with the Run button. Runs are idempotent: no changes => no commit.

import { listFiles, readFile } from "https://esm.town/v/std/utils/index.ts";

const GH_API = "https://api.github.com";

async function gh(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(
      `GitHub ${init.method ?? "GET"} ${path} -> ${res.status}: ${await res
        .text()}`,
    );
  }
  return res.json();
}

// --- Read this val's own files -------------------------------------------------
// std/utils figures out which val we are from import.meta.url and authenticates
// with the val-scoped token Val Town injects, so reading our own identity and
// files needs no API token. `listFiles` is recursive and handles pagination;
// `readFile` returns the raw file contents as a string.
async function readValFile(path: string): Promise<Uint8Array> {
  return new TextEncoder().encode(await readFile(path, import.meta.url));
}

// --- Git plumbing --------------------------------------------------------------
// sha1("blob <len>\0" + bytes) — computing blob shas locally lets us diff against
// the repo tree without uploading anything.
async function gitBlobSha(bytes: Uint8Array): Promise<string> {
  const header = new TextEncoder().encode(`blob ${bytes.length}\0`);
  const buf = new Uint8Array(header.length + bytes.length);
  buf.set(header);
  buf.set(bytes, header.length);
  const digest = await crypto.subtle.digest("SHA-1", buf);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

// --- Main ----------------------------------------------------------------------
export async function backup(): Promise<string> {
  const repo = Deno.env.get("GITHUB_REPO");
  if (!repo) throw new Error("Set the GITHUB_REPO env var (owner/name)");
  const branch = Deno.env.get("GITHUB_BRANCH") ?? "main";

  // 1. Snapshot this val: every file's bytes + its git blob sha
  const valFiles = (await listFiles(import.meta.url)).filter((f) =>
    f.type !== "directory"
  );
  const entries = await Promise.all(
    valFiles.map(async (f) => {
      const bytes = await readValFile(f.path);
      return { path: f.path, bytes, sha: await gitBlobSha(bytes) };
    }),
  );

  // 2. Read the repo's current HEAD tree
  const ref = await gh(`/repos/${repo}/git/ref/heads/${branch}`).catch((e) => {
    throw new Error(
      `Could not read heads/${branch} — does the branch exist? ` +
        `Create the repo initialized (with a README). Original error: ${e.message}`,
    );
  });
  const headSha: string = ref.object.sha;
  const headCommit = await gh(`/repos/${repo}/git/commits/${headSha}`);
  const headTree = await gh(
    `/repos/${repo}/git/trees/${headCommit.tree.sha}?recursive=1`,
  );
  if (headTree.truncated) {
    throw new Error(
      "Repo tree listing truncated (>100k entries) — cannot diff safely",
    );
  }
  const repoShas = new Map<string, string>(
    headTree.tree.filter((t: any) => t.type === "blob").map((
      t: any,
    ) => [t.path, t.sha]),
  );

  // 3. Diff: anything to do?
  const changed = entries.filter((e) => repoShas.get(e.path) !== e.sha);
  const deleted = [...repoShas.keys()].filter(
    (p) => !entries.some((e) => e.path === p),
  );
  if (changed.length === 0 && deleted.length === 0) {
    return `up to date with ${repo}@${headSha.slice(0, 7)} — no commit`;
  }

  // 4. Upload only the changed blobs
  for (const e of changed) {
    const blob = await gh(`/repos/${repo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: toBase64(e.bytes), encoding: "base64" }),
    });
    if (blob.sha !== e.sha) {
      throw new Error(
        `blob sha mismatch for ${e.path}: ${blob.sha} != ${e.sha}`,
      );
    }
  }

  // 5. Write the FULL tree (no base_tree): omitted paths are deletions
  const tree = await gh(`/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      tree: entries.map((e) => ({
        path: e.path,
        mode: "100644",
        type: "blob",
        sha: e.sha,
      })),
    }),
  });

  // 6. One commit on top of HEAD, then fast-forward the branch
  const summary =
    `val town sync: ${changed.length} changed, ${deleted.length} deleted`;
  const commit = await gh(`/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: `${summary}\n\nsource: ${import.meta.url}`,
      tree: tree.sha,
      parents: [headSha],
    }),
  });
  // force:false — if someone pushed between our HEAD read and now, this 422s
  // and the next run will redo the diff against the new HEAD.
  await gh(`/repos/${repo}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  return `pushed ${commit.sha} to ${repo}@${branch}: ${summary}`;
}

// Cron entrypoint (also fine to run manually)
export default async function () {
  const result = await backup();
  console.log(result);
  return result;
}