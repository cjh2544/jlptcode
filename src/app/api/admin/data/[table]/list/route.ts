import { buildAdminSearchFilter, requireAdminTable } from "@/app/api/admin/data/_helpers";
import { parseAdminPageRequest } from "@/app/lib/admin-security";
import {
  enrichLevelUpRows,
  resolveLevelUpAdminSearch,
} from "@/app/lib/levelUpJlptMap.server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ table: string }> };

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

  const { pageInfo, searchInfo } = await request.json();
  const { currentPage, pageSize } = parseAdminPageRequest(pageInfo);
  const skip = (currentPage - 1) * pageSize;

  const resolved =
    table === "level_up"
      ? await resolveLevelUpAdminSearch(searchInfo)
      : { searchInfo, extraClauses: [] as Record<string, unknown>[] };
  const filter = mergeAdminFilter(
    buildAdminSearchFilter(config, resolved.searchInfo, table),
    resolved.extraClauses,
  );

  const list = await config.model
    .find(filter)
    .sort(config.sort)
    .skip(skip)
    .limit(pageSize)
    .exec();

  if (table === "level_up") {
    return NextResponse.json(
      await enrichLevelUpRows(
        list as Array<{ level?: string | null; year?: string | null }>,
      ),
    );
  }

  return NextResponse.json(list);
}
