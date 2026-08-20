export const MYPAGE_SUBJECTS = [
  "levelUp",
  "strategy",
  "jlpt",
  "jlptTest",
  "jptLevelUp",
  "jptStrategy",
  "wordToday",
  "grammarToday",
  "sentenceToday",
] as const;

export type MypageSubject = (typeof MYPAGE_SUBJECTS)[number];

export function snapshotMeans(means: unknown) {
  if (Array.isArray(means)) return means.filter(Boolean).map(String).join("\n");
  if (means == null) return "";
  return String(means);
}

export function snapshotContent(value: unknown) {
  if (value == null) return "";
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\\[rn]/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

export function recordId(item: { _id?: unknown; id?: unknown } | null | undefined) {
  const value = item?._id ?? item?.id;
  return value == null || value === "" ? "" : String(value);
}

export function asText(value: unknown) {
  if (value == null || value === "") return null;
  return String(value);
}
