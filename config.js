const mongoose = require("mongoose");

// Edit this object directly to "code queries in source code".
// The Run Source Code Query button in the UI executes this object.
const SOURCE_CODE_QUERY = {
  
};

async function runSourceCodeOperation() {
  const payload = SOURCE_CODE_QUERY;
  const collectionName = (payload.collection || "").trim();
  if (!collectionName) {
    throw new Error("SOURCE_CODE_QUERY.collection is required.");
  }

  const operation = payload.operation;
  const modelName = `SourceCode_${collectionName.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  const model =
    mongoose.models[modelName] ||
    mongoose.model(
      modelName,
      new mongoose.Schema({}, { strict: false, minimize: false }),
      collectionName
    );

  const filter = payload.filter ?? {};
  const projection = payload.projection;
  const sort = payload.sort;
  const update = payload.update;
  const document = payload.document;
  const documents = payload.documents;
  const pipeline = payload.pipeline ?? [];
  const options = payload.options ?? {};
  const limit = Number(payload.limit ?? 10);

  switch (operation) {
    case "find": {
      let query = model.find(filter, projection, options);
      if (sort) query = query.sort(sort);
      if (Number.isFinite(limit) && limit > 0) query = query.limit(limit);
      return query.lean().exec();
    }
    case "findOne":
      return model.findOne(filter, projection, options).sort(sort).lean().exec();
    case "createOne":
    case "insertOne": {
      const created = await model.create(document);
      return created.toObject();
    }
    case "createMany":
    case "insertMany": {
      const created = await model.insertMany(documents, options);
      return created.map((doc) => doc.toObject());
    }
    case "updateOne":
      return model.updateOne(filter, update, options);
    case "updateMany":
      return model.updateMany(filter, update, options);
    case "deleteOne":
      return model.deleteOne(filter, options);
    case "deleteMany":
      return model.deleteMany(filter, options);
    case "aggregate": {
      const aggregateQuery = model.aggregate(pipeline);
      if (options && typeof options === "object") aggregateQuery.option(options);
      return aggregateQuery.exec();
    }
    default:
      throw new Error(`Unsupported operation in SOURCE_CODE_QUERY: ${operation}`);
  }
}

module.exports = { runSourceCodeOperation };
