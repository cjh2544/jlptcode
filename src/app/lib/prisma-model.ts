import { newId } from "@/app/lib/new-id";
import { serializeDoc, serializeDocs } from "@/app/utils/serialize";

type AnyRecord = Record<string, any>;

type LookupFn = (filter: AnyRecord) => Promise<AnyRecord[]>;

export type RelationContainsField = { field: string };

export type PrismaModelOptions = {
  allowedFields: string[];
  jsonArrayFields?: string[];
  relationContainsFields?: Record<string, RelationContainsField>;
  defaults?: AnyRecord;
  include?: AnyRecord;
  lookups?: Record<string, LookupFn>;
  transformRead?: (doc: AnyRecord) => AnyRecord;
  transformWrite?: (data: AnyRecord) => AnyRecord;
  createRelated?: (id: string, data: AnyRecord) => Promise<void>;
  syncRelated?: (id: string, data: AnyRecord) => Promise<void>;
  pushRelated?: (parentId: string, field: string, value: AnyRecord) => Promise<void>;
};

function stripUndefined(value: AnyRecord) {
  const next: AnyRecord = {};
  for (const [key, val] of Object.entries(value || {})) {
    if (val !== undefined) next[key] = val;
  }
  return next;
}

function asPlainFilter(filter: unknown): AnyRecord {
  if (!filter) return {};
  if (typeof URLSearchParams !== "undefined" && filter instanceof URLSearchParams) {
    return Object.fromEntries(filter.entries());
  }
  return { ...(filter as AnyRecord) };
}

function normalizeId(value: unknown) {
  if (value == null) return value;
  if (typeof value === "object" && value && "toString" in value) {
    return String(value);
  }
  return value;
}

function jsonArrayContains(field: string, value: unknown) {
  const items = Array.isArray(value) ? value : [value];
  const clauses = items.flatMap((item) => {
    const next: AnyRecord[] = [{ [field]: { array_contains: item } }];
    const asString = String(item);
    if (asString !== item) next.push({ [field]: { array_contains: asString } });
    const asNumber = Number(item);
    if (!Number.isNaN(asNumber) && String(asNumber) === asString) {
      next.push({ [field]: { array_contains: asNumber } });
    }
    return next;
  });
  return clauses.length === 1 ? clauses[0] : { OR: clauses };
}

export function toPrismaWhere(
  filter: unknown,
  jsonArrayFields: string[] = [],
  relationContainsFields: Record<string, RelationContainsField> = {}
): AnyRecord {
  const raw = asPlainFilter(filter);
  if (raw.$or) {
    return { OR: raw.$or.map((item: unknown) => toPrismaWhere(item, jsonArrayFields, relationContainsFields)) };
  }
  if (raw.$and) {
    return { AND: raw.$and.map((item: unknown) => toPrismaWhere(item, jsonArrayFields, relationContainsFields)) };
  }

  const where: AnyRecord = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("$") || value === undefined) continue;
    const field = key === "_id" ? "id" : key;
    const isJsonArray = jsonArrayFields.includes(field);
    const relation = relationContainsFields[field];

    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      const op = value as AnyRecord;
      if ("$in" in op) {
        if (relation) {
          where[field] = { some: { [relation.field]: { in: (op.$in || []).map((item: unknown) => String(item)) } } };
        } else if (isJsonArray) Object.assign(where, jsonArrayContains(field, op.$in));
        else where[field] = { in: (op.$in || []).map(normalizeId) };
      } else if ("$nin" in op) {
        if (relation) {
          where[field] = { none: { [relation.field]: { in: (op.$nin || []).map((item: unknown) => String(item)) } } };
        } else {
          const nin = (op.$nin || []) as unknown[];
          const parts: AnyRecord[] = [];
          if (nin.includes(null) || nin.includes("")) {
            parts.push({ NOT: { OR: [{ [field]: null }, { [field]: "" }] } });
          }
          const rest = nin.filter((item) => item !== null && item !== undefined && item !== "");
          if (rest.length) parts.push({ [field]: { notIn: rest.map(normalizeId) } });
          if (parts.length === 1) Object.assign(where, parts[0]);
          else if (parts.length > 1) where.AND = [...(where.AND || []), ...parts];
        }
      } else if ("$ne" in op) {
        where[field] = { not: normalizeId(op.$ne) };
      } else if ("$regex" in op) {
        where[field] = { contains: String(op.$regex) };
      } else if ("$gt" in op || "$gte" in op || "$lt" in op || "$lte" in op) {
        const range: AnyRecord = {};
        if ("$gt" in op) range.gt = op.$gt;
        if ("$gte" in op) range.gte = op.$gte;
        if ("$lt" in op) range.lt = op.$lt;
        if ("$lte" in op) range.lte = op.$lte;
        where[field] = range;
      } else {
        where[field] = op;
      }
    } else if (relation) {
      const items = Array.isArray(value) ? value : [value];
      where[field] = {
        some:
          items.length === 1
            ? { [relation.field]: String(items[0]) }
            : { [relation.field]: { in: items.map(String) } },
      };
    } else if (isJsonArray) {
      Object.assign(where, jsonArrayContains(field, value));
    } else {
      where[field] = normalizeId(value);
    }
  }
  return where;
}

function toPrismaOrderBy(sort?: AnyRecord) {
  if (!sort) return undefined;
  return Object.entries(sort).map(([key, dir]) => ({
    [key === "_id" ? "id" : key]: dir === -1 || dir === "desc" ? "desc" : "asc",
  }));
}

function parseSelect(select?: string | AnyRecord) {
  if (!select) return {};
  if (typeof select === "object") {
    const mapped: AnyRecord = {};
    for (const [key, value] of Object.entries(select)) {
      mapped[key === "_id" ? "id" : key] = Boolean(value);
    }
    mapped.id = true;
    return { select: mapped };
  }

  const tokens = String(select).trim().split(/\s+/).filter(Boolean);
  const omitFields = tokens.filter((token) => token.startsWith("-")).map((token) => token.slice(1));
  const includeFields = tokens.filter((token) => !token.startsWith("-"));

  if (omitFields.length) {
    const omit: AnyRecord = {};
    for (const field of omitFields) omit[field] = true;
    return { omit };
  }

  const mapped: AnyRecord = { id: true };
  for (const field of includeFields) mapped[field === "_id" ? "id" : field] = true;
  return { select: mapped };
}

function pickAllowed(data: AnyRecord, allowedFields: string[], defaults?: AnyRecord) {
  const next: AnyRecord = { ...defaults };
  for (const field of allowedFields) {
    if (data[field] !== undefined) next[field] = data[field];
  }
  if (data._id && !next.id) next.id = String(data._id);
  if (data.id) next.id = String(data.id);
  return next;
}

function unwrapUpdate(update: AnyRecord) {
  if (update.$set) return { ...update.$set };
  const next = { ...update };
  delete next.$push;
  delete next.$set;
  delete next.$unset;
  return next;
}

function getPath(doc: AnyRecord, path: string, vars: AnyRecord = {}) {
  if (path === "NOW" || path === "$NOW") return new Date();
  const parts = path.split(".");
  let current: any = doc;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}

function resolveVar(token: string, doc: AnyRecord, vars: AnyRecord) {
  if (token === "$$NOW") return new Date();
  if (token.startsWith("$$")) {
    return getPath(vars, token.slice(2));
  }
  if (token.startsWith("$")) {
    return getPath(doc, token.slice(1), vars);
  }
  return token;
}

function evalExpr(doc: AnyRecord, expr: any, vars: AnyRecord = {}): any {
  if (expr === null || expr === undefined) return expr;
  if (typeof expr === "string") return resolveVar(expr, doc, vars);
  if (typeof expr !== "object") return expr;
  if (expr instanceof Date) return expr;
  if (Array.isArray(expr)) return expr.map((item) => evalExpr(doc, item, vars));

  const keys = Object.keys(expr);
  if (keys.length === 1 && keys[0].startsWith("$")) {
    const op = keys[0];
    const arg = expr[op];
    switch (op) {
      case "$concat":
        return (arg as any[]).map((item) => evalExpr(doc, item, vars) ?? "").join("");
      case "$eq":
        return evalExpr(doc, arg[0], vars) === evalExpr(doc, arg[1], vars);
      case "$ne":
        return evalExpr(doc, arg[0], vars) !== evalExpr(doc, arg[1], vars);
      case "$gt":
        return evalExpr(doc, arg[0], vars) > evalExpr(doc, arg[1], vars);
      case "$gte":
        return evalExpr(doc, arg[0], vars) >= evalExpr(doc, arg[1], vars);
      case "$lt":
        return evalExpr(doc, arg[0], vars) < evalExpr(doc, arg[1], vars);
      case "$lte":
        return evalExpr(doc, arg[0], vars) <= evalExpr(doc, arg[1], vars);
      case "$and":
        return (arg as any[]).every((item) => Boolean(evalExpr(doc, item, vars)));
      case "$or":
        return (arg as any[]).some((item) => Boolean(evalExpr(doc, item, vars)));
      case "$cond":
        if (Array.isArray(arg)) {
          return evalExpr(doc, arg[0], vars) ? evalExpr(doc, arg[1], vars) : evalExpr(doc, arg[2], vars);
        }
        return evalExpr(doc, arg.if, vars) ? evalExpr(doc, arg.then, vars) : evalExpr(doc, arg.else, vars);
      case "$ifNull": {
        const value = evalExpr(doc, arg[0], vars);
        return value == null ? evalExpr(doc, arg[1], vars) : value;
      }
      case "$toInt": {
        const value = evalExpr(doc, arg, vars);
        const parsed = parseInt(String(value ?? 0), 10);
        return Number.isNaN(parsed) ? 0 : parsed;
      }
      case "$arrayElemAt": {
        const arr = evalExpr(doc, arg[0], vars) || [];
        const index = evalExpr(doc, arg[1], vars);
        if (!Array.isArray(arr)) return undefined;
        return index < 0 ? arr[arr.length + index] : arr[index];
      }
      case "$size": {
        const arr = evalExpr(doc, arg, vars);
        return Array.isArray(arr) ? arr.length : 0;
      }
      case "$regexFindAll": {
        const input = String(evalExpr(doc, arg.input, vars) ?? "");
        const regex = new RegExp(arg.regex, "g");
        return [...input.matchAll(regex)].map((match) => ({ match: match[0] }));
      }
      case "$regexFind": {
        const input = String(evalExpr(doc, arg.input, vars) ?? "");
        const regex = arg.regex instanceof RegExp ? arg.regex : new RegExp(arg.regex);
        const match = input.match(regex);
        return match ? { match: match[0] } : null;
      }
      case "$regexMatch": {
        const input = String(evalExpr(doc, arg.input, vars) ?? "");
        const regex = arg.regex instanceof RegExp ? arg.regex : new RegExp(arg.regex);
        return regex.test(input);
      }
      case "$getField": {
        const input = evalExpr(doc, arg.input, vars);
        return input?.[arg.field];
      }
      case "$indexOfArray": {
        const arr = evalExpr(doc, arg[0], vars) || [];
        return arr.indexOf(evalExpr(doc, arg[1], vars));
      }
      case "$substrBytes":
      case "$substr": {
        const input = String(evalExpr(doc, arg[0], vars) ?? "");
        const start = evalExpr(doc, arg[1], vars);
        const len = evalExpr(doc, arg[2], vars);
        return input.substr(start, len);
      }
      case "$trim": {
        const input = String(evalExpr(doc, arg.input, vars) ?? "");
        const chars = arg.chars ? String(evalExpr(doc, arg.chars, vars)) : " ";
        const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return input.replace(new RegExp(`^[${escaped}]+|[${escaped}]+$`, "g"), "");
      }
      case "$let": {
        const nextVars = { ...vars };
        for (const [name, value] of Object.entries(arg.vars || {})) {
          nextVars[name] = evalExpr(doc, value, vars);
        }
        return evalExpr(doc, arg.in, nextVars);
      }
      case "$map": {
        const input = evalExpr(doc, arg.input, vars) || [];
        return (Array.isArray(input) ? input : []).map((item) =>
          evalExpr(doc, arg.in, { ...vars, [arg.as]: item })
        );
      }
      case "$sortArray": {
        const input = [...(evalExpr(doc, arg.input, vars) || [])];
        const sortBy = arg.sortBy;
        if (sortBy === 1 || sortBy === -1) {
          input.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0) * (sortBy === -1 ? -1 : 1));
          return input;
        }
        if (sortBy && typeof sortBy === "object") {
          const [key, dir] = Object.entries(sortBy)[0] as [string, number];
          input.sort((a, b) => {
            const av = a?.[key];
            const bv = b?.[key];
            return (av > bv ? 1 : av < bv ? -1 : 0) * (dir === -1 ? -1 : 1);
          });
        }
        return input;
      }
      case "$switch": {
        for (const branch of arg.branches || []) {
          if (evalExpr(doc, branch.case, vars)) return evalExpr(doc, branch.then, vars);
        }
        return evalExpr(doc, arg.default, vars);
      }
      default:
        return expr;
    }
  }

  const out: AnyRecord = {};
  for (const [key, value] of Object.entries(expr)) {
    out[key] = evalExpr(doc, value, vars);
  }
  return out;
}

function matchDoc(doc: AnyRecord, filter: AnyRecord): boolean {
  if (!filter || !Object.keys(filter).length) return true;
  if (filter.$or) return filter.$or.some((item: AnyRecord) => matchDoc(doc, item));
  if (filter.$and) return filter.$and.every((item: AnyRecord) => matchDoc(doc, item));

  return Object.entries(filter).every(([key, value]) => {
    if (key.startsWith("$")) return true;
    const current = getPath(doc, key === "_id" ? "id" : key);
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      const op = value as AnyRecord;
      if ("$in" in op) return (op.$in || []).map(String).includes(String(current));
      if ("$nin" in op) return !(op.$nin || []).some((item: unknown) => String(item) === String(current) || (item == null && current == null));
      if ("$ne" in op) return current !== op.$ne && String(current) !== String(op.$ne);
      if ("$regex" in op) {
        const regex = new RegExp(String(op.$regex), String(op.$options || ""));
        return regex.test(String(current ?? ""));
      }
      if ("$gt" in op) return current > op.$gt;
      if ("$gte" in op) return current >= op.$gte;
      if ("$lt" in op) return current < op.$lt;
      if ("$lte" in op) return current <= op.$lte;
    }
    if (value === true || value === false) return Boolean(current) === value;
    return current === value || String(current) === String(value);
  });
}

function sortDocs(docs: AnyRecord[], sort: AnyRecord) {
  const entries = Object.entries(sort);
  return [...docs].sort((a, b) => {
    for (const [key, dir] of entries) {
      const av = getPath(a, key);
      const bv = getPath(b, key);
      if (av == null && bv == null) continue;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av > bv) return dir === -1 ? -1 : 1;
      if (av < bv) return dir === -1 ? 1 : -1;
    }
    return 0;
  });
}

function projectDoc(doc: AnyRecord, spec: AnyRecord) {
  const next: AnyRecord = {};
  const includeId = spec._id !== 0 && spec._id !== false;
  if (includeId) {
    next._id = doc._id ?? doc.id;
    next.id = doc.id ?? doc._id;
  }

  for (const [key, value] of Object.entries(spec)) {
    if (key === "_id") continue;
    if (value === 0 || value === false) continue;
    if (value === 1 || value === true) {
      next[key] = getPath(doc, key);
    } else {
      next[key] = evalExpr(doc, value);
    }
  }
  return next;
}

function groupDocs(docs: AnyRecord[], spec: AnyRecord) {
  const groups = new Map<string, { id: any; docs: AnyRecord[] }>();
  for (const doc of docs) {
    const id = spec._id === 0 || spec._id == null ? 0 : evalExpr(doc, spec._id);
    const key = JSON.stringify(id);
    if (!groups.has(key)) groups.set(key, { id, docs: [] });
    groups.get(key)!.docs.push(doc);
  }

  return [...groups.values()].map(({ id, docs: items }) => {
    const row: AnyRecord = { _id: id };
    for (const [field, acc] of Object.entries(spec)) {
      if (field === "_id") continue;
      const op = acc && typeof acc === "object" ? Object.keys(acc)[0] : "";
      const arg = acc?.[op];
      if (op === "$addToSet") {
        const values = items.map((item) => evalExpr(item, arg)).filter((item) => item !== undefined);
        row[field] = [...new Set(values.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));
      } else if (op === "$push") {
        row[field] = items.map((item) => evalExpr(item, arg));
      } else if (op === "$first") {
        row[field] = items[0] ? evalExpr(items[0], arg) : undefined;
      } else if (op === "$sum") {
        row[field] = items.reduce((sum, item) => sum + Number(evalExpr(item, arg) || 0), 0);
      }
    }
    return row;
  });
}

function unwindDocs(docs: AnyRecord[], spec: any) {
  const path = typeof spec === "string" ? spec : spec.path;
  const preserve = typeof spec === "object" && spec.preserveNullAndEmptyArrays;
  const field = String(path).replace(/^\$/, "");
  const out: AnyRecord[] = [];
  for (const doc of docs) {
    const value = getPath(doc, field);
    if (!Array.isArray(value) || value.length === 0) {
      if (preserve) out.push({ ...doc, [field]: Array.isArray(value) ? null : value ?? null });
      continue;
    }
    for (const item of value) {
      out.push({ ...doc, [field]: item });
    }
  }
  return out;
}

function addFields(doc: AnyRecord, spec: AnyRecord) {
  const next = { ...doc };
  for (const [key, value] of Object.entries(spec)) {
    const computed = evalExpr(next, value);
    if (key.includes(".")) {
      const parts = key.split(".");
      let cursor = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cursor[parts[i]] = cursor[parts[i]] ?? {};
        cursor = cursor[parts[i]];
      }
      cursor[parts[parts.length - 1]] = computed;
    } else {
      next[key] = computed;
    }
  }
  return next;
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

async function runPipeline(docs: AnyRecord[], pipeline: AnyRecord[], lookups?: Record<string, LookupFn>) {
  let current = docs;
  for (const stage of pipeline) {
    const op = Object.keys(stage)[0];
    const arg = stage[op];
    switch (op) {
      case "$match":
        current = current.filter((doc) => matchDoc(doc, arg));
        break;
      case "$sample":
        current = shuffle(current).slice(0, arg.size);
        break;
      case "$sort":
        current = sortDocs(current, arg);
        break;
      case "$skip":
        current = current.slice(arg);
        break;
      case "$limit":
        current = current.slice(0, arg);
        break;
      case "$project":
        current = current.map((doc) => projectDoc(doc, arg));
        break;
      case "$addFields":
      case "$set":
        current = current.map((doc) => addFields(doc, arg));
        break;
      case "$unwind":
        current = unwindDocs(current, arg);
        break;
      case "$group":
        current = groupDocs(current, arg);
        break;
      case "$lookup": {
        const finder = lookups?.[arg.from];
        if (!finder) break;
        const keys = [...new Set(current.map((doc) => getPath(doc, arg.localField)).filter((item) => item != null))];
        const related = keys.length ? await finder({ [arg.foreignField]: { $in: keys } }) : [];
        current = current.map((doc) => ({
          ...doc,
          [arg.as]: related.filter((item) => String(getPath(item, arg.foreignField)) === String(getPath(doc, arg.localField))),
        }));
        break;
      }
      default:
        break;
    }
  }
  return current;
}

export class Query {
  private selectSpec?: string | AnyRecord;
  private sortSpec?: AnyRecord;
  private skipCount = 0;
  private limitCount?: number;

  constructor(
    private readonly run: (query: Query) => Promise<any>,
  ) {}

  select(spec: string | AnyRecord) {
    this.selectSpec = spec;
    return this;
  }

  sort(spec: AnyRecord) {
    this.sortSpec = spec;
    return this;
  }

  skip(count: number) {
    this.skipCount = count;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  lean() {
    return this;
  }

  get options() {
    return {
      selectSpec: this.selectSpec,
      sortSpec: this.sortSpec,
      skipCount: this.skipCount,
      limitCount: this.limitCount,
    };
  }

  exec() {
    return this.run(this);
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

export function createPrismaModel(delegate: AnyRecord, options: PrismaModelOptions) {
  const jsonArrayFields = options.jsonArrayFields || [];
  const relationContainsFields = options.relationContainsFields || {};
  const whereOf = (filter: unknown) => toPrismaWhere(filter, jsonArrayFields, relationContainsFields);
  const toWrite = (data: AnyRecord) => (options.transformWrite ? options.transformWrite(data) : data);
  const readOne = async (row: AnyRecord | null) => {
    if (!row) return null;
    const serialized = serializeDoc(row)!;
    return options.transformRead ? options.transformRead(serialized) : serialized;
  };

  const readMany = async (rows: AnyRecord[]) => {
    const serialized = serializeDocs(rows);
    return options.transformRead ? serialized.map(options.transformRead) : serialized;
  };

  const withReadShape = (selectSpec?: string | AnyRecord) => {
    const parsed = parseSelect(selectSpec);
    return {
      ...parsed,
      ...(parsed.select ? {} : { include: options.include }),
    };
  };

  const findMany = async (filter: unknown, query?: Query) => {
    const { selectSpec, sortSpec, skipCount, limitCount } = query?.options || {};
    const rows = await delegate.findMany({
      where: whereOf(filter),
      ...withReadShape(selectSpec),
      orderBy: toPrismaOrderBy(sortSpec),
      skip: skipCount || undefined,
      take: limitCount,
    });
    return readMany(rows);
  };

  function Model(this: AnyRecord, data: AnyRecord = {}) {
    Object.assign(this, data);
    this.save = async () => Model.create(this);
  }

  Model.find = (filter: unknown = {}) => new Query((query) => findMany(filter, query));

  Model.findOne = (filter: unknown = {}) =>
    new Query(async (query) => {
      const row = await delegate.findFirst({
        where: whereOf(filter),
        ...withReadShape(query.options.selectSpec),
        orderBy: toPrismaOrderBy(query.options.sortSpec),
      });
      return readOne(row);
    });

  Model.create = async (data: AnyRecord) => {
    const raw = stripUndefined(data);
    const payload = pickAllowed(toWrite(raw), options.allowedFields, options.defaults);
    if (!payload.id) payload.id = newId();
    const created = await delegate.create({
      data: payload,
      include: options.include,
    });
    if (options.createRelated) await options.createRelated(created.id, raw);
    if (options.syncRelated) await options.syncRelated(created.id, raw);
    const reloaded = options.createRelated || options.syncRelated
      ? await delegate.findUnique({ where: { id: created.id }, include: options.include })
      : created;
    return readOne(reloaded);
  };

  Model.updateOne = async (filter: AnyRecord, update: AnyRecord) => {
    const existing = await delegate.findFirst({
      where: whereOf(filter),
      select: { id: true },
    });
    if (!existing) return { acknowledged: true, modifiedCount: 0, matchedCount: 0 };

    if (update.$push && options.pushRelated) {
      for (const [field, value] of Object.entries(update.$push)) {
        await options.pushRelated(existing.id, field, value as AnyRecord);
      }
    }

    const raw = stripUndefined(unwrapUpdate(update));
    const data = pickAllowed(toWrite(raw), options.allowedFields);
    delete data.id;
    if (Object.keys(data).length) {
      await delegate.update({ where: { id: existing.id }, data });
    }
    if (options.syncRelated) await options.syncRelated(existing.id, raw);
    return { acknowledged: true, modifiedCount: 1, matchedCount: 1 };
  };

  Model.deleteOne = async (filter: AnyRecord) => {
    const existing = await delegate.findFirst({
      where: whereOf(filter),
      select: { id: true },
    });
    if (!existing) return { acknowledged: true, deletedCount: 0 };
    await delegate.delete({ where: { id: existing.id } });
    return { acknowledged: true, deletedCount: 1 };
  };

  Model.deleteMany = async (filter: AnyRecord = {}) => {
    const result = await delegate.deleteMany({ where: whereOf(filter) });
    return { acknowledged: true, deletedCount: result.count };
  };

  Model.count = async (filter: unknown = {}) =>
    delegate.count({ where: whereOf(filter) });

  Model.countDocuments = Model.count;

  Model.aggregate = async (pipeline: AnyRecord[] = []) => {
    const firstMatch = pipeline[0]?.$match;
    const rest = firstMatch ? pipeline.slice(1) : pipeline;
    const where = firstMatch ? whereOf(firstMatch) : {};

    if (rest.length === 1 && rest[0].$sample) {
      const ids = (await delegate.findMany({
        where,
        select: { id: true },
      })) as Array<{ id: string }>;
      const sampled = shuffle(ids).slice(0, rest[0].$sample.size);
      const rows = sampled.length
        ? await delegate.findMany({
            where: { id: { in: sampled.map((item) => item.id) } },
            include: options.include,
          })
        : [];
      return readMany(rows);
    }

    const rows = await delegate.findMany({ where, include: options.include });
    const docs = await readMany(rows);
    return runPipeline(docs, rest, options.lookups);
  };

  return Model;
}
