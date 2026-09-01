import {
  escapeRegex,
  normalizeAdminKeyword,
  stripVirtualAdminPayloadKeys,
} from "@/app/lib/admin-security";

export type AdminFieldType = "text" | "number" | "textarea" | "json";

export type AdminFieldConfig = {
  key: string;
  type: AdminFieldType;
  required?: boolean;
  rows?: number;
};

export type AdminFilterField = {
  key: string;
  labelKey?: string;
  /** exact: 일치, contains: 부분 검색 (기본 exact) */
  match?: "exact" | "contains";
  /** contains 검색 시 DB 필드 (기본 key) */
  searchKeys?: string[];
};

export type AdminTableMeta = {
  listColumns: string[];
  filterFields?: AdminFilterField[];
  listWhere?: Record<string, unknown>;
  sort: Record<string, 1 | -1>;
  fields: AdminFieldConfig[];
  defaultValues?: Record<string, unknown>;
};

/** 키워드 검색 대상 DB 컬럼 (테이블별 전체 텍스트 필드) */
export const ADMIN_KEYWORD_SEARCH_FIELDS: Record<string, string[]> = {
  code: ["code", "name"],
  code_detail: [
    "code",
    "key",
    "value",
    "valueLocaleJa",
    "valueLocaleEn",
    "valueLocaleCn",
    "valueLocaleMy",
    "classification",
  ],
  word_today: [
    "level",
    "year",
    "study",
    "word",
    "read",
    "means",
    "wordLocaleEn",
    "wordLocaleCn",
    "wordLocaleMy",
    "sentence",
    "sentence_read",
    "sentence_translate",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
    "keyword",
    "questionText",
    "speaker",
  ],
  sentence_today: [
    "level",
    "year",
    "study",
    "word",
    "read",
    "means",
    "sentence",
    "sentence_read",
    "sentence_translate",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
    "keyword",
    "questionText",
    "speaker",
  ],
  grammar_today: [
    "level",
    "year",
    "study",
    "sentence",
    "sentence_read",
    "sentence_translate",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
    "questionText",
    "speaker",
  ],
  jlpt: [
    "year",
    "month",
    "level",
    "classification",
    "questionNo",
    "questionContent",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "sentenceTranslation",
    "questionType",
  ],
  word: ["type", "level", "word", "read"],
  jpt: [
    "level",
    "part",
    "year",
    "classification",
    "questionGroupType",
    "questionContent",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "questionType",
    "questionNo",
    "sentenceTranslation",
    "sentenceReading",
    "speaker",
  ],
  jpt_word: ["type", "level", "word", "read"],
  level_up: [
    "year",
    "level",
    "classification",
    "questionContent",
    "questionContentOrg",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "questionGroupType",
    "questionType",
    "sentenceTranslation",
    "sentenceReading",
    "speaker",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
  ],
  jlpt_test: [
    "level",
    "test",
    "classification",
    "questionContent",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "questionNoLabel",
    "questionType",
    "sentenceTranslation",
    "sentenceReading",
    "sentenceEn",
    "sentenceCn",
  ],
};

export type AdminKeywordRelationSearch = {
  relation: string;
  field: string;
};

/** JSON 하위 데이터(관련 테이블) 키워드 검색 */
export const ADMIN_KEYWORD_RELATION_SEARCH: Record<string, AdminKeywordRelationSearch[]> = {
  code_detail: [{ relation: "levels", field: "value" }],
  word_today: [{ relation: "questionChoices", field: "content" }],
  sentence_today: [{ relation: "questionChoices", field: "content" }],
  grammar_today: [{ relation: "questionChoices", field: "content" }],
  jlpt: [{ relation: "choices", field: "content" }],
  word: [
    { relation: "means", field: "value" },
    { relation: "parts", field: "value" },
  ],
  jpt: [{ relation: "choices", field: "content" }],
  jpt_word: [
    { relation: "means", field: "value" },
    { relation: "parts", field: "value" },
  ],
  level_up: [{ relation: "choices", field: "content" }],
  jlpt_test: [{ relation: "choices", field: "content" }],
};

const sentenceTodayListWhere = {
  $and: [{ sentence: { $ne: null } }, { sentence: { $ne: "" } }],
};

const todayFilters: AdminFilterField[] = [
  { key: "level" },
  { key: "year" },
  { key: "study" },
];

const levelUpFilters: AdminFilterField[] = [
  { key: "level" },
  { key: "year" },
  { key: "studyRound" },
  { key: "classification" },
  { key: "questionGroupType" },
];

const todayScalars: AdminFieldConfig[] = [
  { key: "level", type: "text", required: true },
  { key: "year", type: "text", required: true },
  { key: "study", type: "text", required: true },
  { key: "sortNo", type: "number" },
  { key: "sentence", type: "textarea", rows: 3 },
  { key: "sentence_read", type: "textarea", rows: 2 },
  { key: "sentence_translate", type: "textarea", rows: 2 },
  { key: "speaker", type: "textarea", rows: 2 },
  { key: "question", type: "json" },
  { key: "sentence_locale", type: "json" },
];

const wordTodayFields: AdminFieldConfig[] = [
  { key: "level", type: "text", required: true },
  { key: "year", type: "text", required: true },
  { key: "study", type: "text", required: true },
  { key: "day", type: "number" },
  { key: "wordNo", type: "number", required: true },
  { key: "word", type: "text", required: true },
  { key: "read", type: "text", required: true },
  { key: "means", type: "textarea", rows: 3, required: true },
  { key: "keyword", type: "text" },
  { key: "sortNo", type: "number" },
  { key: "sentence", type: "textarea", rows: 3 },
  { key: "sentence_read", type: "textarea", rows: 2 },
  { key: "sentence_translate", type: "textarea", rows: 2 },
  { key: "speaker", type: "textarea", rows: 2 },
  { key: "question", type: "json" },
  { key: "sentence_locale", type: "json" },
  { key: "word_locale", type: "json" },
];

const sentenceTodayFields: AdminFieldConfig[] = [
  { key: "level", type: "text", required: true },
  { key: "year", type: "text", required: true },
  { key: "study", type: "text", required: true },
  { key: "day", type: "number" },
  { key: "wordNo", type: "number", required: true },
  { key: "sentence", type: "textarea", rows: 3, required: true },
  { key: "sentence_read", type: "textarea", rows: 2 },
  { key: "sentence_translate", type: "textarea", rows: 2 },
  { key: "speaker", type: "textarea", rows: 2 },
  { key: "question", type: "json" },
  { key: "sentence_locale", type: "json" },
];

const examScalars = (
  extra: AdminFieldConfig[] = [],
  options: { questionNoType?: Extract<AdminFieldType, "text" | "number"> } = {},
): AdminFieldConfig[] => [
  { key: "year", type: "text" },
  { key: "month", type: "text" },
  { key: "level", type: "text", required: true },
  { key: "sortNo", type: "number", required: true },
  { key: "classification", type: "text", required: true },
  { key: "questionNo", type: options.questionNoType ?? "text" },
  { key: "questionType", type: "text", required: true },
  { key: "answer", type: "number" },
  { key: "question", type: "json" },
  { key: "choices", type: "json" },
  { key: "sentence", type: "json" },
  ...extra,
];

const wordFields: AdminFieldConfig[] = [
  { key: "type", type: "text", required: true },
  { key: "level", type: "text", required: true },
  { key: "word", type: "text" },
  { key: "read", type: "text", required: true },
  { key: "means", type: "json" },
  { key: "parts", type: "json" },
];

function levelUpFields(): AdminFieldConfig[] {
  return examScalars(
    [
      { key: "questionGroupType", type: "text", required: true },
      { key: "questionGroupNo", type: "number" },
      { key: "questionContentNo", type: "number" },
      { key: "questionContentOrg", type: "textarea", rows: 3 },
      { key: "speaker", type: "textarea", rows: 2 },
      { key: "sentence_locale", type: "json" },
    ],
    { questionNoType: "number" },
  ).filter((field) => field.key !== "month");
}

const jlptTestFilters: AdminFilterField[] = [
  { key: "level" },
  { key: "test" },
  { key: "classification" },
];

function jlptTestFields(): AdminFieldConfig[] {
  return [
    { key: "level", type: "text", required: true },
    { key: "test", type: "text", required: true },
    { key: "sortNo", type: "number", required: true },
    { key: "classification", type: "text", required: true },
    { key: "questionNo", type: "number" },
    { key: "questionNoLabel", type: "text" },
    { key: "questionType", type: "text", required: true },
    { key: "answer", type: "number" },
    { key: "question", type: "json" },
    { key: "choices", type: "json" },
    { key: "sentence", type: "json" },
  ];
}

export const ADMIN_TABLE_META: Record<string, AdminTableMeta> = {
  code: {
    listColumns: ["code", "name", "sort"],
    sort: { sort: 1, code: 1 },
    fields: [
      { key: "code", type: "text", required: true },
      { key: "name", type: "text", required: true },
      { key: "sort", type: "number" },
    ],
    defaultValues: { sort: 0 },
  },
  code_detail: {
    listColumns: ["code", "key", "value", "sort", "classification"],
    filterFields: [{ key: "code" }],
    sort: { code: 1, sort: 1, key: 1 },
    fields: [
      { key: "code", type: "text", required: true },
      { key: "key", type: "text", required: true },
      { key: "value", type: "textarea", rows: 3, required: true },
      { key: "sort", type: "number" },
      { key: "classification", type: "text" },
      { key: "value_locale", type: "json" },
      { key: "levels", type: "json" },
    ],
    defaultValues: { sort: 0 },
  },
  word_today: {
    listColumns: ["level", "year", "study", "wordNo", "word", "read"],
    filterFields: todayFilters,
    sort: { level: 1, year: 1, study: 1, wordNo: 1 },
    fields: wordTodayFields,
    defaultValues: { wordNo: 1 },
  },
  sentence_today: {
    listColumns: [
      "level",
      "year",
      "study",
      "wordNo",
      "sentence",
      "sentence_read",
      "sentence_translate",
    ],
    filterFields: todayFilters,
    listWhere: sentenceTodayListWhere,
    sort: { level: 1, year: 1, study: 1, wordNo: 1 },
    fields: sentenceTodayFields,
    defaultValues: { wordNo: 1 },
  },
  grammar_today: {
    listColumns: ["level", "year", "study", "sortNo", "sentence"],
    filterFields: todayFilters,
    sort: { level: 1, year: 1, study: 1, sortNo: 1 },
    fields: todayScalars.map((field) =>
      field.key === "sortNo" ? { ...field, required: true } : field,
    ),
    defaultValues: { sortNo: 1 },
  },
  jlpt: {
    listColumns: ["year", "month", "level", "classification", "sortNo", "questionType"],
    filterFields: [
      { key: "level" },
      { key: "year" },
      { key: "month" },
      { key: "classification", labelKey: "common.subject" },
    ],
    sort: { year: -1, month: -1, level: 1, sortNo: 1 },
    fields: examScalars(),
    defaultValues: { sortNo: 1, questionType: "choice" },
  },
  word: {
    listColumns: ["type", "level", "word", "read"],
    filterFields: [{ key: "level" }, { key: "word" }, { key: "read" }],
    sort: { type: 1, level: 1, word: 1 },
    fields: wordFields,
  },
  jpt: {
    listColumns: ["level", "part", "year", "sortNo", "questionType"],
    filterFields: [{ key: "level" }, { key: "year" }, { key: "part" }],
    sort: { level: 1, part: 1, sortNo: 1 },
    fields: examScalars([
      { key: "part", type: "text", required: true },
      { key: "questionGroupType", type: "text" },
      { key: "questionGroupNo", type: "number" },
      { key: "questionContentNo", type: "number" },
      { key: "speaker", type: "textarea", rows: 2 },
    ]),
    defaultValues: { sortNo: 1, questionType: "choice" },
  },
  jpt_word: {
    listColumns: ["type", "level", "word", "read"],
    filterFields: [{ key: "level" }, { key: "word" }, { key: "read" }],
    sort: { type: 1, level: 1, word: 1 },
    fields: wordFields,
  },
  level_up: {
    listColumns: [
      "year",
      "studyRound",
      "level",
      "classification",
      "sortNo",
      "questionGroupType",
    ],
    filterFields: levelUpFilters,
    sort: { year: -1, level: 1, sortNo: 1 },
    fields: levelUpFields(),
    defaultValues: { sortNo: 1, questionGroupType: "single" },
  },
  jlpt_test: {
    listColumns: ["level", "test", "classification", "sortNo", "questionType"],
    filterFields: jlptTestFilters,
    sort: { level: 1, test: 1, sortNo: 1 },
    fields: jlptTestFields(),
    defaultValues: { sortNo: 1, questionType: "choice" },
  },
};

export const ADMIN_DATA_TABLES = Object.keys(ADMIN_TABLE_META);

export function isValidAdminTable(table: string) {
  return table in ADMIN_TABLE_META;
}

export function getAdminTableMeta(table: string): AdminTableMeta | undefined {
  const meta = ADMIN_TABLE_META[table];
  if (!meta) return undefined;
  return meta;
}

export function getAdminKeywordSearchFields(table: string): string[] {
  return ADMIN_KEYWORD_SEARCH_FIELDS[table] ?? [];
}

export function getAdminKeywordRelationSearch(
  table: string,
): AdminKeywordRelationSearch[] {
  return ADMIN_KEYWORD_RELATION_SEARCH[table] ?? [];
}

export function isSentenceColumn(column: string) {
  return (
    column === "sentence" ||
    column === "sentence_read" ||
    column === "sentence_translate"
  );
}

export function getAdminCellMax(column: string) {
  return isSentenceColumn(column) ? 120 : 48;
}

export function getAdminListCellValue(
  table: string,
  column: string,
  row: Record<string, unknown>,
) {
  if (table === "level_up" && column === "studyRound") {
    return row.studyRound ?? "";
  }
  return row[column];
}

export function formatAdminCell(value: unknown, max = 48) {
  if (value == null || value === "") return "";
  if (typeof value === "object") {
    const text = JSON.stringify(value);
    return text.length > max ? `${text.slice(0, max)}…` : text;
  }
  const text = String(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function buildFormPayload(
  fields: AdminFieldConfig[],
  values: Record<string, string>,
) {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = values[field.key];
    if (raw === undefined) continue;

    if (field.type === "json") {
      if (!raw.trim()) continue;
      payload[field.key] = JSON.parse(raw);
      continue;
    }

    if (field.type === "number") {
      if (!raw.trim()) continue;
      const parsed = Number(raw);
      if (Number.isNaN(parsed)) {
        throw new Error(`invalid number: ${field.key}`);
      }
      payload[field.key] = parsed;
      continue;
    }

    if (!raw.trim() && !field.required) continue;
    payload[field.key] = raw;
  }

  return payload;
}

/** 폼 설정 기준으로 숫자 필드 타입을 보정 (Prisma Int 필드용) */
export function sanitizeAdminPayload(
  table: string,
  payload: Record<string, unknown>,
) {
  const meta = getAdminTableMeta(table);
  const stripped = stripVirtualAdminPayloadKeys(payload);
  if (!meta) return stripped;

  const numberKeys = new Set(
    meta.fields.filter((field) => field.type === "number").map((field) => field.key),
  );
  const next = { ...stripped };

  for (const key of numberKeys) {
    const value = next[key];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) next[key] = parsed;
    }
  }

  return next;
}

export function recordToFormValues(
  fields: AdminFieldConfig[],
  record: Record<string, unknown>,
) {
  const values: Record<string, string> = {};

  for (const field of fields) {
    const value = record[field.key];
    if (value == null) {
      values[field.key] = "";
      continue;
    }
    if (field.type === "json") {
      values[field.key] = JSON.stringify(value, null, 2);
      continue;
    }
    values[field.key] = String(value);
  }

  return values;
}

export function emptyFormValues(
  fields: AdminFieldConfig[],
  defaults?: Record<string, unknown>,
) {
  const values: Record<string, string> = {};

  for (const field of fields) {
    const value = defaults?.[field.key];
    if (value == null) {
      values[field.key] = "";
      continue;
    }
    if (field.type === "json") {
      values[field.key] = JSON.stringify(value, null, 2);
    } else {
      values[field.key] = String(value);
    }
  }

  return values;
}

export function buildAdminSearchFilter(
  config: AdminTableMeta,
  searchInfo?: Record<string, string | undefined>,
  table?: string,
) {
  const clauses: Record<string, unknown>[] = [];

  if (config.listWhere && Object.keys(config.listWhere).length) {
    clauses.push(config.listWhere);
  }

  const exact: Record<string, unknown> = {};
  for (const field of config.filterFields ?? []) {
    const value = searchInfo?.[field.key]?.trim();
    if (!value) continue;

    if (field.match === "contains") {
      const keys = field.searchKeys?.length ? field.searchKeys : [field.key];
      const pattern = escapeRegex(value);
      if (keys.length === 1) {
        clauses.push({ [keys[0]]: { $regex: pattern, $options: "i" } });
      } else {
        clauses.push({
          $or: keys.map((key) => ({ [key]: { $regex: pattern, $options: "i" } })),
        });
      }
      continue;
    }

    const dbKey = field.searchKeys?.[0] ?? field.key;
    exact[dbKey] = value;
  }
  if (Object.keys(exact).length) {
    clauses.push(exact);
  }

  const keyword = normalizeAdminKeyword(searchInfo?.keyword);
  const keywordFields = table ? getAdminKeywordSearchFields(table) : [];
  const keywordRelations = table ? getAdminKeywordRelationSearch(table) : [];
  if (keyword && (keywordFields.length || keywordRelations.length)) {
    const pattern = escapeRegex(keyword);
    clauses.push({
      $or: [
        ...keywordFields.map((field) => ({
          [field]: { $regex: pattern, $options: "i" },
        })),
        ...keywordRelations.map(({ relation, field }) => ({
          [relation]: { some: { [field]: { contains: keyword } } },
        })),
      ],
    });
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
}
