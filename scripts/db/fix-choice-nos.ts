/**
 * Repair exam choice `no` values (1..n) when they are 0, duplicated, or
 * disagree with leading labels in content (`1)`, `２）`, …).
 *
 * Default is dry-run. Pass --apply to write updates.
 *
 *   npx tsx scripts/db/fix-choice-nos.ts
 *   npx tsx scripts/db/fix-choice-nos.ts --apply
 *   npm run db:fix-choice-nos
 *   npm run db:fix-choice-nos -- --apply
 */
import { config } from "dotenv";
import { Prisma, PrismaClient } from "@prisma/client";
import { withOrderedExamChoiceNos } from "../../src/app/lib/content-shape";

config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const CHUNK = 200;

type ChoiceRow = { id: string; parentId: string; no: number; content: string | null };

type TableConfig = {
  label: string;
  findMany: () => Promise<ChoiceRow[]>;
  update: (id: string, no: number) => Prisma.PrismaPromise<{ id: string }>;
};

const TABLES: TableConfig[] = [
  {
    label: "jlpt_choice",
    findMany: () => prisma.jlptChoice.findMany({ select: { id: true, parentId: true, no: true, content: true } }),
    update: (id, no) => prisma.jlptChoice.update({ where: { id }, data: { no }, select: { id: true } }),
  },
  {
    label: "jlpt_test_choice",
    findMany: () =>
      prisma.jlptTestChoice.findMany({ select: { id: true, parentId: true, no: true, content: true } }),
    update: (id, no) => prisma.jlptTestChoice.update({ where: { id }, data: { no }, select: { id: true } }),
  },
  {
    label: "jpt_choice",
    findMany: () => prisma.jptChoice.findMany({ select: { id: true, parentId: true, no: true, content: true } }),
    update: (id, no) => prisma.jptChoice.update({ where: { id }, data: { no }, select: { id: true } }),
  },
  {
    label: "level_up_choice",
    findMany: () =>
      prisma.levelUpChoice.findMany({ select: { id: true, parentId: true, no: true, content: true } }),
    update: (id, no) => prisma.levelUpChoice.update({ where: { id }, data: { no }, select: { id: true } }),
  },
];

function groupByParent(rows: ChoiceRow[]) {
  const map = new Map<string, ChoiceRow[]>();
  for (const row of rows) {
    const list = map.get(row.parentId);
    if (list) list.push(row);
    else map.set(row.parentId, [row]);
  }
  return map;
}

function planUpdates(rows: ChoiceRow[]) {
  const updates: Array<{ id: string; parentId: string; from: number; to: number; content: string | null }> = [];
  let parentsTouched = 0;

  for (const [parentId, choices] of groupByParent(rows)) {
    const byId = new Map(choices.map((choice) => [choice.id, choice]));
    const repaired = withOrderedExamChoiceNos(choices);
    let changed = false;
    for (const item of repaired) {
      const from = byId.get(item.id)?.no;
      if (from == null || from === item.no) continue;
      changed = true;
      updates.push({
        id: item.id,
        parentId,
        from,
        to: item.no,
        content: item.content,
      });
    }
    if (changed) parentsTouched += 1;
  }

  return { updates, parentsTouched };
}

async function applyUpdates(
  table: TableConfig,
  updates: Array<{ id: string; to: number }>
) {
  let written = 0;
  for (let i = 0; i < updates.length; i += CHUNK) {
    const chunk = updates.slice(i, i + CHUNK);
    await prisma.$transaction(chunk.map((row) => table.update(row.id, row.to)));
    written += chunk.length;
    console.log(`  ${table.label}: ${written}/${updates.length}`);
  }
  return written;
}

async function summarize(label: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ no: number; cnt: bigint }>>(
    `SELECT no, COUNT(*) AS cnt FROM \`${label}\` GROUP BY no ORDER BY no`
  );
  return rows.map((row) => ({ no: row.no, cnt: Number(row.cnt) }));
}

async function fixTable(table: TableConfig) {
  const rows = await table.findMany();
  const { updates, parentsTouched } = planUpdates(rows);

  console.log(`\n=== ${table.label} ===`);
  console.log(`rows: ${rows.length}, parents needing fix: ${parentsTouched}, choice updates: ${updates.length}`);
  if (updates.length) {
    console.log(
      "sample:",
      updates.slice(0, 5).map((u) => ({
        parentId: u.parentId,
        from: u.from,
        to: u.to,
        content: String(u.content ?? "").slice(0, 24),
      }))
    );
  }

  if (!APPLY) {
    console.log("dry-run only (pass --apply to write)");
    return { parentsTouched, updates: updates.length, written: 0 };
  }

  const written = updates.length ? await applyUpdates(table, updates.map((u) => ({ id: u.id, to: u.to }))) : 0;
  console.log("after no distribution:", await summarize(table.label));
  return { parentsTouched, updates: updates.length, written };
}

async function main() {
  console.log(APPLY ? "mode: APPLY (writing)" : "mode: dry-run");

  const totals = { parentsTouched: 0, updates: 0, written: 0 };
  for (const table of TABLES) {
    const result = await fixTable(table);
    totals.parentsTouched += result.parentsTouched;
    totals.updates += result.updates;
    totals.written += result.written;
  }

  console.log("\n--- total ---");
  console.log(totals);
  if (!APPLY && totals.updates > 0) {
    console.log("Re-run with --apply to persist changes.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
