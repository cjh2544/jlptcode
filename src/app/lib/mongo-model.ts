import { ObjectId, type Document } from "mongodb";
import { getMongoCollection } from "@/app/lib/mongo";
import { Query } from "@/app/lib/prisma-model";

type AnyRecord = Record<string, any>;

export type MongoModelOptions = {
  defaults?: AnyRecord;
  mongoDefaults?: AnyRecord;
};

function asPlainFilter(filter: unknown): AnyRecord {
  if (!filter) return {};
  if (typeof URLSearchParams !== "undefined" && filter instanceof URLSearchParams) {
    return Object.fromEntries(filter.entries());
  }
  return { ...(filter as AnyRecord) };
}

function toMongoId(value: unknown) {
  if (value instanceof ObjectId) return value;
  if (typeof value === "string" && value.length === 24 && ObjectId.isValid(value)) {
    return new ObjectId(value);
  }
  return value;
}

function convertIdValue(value: unknown): unknown {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map(convertIdValue);
  if (typeof value === "object") {
    const obj = value as AnyRecord;
    if ("$in" in obj || "$nin" in obj || "$ne" in obj || "$eq" in obj) {
      const next: AnyRecord = {};
      for (const [key, val] of Object.entries(obj)) {
        next[key] = key === "$in" || key === "$nin" ? (val as unknown[]).map(toMongoId) : toMongoId(val);
      }
      return next;
    }
  }
  return toMongoId(value);
}

function rewriteIds(value: unknown): unknown {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(rewriteIds);
  if (value instanceof Date || value instanceof ObjectId || value instanceof RegExp) return value;

  const next: AnyRecord = {};
  for (const [key, val] of Object.entries(value as AnyRecord)) {
    const field = key === "id" ? "_id" : key;
    if (field === "_id") next._id = convertIdValue(val);
    else next[field] = rewriteIds(val);
  }
  return next;
}

function toMongoFilter(filter: unknown): AnyRecord {
  return rewriteIds(asPlainFilter(filter)) as AnyRecord;
}

function serializeValue(value: unknown): unknown {
  if (value == null) return value;
  if (value instanceof ObjectId) return value.toHexString();
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === "object") {
    const obj = value as AnyRecord;
    const next: AnyRecord = {};
    for (const [key, val] of Object.entries(obj)) {
      if (key === "_id") {
        const id = serializeValue(val);
        next._id = id;
        if (next.id == null) next.id = id;
      } else {
        next[key] = serializeValue(val);
      }
    }
    return next;
  }
  return value;
}

function serializeDoc(doc: AnyRecord | null | undefined) {
  if (!doc) return null;
  return serializeValue(doc) as AnyRecord;
}

function toMongoProjection(select?: string | AnyRecord) {
  if (!select) return undefined;
  if (typeof select === "object") {
    const projection: AnyRecord = {};
    for (const [key, value] of Object.entries(select)) {
      projection[key === "id" ? "_id" : key] = value ? 1 : 0;
    }
    return projection;
  }

  const tokens = String(select)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const projection: AnyRecord = {};
  for (const token of tokens) {
    if (token.startsWith("-")) projection[token.slice(1)] = 0;
    else projection[token === "id" || token === "_id" ? "_id" : token] = 1;
  }
  return projection;
}

function toMongoSort(sort?: AnyRecord) {
  if (!sort) return undefined;
  const next: AnyRecord = {};
  for (const [key, dir] of Object.entries(sort)) {
    next[key === "id" ? "_id" : key] = dir === -1 || dir === "desc" ? -1 : 1;
  }
  return next;
}

function stripUndefined(value: AnyRecord) {
  const next: AnyRecord = {};
  for (const [key, val] of Object.entries(value || {})) {
    if (val !== undefined && key !== "confirm-password") next[key] = val;
  }
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

export function createMongoModel(collectionName: string, options: MongoModelOptions = {}) {
  const collectionOf = () => getMongoCollection(collectionName);

  const findMany = async (filter: unknown, query?: Query) => {
    const { selectSpec, sortSpec, skipCount, limitCount } = query?.options || {};
    let cursor = (await collectionOf()).find(toMongoFilter(filter) as Document);
    const projection = toMongoProjection(selectSpec);
    if (projection) cursor = cursor.project(projection);
    const sort = toMongoSort(sortSpec);
    if (sort) cursor = cursor.sort(sort);
    if (skipCount) cursor = cursor.skip(skipCount);
    if (limitCount != null) cursor = cursor.limit(limitCount);
    const rows = await cursor.toArray();
    return rows.map((row) => serializeDoc(row)!);
  };

  function Model(this: AnyRecord, data: AnyRecord = {}) {
    Object.assign(this, data);
    this.save = async () => Model.create(this);
  }

  Model.find = (filter: unknown = {}) => new Query((query) => findMany(filter, query));

  Model.findOne = (filter: unknown = {}) =>
    new Query(async (query) => {
      const { selectSpec, sortSpec } = query.options;
      const row = await (await collectionOf()).findOne(toMongoFilter(filter) as Document, {
        projection: toMongoProjection(selectSpec),
        sort: toMongoSort(sortSpec),
      });
      return serializeDoc(row);
    });

  Model.create = async (data: AnyRecord) => {
    const now = new Date();
    const payload = stripUndefined({
      ...(options.mongoDefaults || {}),
      ...(options.defaults || {}),
      ...data,
    });
    if (payload.id && !payload._id) payload._id = toMongoId(payload.id);
    delete payload.id;
    if (!payload._id) payload._id = new ObjectId();
    if (!payload.createdAt) payload.createdAt = now;
    payload.updatedAt = payload.updatedAt || now;
    await (await collectionOf()).insertOne(payload);
    return serializeDoc(payload);
  };

  Model.updateOne = async (filter: AnyRecord, update: AnyRecord) => {
    const mongoFilter = toMongoFilter(filter);
    const now = new Date();
    const operation: AnyRecord = {};

    if (update.$push) operation.$push = update.$push;
    if (update.$unset) operation.$unset = update.$unset;

    if (update.$push || update.$set || update.$unset) {
      operation.$set = { ...(update.$set || {}), updatedAt: now };
    } else {
      const data = stripUndefined(unwrapUpdate(update));
      delete data.id;
      delete data._id;
      operation.$set = { ...data, updatedAt: now };
    }

    const result = await (await collectionOf()).updateOne(mongoFilter as Document, operation);
    return {
      acknowledged: true,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    };
  };

  Model.deleteOne = async (filter: AnyRecord) => {
    const result = await (await collectionOf()).deleteOne(toMongoFilter(filter) as Document);
    return { acknowledged: true, deletedCount: result.deletedCount };
  };

  Model.deleteMany = async (filter: AnyRecord = {}) => {
    const result = await (await collectionOf()).deleteMany(toMongoFilter(filter) as Document);
    return { acknowledged: true, deletedCount: result.deletedCount };
  };

  Model.count = async (filter: unknown = {}) =>
    (await collectionOf()).countDocuments(toMongoFilter(filter) as Document);

  Model.countDocuments = Model.count;

  Model.aggregate = async (pipeline: AnyRecord[] = []) => {
    const rewritten = (rewriteIds(pipeline) as AnyRecord[]) || pipeline;
    const rows = await (await collectionOf()).aggregate(rewritten).toArray();
    return rows.map((row) => serializeDoc(row)!);
  };

  return Model;
}
