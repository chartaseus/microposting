# Microposting

A single-user microblogging (a.k.a. microposting) app hosted in
[Val Town](https://www.val.town). Write short posts (called "micropost") in
Markdown, and share them on a public page under `YOUR-SUBDOMAIN.val.run` (free)
or a custom domain (Val Town Pro).

## Features

- Write microposts in Markdown. You can embed images, video, audio and iframes
  from external sources.
- Add multiple tags to a micropost.
- Permalink for every individual micropost.
- Customizable structure and styles.
- Private interface to edit, soft-delete and restore microposts. Soft-deleting
  removes a post from the public pages but keeps it in the database. You can
  delete a post permanently using Val Town's SQLite UI.

## Setup

1. Create a Val Town account if you haven't, then Remix this project.
1. Create the database table (see [Database setup](#database-setup)).
1. Set an encryption key for logins (see [Authentication](#authentication)).
1. Set your display name and timezone in [`config.ts`](config.ts) (see
   [Configuration](#configuration)).

After all of these are set up, you can visit your public URL (find it on the
green ribbon in [`main.ts`](main.ts). You can also
[customize your subdomain](https://docs.val.town/vals/http/custom-subdomains).)
Once you log in, you can then use **Post** and **Manage** to write and manage
your microposts.

## Database setup

For the app to work, you need to create the `microposts` table where your
microposts will be stored:

1. Open [`database/migrations.ts`](database/migrations.ts) in the Val Town
   editor.
2. Click **Run**.

You only need to do this once, but nothing will break if you accidentally run it
more than once.

## Authentication

Logging in uses [Val Town OAuth](https://www.val.town/x/std/oauth): you log in
with your Val Town account, so there is no password to create or store. Anyone
with a Val Town account can complete the login, but only you can post and manage
microposts. Everyone else gets a "Forbidden" page.

### `OAUTH_STATE_ENCRYPTION_KEY` (recommended)

Login sessions are stored in an encrypted cookie. The app works without this
variable, but setting it makes cold starts faster. Without it, the key is
auto-generated and read from Val Town Blob storage on every cold start.

Get a random string from
[generate-random-signing-key.val.run](https://generate-random-signing-key.val.run/).
Copy the string into `OAUTH_STATE_ENCRYPTION_KEY` (← click to go to the
Environment Variables setting).

### Notes

- Login sessions last 30 days.
- Changing `OAUTH_STATE_ENCRYPTION_KEY` logs you out everywhere.
- The key is a secret: save it in your val's Environment Variables rather than
  putting it in the code.

## Configuration

Set your display name and timezone in [`config.ts`](config.ts):

```ts
export const user = {
  timezone: "Asia/Jakarta", // IANA timezone, used to display post dates
  displayName: "your-name",
};
```

## Customizing

The public front page and individual micropost view are meant to be made your
own.

- **Header, footer, structure:** edit
  [`views/Microposting.tsx`](views/Microposting.tsx).
- **Styles:** edit [`public/microposting.css`](public/microposting.css). You can
  completely replace the content with your own CSS.