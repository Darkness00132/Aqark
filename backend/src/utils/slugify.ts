export default function slugify(parts: (string | null | undefined)[]) {
  return parts
    .filter((x): x is string => Boolean(x))
    .map((p) =>
      p
        .trim()
        .normalize("NFKD")
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "")
        .toLowerCase()
    )
    .join("-")
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}
