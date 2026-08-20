import { createMongoModel } from "@/app/lib/mongo-model";
import { getDatabaseType } from "@/app/lib/database-type";
import { createPrismaModel, Query, type PrismaModelOptions } from "@/app/lib/prisma-model";

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

  const getImpl = () => (getDatabaseType() === "mongodb" ? getMongoModel() : getPrismaModel());

  function Model(this: AnyRecord, data: AnyRecord = {}) {
    Object.assign(this, data);
    this.save = async () => Model.create(this);
  }

  Model.find = (filter: unknown = {}) =>
    new Query((query) => applyQuery(getImpl().find(filter), query));

  Model.findOne = (filter: unknown = {}) =>
    new Query((query) => applyQuery(getImpl().findOne(filter), query));

  Model.create = async (data: AnyRecord) => getImpl().create(data);
  Model.updateOne = async (filter: AnyRecord, update: AnyRecord) =>
    getImpl().updateOne(filter, update);
  Model.deleteOne = async (filter: AnyRecord) => getImpl().deleteOne(filter);
  Model.deleteMany = async (filter: AnyRecord = {}) => getImpl().deleteMany(filter);
  Model.count = async (filter: unknown = {}) => getImpl().count(filter);
  Model.countDocuments = Model.count;
  Model.aggregate = async (pipeline: AnyRecord[] = []) => getImpl().aggregate(pipeline);

  return Model;
}
