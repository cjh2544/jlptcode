type AnyRecord = Record<string, unknown>;

export function serializeDoc<T extends AnyRecord>(row: T | null | undefined): (T & { _id: string }) | null {
  if (!row) return null;

  const { id, ...rest } = row;
  const doc = {
    ...rest,
    id,
    _id: String(id ?? ""),
  } as unknown as T & { _id: string };

  return doc;
}

export function serializeDocs<T extends AnyRecord>(rows: T[]): Array<T & { _id: string }> {
  return rows.map((row) => serializeDoc(row)!);
}
