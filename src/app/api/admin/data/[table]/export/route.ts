import { buildAdminSearchFilter, requireAdminTable } from "@/app/api/admin/data/_helpers";
import { getAdminTableMeta } from "@/app/admin/data/table-config";
import {
  UTF8_BOM,
  buildStreamCsvHeaders,
  csvDataLines,
  csvHeaderLine,
} from "@/app/lib/admin-csv";
import {
  enrichLevelUpRows,
  resolveLevelUpAdminSearch,
} from "@/app/lib/levelUpJlptMap.server";
import { requireAdminPassword } from "@/app/utils/requireAdminPassword";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ table: string }> };

const FETCH_CHUNK = 200;

function mergeAdminFilter(
  base: Record<string, unknown>,
  extraClauses: Record<string, unknown>[],
) {
  if (!extraClauses.length) return base;
  const clauses = [
    ...(Object.keys(base).length ? [base] : []),
    ...extraClauses,
  ];
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { table } = await context.params;
  const { error, config } = await requireAdminTable(table);
  if (error || !config) return error;

  const meta = getAdminTableMeta(table);
  if (!meta) {
    return NextResponse.json({ success: false, message: "Unknown table." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const passwordCheck = await requireAdminPassword(body?.password);
  if (passwordCheck.error) return passwordCheck.error;

  const searchInfo = (body?.searchInfo ?? {}) as Record<string, string | undefined>;

  const resolved =
    table === "level_up"
      ? await resolveLevelUpAdminSearch(searchInfo)
      : { searchInfo, extraClauses: [] as Record<string, unknown>[] };

  const filter = mergeAdminFilter(
    buildAdminSearchFilter(config, resolved.searchInfo, table),
    resolved.extraClauses,
  );

  const total = await config.model.count(filter);
  const filename = `${table}-${new Date().toISOString().slice(0, 10)}.csv`;
  const headers = buildStreamCsvHeaders(table, meta);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      };

      try {
        send({ type: "start", total, filename });
        send({
          type: "chunk",
          text: `${UTF8_BOM}${csvHeaderLine(headers)}\r\n`,
        });

        let skip = 0;
        let exported = 0;

        for (;;) {
          let chunk = (await config.model
            .find(filter)
            .sort(config.sort)
            .skip(skip)
            .limit(FETCH_CHUNK)
            .exec()) as Array<Record<string, unknown>>;

          if (!chunk.length) break;

          if (table === "level_up") {
            chunk = (await enrichLevelUpRows(
              chunk as Array<{ level?: string | null; year?: string | null }>,
            )) as Array<Record<string, unknown>>;
          }

          const lines = csvDataLines(table, meta, headers, chunk);
          if (lines) {
            send({ type: "chunk", text: `${lines}\r\n` });
          }

          exported += chunk.length;
          send({ type: "progress", current: exported, total });

          if (chunk.length < FETCH_CHUNK) break;
          skip += FETCH_CHUNK;
        }

        send({ type: "done", rows: exported, filename });
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Export failed.";
        send({ type: "error", message });
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
