import Code from "@/app/models/codeModel";
import CodeDetail from "@/app/models/codeDetailModel";
import WordToday from "@/app/models/wordTodayModel";
import GrammarToday from "@/app/models/grammarTodayModel";
import Jlpt from "@/app/models/jlptModel";
import Word from "@/app/models/wordModel";
import Jpt from "@/app/models/jptModel";
import JptWord from "@/app/models/jptWordModel";
import LevelUp from "@/app/models/levelUpModel";
import {
  ADMIN_TABLE_META,
  getAdminTableMeta,
  isValidAdminTable,
  type AdminTableMeta,
} from "@/app/admin/data/table-config";

type AdminModel = {
  find: (filter?: unknown) => {
    sort: (spec: Record<string, 1 | -1>) => {
      skip: (n: number) => { limit: (n: number) => { exec: () => Promise<unknown[]> } };
    };
  };
  findOne: (filter: unknown) => { exec: () => Promise<unknown | null> };
  create: (data: Record<string, unknown>) => Promise<unknown>;
  updateOne: (filter: Record<string, unknown>, update: Record<string, unknown>) => Promise<unknown>;
  deleteOne: (filter: Record<string, unknown>) => Promise<unknown>;
  count: (filter?: unknown) => Promise<number>;
};

export type AdminTableConfig = AdminTableMeta & {
  model: AdminModel;
};

const MODEL_BY_TABLE: Record<string, AdminModel> = {
  code: Code,
  code_detail: CodeDetail,
  word_today: WordToday,
  sentence_today: WordToday,
  grammar_today: GrammarToday,
  jlpt: Jlpt,
  word: Word,
  jpt: Jpt,
  jpt_word: JptWord,
  level_up: LevelUp,
};

export function getAdminTableConfig(table: string): AdminTableConfig | undefined {
  const meta = getAdminTableMeta(table);
  const model = MODEL_BY_TABLE[table];
  if (!meta || !model) return undefined;
  return { ...meta, model };
}

export { isValidAdminTable, ADMIN_TABLE_META };
