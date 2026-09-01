import connectDB from "@/app/utils/database";
import { requireAdmin } from "@/app/utils/requireAdmin";
import { NextResponse } from "next/server";
import {
  buildAdminSearchFilter,
  isValidAdminTable,
} from "@/app/admin/data/table-config";
import { getAdminTableConfig } from "@/app/admin/data/registry";

export async function requireAdminTable(table: string) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error, config: null };

  if (!isValidAdminTable(table)) {
    return {
      error: NextResponse.json(
        { success: false, message: "Unknown table." },
        { status: 404 },
      ),
      config: null,
    };
  }

  await connectDB();
  return { error: null, config: getAdminTableConfig(table)! };
}

export { buildAdminSearchFilter };
