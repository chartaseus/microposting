import { user } from "./config.ts";

function stringifyTags(tags: string[] | string | undefined, newTag: string) {
  const unique = [
    ...new Set(
      [tags ?? [], newTag]
        .flat()
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
  return unique.length ? JSON.stringify(unique) : null;
}

/**
 * Formats a UTC date string or Unix timestamp using the user's timezone.
 *
 * @param utcOrUnix - A UTC date string or Unix timestamp in seconds.
 * @param format - `"short"` returns the date only; `"long"` returns the date and time. Defaults to `"long"`.
 * @returns The formatted date, with the time included only for `"long"`.
 */
function formatDate(
  utcOrUnix: string | number,
  format: "short" | "long" = "long",
) {
  if (typeof utcOrUnix === "number") utcOrUnix = utcOrUnix * 1000;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    ...(format === "long" ? { timeStyle: "medium" } : {}),
    timeZone: user.timezone,
  }).format(new Date(utcOrUnix));
}

export { formatDate, stringifyTags };