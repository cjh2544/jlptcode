import { buildAdminSearchFilter, requireAdminTable } from "@/app/api/admin/data/_helpers";
import { parseAdminPageRequest } from "@/app/lib/admin-security";
import { resolveLevelUpAdminSearch } from "@/app/lib/levelUpJlptMap.server";
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
  const pagination = parseAdminPageRequest(pageInfo);
  const resultPageInfo = { ...pageInfo, ...pagination };

  const resolved =
    table === "level_up"
      ? await resolveLevelUpAdminSearch(searchInfo)
      : { searchInfo, extraClauses: [] as Record<string, unknown>[] };
  const filter = mergeAdminFilter(
    buildAdminSearchFilter(config, resolved.searchInfo, table),
    resolved.extraClauses,
  );
  const total = await config.model.count(filter);

  resultPageInfo.total = total;
  resultPageInfo.totalPage = Math.ceil(total / pagination.pageSize) || 1;
  resultPageInfo.currentPage = Math.min(
    pagination.currentPage,
    resultPageInfo.totalPage,
  );
  resultPageInfo.pageSize = pagination.pageSize;

  return NextResponse.json(resultPageInfo);
}
