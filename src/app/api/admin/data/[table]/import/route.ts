import { requireAdminTable } from "@/app/api/admin/data/_helpers";
import { getAdminTableMeta, sanitizeAdminPayload } from "@/app/admin/data/table-config";
import { csvRecordToPayload, parseCsv } from "@/app/lib/admin-csv";
import { requireAdminPassword } from "@/app/utils/requireAdminPassword";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ table: string }> };

const MAX_IMPORT_ROWS = 20000;
const PROGRESS_EVERY = 25;
const TEMP_DIR = path.join(tmpdir(), "jlptcode-admin-csv");
const STALE_MS = 60 * 60 * 1000;

async function ensureTempDir() {
  await fs.mkdir(TEMP_DIR, { recursive: true });
}

async function cleanupStaleTempFiles() {
  try {
    const entries = await fs.readdir(TEMP_DIR, { withFileTypes: true });
    const now = Date.now();
    await Promise.all(
      entries.map(async (entry) => {
        if (!entry.isFile()) return;
        const fullPath = path.join(TEMP_DIR, entry.name);
        try {
          const stat = await fs.stat(fullPath);
          if (now - stat.mtimeMs > STALE_MS) {
            await fs.unlink(fullPath);
          }
        } catch {
          // ignore race / already deleted
        }
      }),
    );
  } catch {
    // temp dir may not exist yet
  }
}

async function removeTempFile(filePath: string | null) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore missing file
  }
}

async function saveUploadToTemp(file: File) {
  await ensureTempDir();
  void cleanupStaleTempFiles();
  const safeName = path.basename(file.name || "upload.csv").replace(/[^\w.\-]+/g, "_");
  const tempPath = path.join(TEMP_DIR, `${Date.now()}-${randomUUID()}-${safeName}`);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(tempPath, bytes);
  return tempPath;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { table } = await context.params;
  const { error, config } = await requireAdminTable(table);
  if (error || !config) return error;

  const meta = getAdminTableMeta(table);
  if (!meta) {
    return NextResponse.json({ success: false, message: "Unknown table." }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") || "";
  let csvText = "";
  let password: unknown = "";
  let tempPath: string | null = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      password = form.get("password");
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, message: "CSV file is required." },
          { status: 400 },
        );
      }
      tempPath = await saveUploadToTemp(file);
      csvText = await fs.readFile(tempPath, "utf8");
    } else {
      const body = await request.json().catch(() => null);
      password = body?.password;
      csvText = typeof body?.csv === "string" ? body.csv : "";
    }

    const passwordCheck = await requireAdminPassword(password);
    if (passwordCheck.error) {
      await removeTempFile(tempPath);
      return passwordCheck.error;
    }

    if (!csvText.trim()) {
      await removeTempFile(tempPath);
      return NextResponse.json(
        { success: false, message: "Empty CSV." },
        { status: 400 },
      );
    }

    const { records } = parseCsv(csvText);
    // Drop large string ASAP; records hold the structured data.
    csvText = "";

    if (!records.length) {
      await removeTempFile(tempPath);
      return NextResponse.json(
        { success: false, message: "No data rows in CSV." },
        { status: 400 },
      );
    }
    if (records.length > MAX_IMPORT_ROWS) {
      await removeTempFile(tempPath);
      return NextResponse.json(
        {
          success: false,
          message: `Too many rows (max ${MAX_IMPORT_ROWS}).`,
        },
        { status: 400 },
      );
    }

    // Temp file is no longer needed once parsed into memory.
    await removeTempFile(tempPath);
    tempPath = null;

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (payload: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
        };

        let created = 0;
        let updated = 0;
        const failures: Array<{ row: number; id?: string; message: string }> = [];
        const total = records.length;

        send({ type: "start", total });

        for (let index = 0; index < records.length; index++) {
          const record = records[index];
          const rowNo = index + 2;
          const id = String(record.id ?? "").trim();

          try {
            const payload = sanitizeAdminPayload(
              table,
              csvRecordToPayload(table, meta, record),
            );

            if (id) {
              const existing = await config.model.findOne({ _id: id }).exec();
              if (existing) {
                await config.model.updateOne({ _id: id }, payload);
                updated += 1;
              } else {
                await config.model.create({ ...payload, id });
                created += 1;
              }
            } else {
              await config.model.create(payload);
              created += 1;
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : "Save failed.";
            failures.push({ row: rowNo, id: id || undefined, message });
          }

          const current = index + 1;
          if (current === total || current % PROGRESS_EVERY === 0) {
            send({
              type: "progress",
              current,
              total,
              created,
              updated,
              failed: failures.length,
            });
          }
        }

        send({
          type: "done",
          success: failures.length === 0,
          created,
          updated,
          failed: failures.length,
          failures: failures.slice(0, 20),
        });
        controller.close();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    await removeTempFile(tempPath);
    const message = err instanceof Error ? err.message : "Import failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
