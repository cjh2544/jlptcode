import { createMongoModel } from "@/app/lib/mongo-model";
import { createPrismaModel, Query, type PrismaModelOptions } from "@/app/lib/prisma-model";
import { resolveDatabaseType } from "@/app/lib/resolve-database";

type AnyRecord = Record<string, any>;

export type CreateModelOptions = PrismaModelOptions & {
  collection: string;
  prisma: AnyRecord;
  mongoDefaults?: AnyRecord;
};

function applyQuery(target: Query, source: Query) {
  const { selectSpec, sortSpec, skipCount, limitCount } = source.options;
  if (selectSpec) target.select(selectSpec);
  if (sortSpec) target.sort(sortSpec);
  if (skipCount) target.skip(skipCount);
  if (limitCount != null) target.limit(limitCount);
  return target;
}

export function createModel(options: CreateModelOptions) {
  let prismaModel: any;
  let mongoModel: any;

  const getPrismaModel = () => {
    if (!prismaModel) prismaModel = createPrismaModel(options.prisma, options);
    return prismaModel;
  };

  const getMongoModel = () => {
    if (!mongoModel) {
      mongoModel = createMongoModel(options.collection, {
        defaults: options.defaults,
        mongoDefaults: options.mongoDefaults,
      });
    }
    return mongoModel;
  };

  const getImpl = async () =>
    (await resolveDatabaseType()) === "mongodb" ? getMongoModel() : getPrismaModel();

  function Model(this: AnyRecord, data: AnyRecord = {}) {
    Object.assign(this, data);
    this.save = async () => Model.create(this);
  }

  Model.find = (filter: unknown = {}) =>
    new Query(async (query) => applyQuery((await getImpl()).find(filter), query));

  Model.findOne = (filter: unknown = {}) =>
    new Query(async (query) => applyQuery((await getImpl()).findOne(filter), query));

  Model.create = async (data: AnyRecord) => (await getImpl()).create(data);
  Model.updateOne = async (filter: AnyRecord, update: AnyRecord) =>
    (await getImpl()).updateOne(filter, update);
  Model.deleteOne = async (filter: AnyRecord) => (await getImpl()).deleteOne(filter);
  Model.deleteMany = async (filter: AnyRecord = {}) => (await getImpl()).deleteMany(filter);
  Model.count = async (filter: unknown = {}) => (await getImpl()).count(filter);
  Model.countDocuments = Model.count;
  Model.aggregate = async (pipeline: AnyRecord[] = []) => (await getImpl()).aggregate(pipeline);

  return Model;
}
