import { requireAdminTable } from "@/app/api/admin/data/_helpers";
import { sanitizeAdminPayload } from "@/app/admin/data/table-config";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ table: string; id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { table, id } = await context.params;
  const { error, config } = await requireAdminTable(table);
  if (error || !config) return error;

  const data = await config.model.findOne({ _id: id }).exec();
  if (!data) {
    return NextResponse.json(
      { success: false, message: "Not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { table, id } = await context.params;
  const { error, config } = await requireAdminTable(table);
  if (error || !config) return error;

  const { data } = await request.json();
  if (!data || typeof data !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const payload = sanitizeAdminPayload(table, {
    ...data,
  } as Record<string, unknown>);

  try {
    await config.model.updateOne({ _id: id }, payload);
  } catch (error) {
    console.error(`[admin/data/${table}/${id}] update failed`, error);
    return NextResponse.json(
      { success: false, message: "Save failed." },
      { status: 400 },
    );
  }

  const updated = await config.model.findOne({ _id: id }).exec();

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { table, id } = await context.params;
  const { error, config } = await requireAdminTable(table);
  if (error || !config) return error;

  await config.model.deleteOne({ _id: id });
  return NextResponse.json({ success: true });
}
