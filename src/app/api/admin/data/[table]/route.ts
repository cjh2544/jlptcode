import { requireAdminTable } from "@/app/api/admin/data/_helpers";
import { sanitizeAdminPayload } from "@/app/admin/data/table-config";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ table: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { table } = await context.params;
  const { error, config } = await requireAdminTable(table);
  if (error || !config) return error;

  const { data } = await request.json();
  if (!data || typeof data !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const payload = sanitizeAdminPayload(table, data as Record<string, unknown>);

  try {
    const created = await config.model.create(payload);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error(`[admin/data/${table}] create failed`, error);
    return NextResponse.json(
      { success: false, message: "Save failed." },
      { status: 400 },
    );
  }
}
