import { ADMIN_DATA_TABLES as TABLE_SLUGS } from "@/app/admin/data/table-config";

export type AdminDataItem = {
  key: string;
  table: string;
  icon: string;
};

export type AdminDataSection = {
  titleKey: string;
  items: AdminDataItem[];
};

export const ADMIN_DATA_SECTIONS: AdminDataSection[] = [
  {
    titleKey: "admin.dataManagement",
    items: [
      { key: "admin.tables.code", table: "code", icon: "fas fa-database" },
      { key: "admin.tables.codeDetail", table: "code_detail", icon: "fas fa-list-ul" },
    ],
  },
  {
    titleKey: "admin.todaySection",
    items: [
      { key: "admin.tables.wordToday", table: "word_today", icon: "fas fa-book" },
      {
        key: "admin.tables.sentenceToday",
        table: "sentence_today",
        icon: "fas fa-comment-dots",
      },
      {
        key: "admin.tables.grammarToday",
        table: "grammar_today",
        icon: "fas fa-spell-check",
      },
    ],
  },
  {
    titleKey: "admin.jlptSection",
    items: [
      { key: "admin.tables.jlpt", table: "jlpt", icon: "fas fa-file-alt" },
      { key: "admin.tables.word", table: "word", icon: "fas fa-font" },
      { key: "admin.tables.jpt", table: "jpt", icon: "fas fa-file" },
      { key: "admin.tables.jptWord", table: "jpt_word", icon: "fas fa-book-open" },
    ],
  },
  {
    titleKey: "admin.levelUpSection",
    items: [
      { key: "admin.tables.levelUp", table: "level_up", icon: "fas fa-arrow-up" },
    ],
  },
];

export const ADMIN_DATA_ITEMS = ADMIN_DATA_SECTIONS.flatMap(
  (section) => section.items,
);

export const ADMIN_DATA_TABLES = TABLE_SLUGS;

export function getAdminDataItem(table: string): AdminDataItem | undefined {
  return ADMIN_DATA_ITEMS.find((entry) => entry.table === table);
}
