const mongoose = require("mongoose");

// Edit this object directly to "code queries in source code".
// The Run Source Code Query button in the UI executes this object.
const SOURCE_CODE_QUERY = {
  
};

function ensureObject(value, errorMessage) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

function pathToSegments(pathValue) {
  if (typeof pathValue !== "string" || !pathValue.trim()) {
    throw new Error("Path must be a non-empty string.");
  }

  const segments = pathValue
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) {
    throw new Error("Path must include at least one segment.");
  }

  for (const segment of segments) {
    if (segment === "__proto__" || segment === "constructor" || segment === "prototype") {
      throw new Error(`Disallowed path segment: ${segment}`);
    }
  }

  return segments;
}

function getValueAtPath(target, pathValue) {
  const segments = pathToSegments(pathValue);
  let current = target;
  for (const segment of segments) {
    if (current === null || typeof current !== "object") return undefined;
    current = current[segment];
  }
  return current;
}

function setValueAtPath(target, pathValue, nextValue) {
  const segments = pathToSegments(pathValue);
  let current = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (
      current[segment] === undefined ||
      current[segment] === null ||
      typeof current[segment] !== "object" ||
      Array.isArray(current[segment])
    ) {
      current[segment] = {};
    }
    current = current[segment];
  }
  current[segments[segments.length - 1]] = nextValue;
}

function deleteValueAtPath(target, pathValue) {
  const segments = pathToSegments(pathValue);
  let current = target;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (current[segment] === undefined || current[segment] === null || typeof current[segment] !== "object") {
      return false;
    }
    current = current[segment];
  }

  const leaf = segments[segments.length - 1];
  if (Object.prototype.hasOwnProperty.call(current, leaf)) {
    delete current[leaf];
    return true;
  }
  return false;
}

function resolveTemplateValue(template, currentDoc) {
  if (Array.isArray(template)) {
    return template.map((item) => resolveTemplateValue(item, currentDoc));
  }

  if (template && typeof template === "object") {
    if (Object.keys(template).length === 1 && Object.prototype.hasOwnProperty.call(template, "$field")) {
      return getValueAtPath(currentDoc, template.$field);
    }

    const result = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = resolveTemplateValue(value, currentDoc);
    }
    return result;
  }

  return template;
}

function applyOperationStep(currentDoc, rawStep) {
  const step = ensureObject(rawStep, "Each operation step must be an object.");
  const action = String(step.action || "").trim();
  if (!action) throw new Error("Each operation step requires action.");

  switch (action) {
    case "set": {
      const pathValue = step.path || step.to;
      if (!pathValue) throw new Error("set action requires path.");
      setValueAtPath(currentDoc, pathValue, resolveTemplateValue(step.value, currentDoc));
      return { action, path: pathValue };
    }
    case "copy": {
      const from = step.from;
      const to = step.to;
      if (!from || !to) throw new Error("copy action requires from and to.");
      setValueAtPath(currentDoc, to, getValueAtPath(currentDoc, from));
      return { action, from, to };
    }
    case "rename": {
      const from = step.from;
      const to = step.to;
      if (!from || !to) throw new Error("rename action requires from and to.");
      setValueAtPath(currentDoc, to, getValueAtPath(currentDoc, from));
      deleteValueAtPath(currentDoc, from);
      return { action, from, to };
    }
    case "delete":
    case "unset": {
      const pathValue = step.path || step.from;
      if (!pathValue) throw new Error(`${action} action requires path.`);
      return { action, path: pathValue, deleted: deleteValueAtPath(currentDoc, pathValue) };
    }
    case "inc": {
      const pathValue = step.path;
      if (!pathValue) throw new Error("inc action requires path.");
      const amount = Number(step.value ?? step.by ?? 1);
      if (!Number.isFinite(amount)) throw new Error("inc action requires a numeric value.");
      const base = typeof getValueAtPath(currentDoc, pathValue) === "number" ? getValueAtPath(currentDoc, pathValue) : 0;
      setValueAtPath(currentDoc, pathValue, base + amount);
      return { action, path: pathValue, by: amount };
    }
    case "push": {
      const pathValue = step.path;
      if (!pathValue) throw new Error("push action requires path.");
      const currentValue = getValueAtPath(currentDoc, pathValue);
      const asArray = Array.isArray(currentValue) ? currentValue.slice() : [];
      asArray.push(resolveTemplateValue(step.value, currentDoc));
      setValueAtPath(currentDoc, pathValue, asArray);
      return { action, path: pathValue };
    }
    case "pull": {
      const pathValue = step.path;
      if (!pathValue) throw new Error("pull action requires path.");
      const currentValue = getValueAtPath(currentDoc, pathValue);
      const nextValue = resolveTemplateValue(step.value, currentDoc);
      if (!Array.isArray(currentValue)) {
        setValueAtPath(currentDoc, pathValue, []);
      } else {
        setValueAtPath(
          currentDoc,
          pathValue,
          currentValue.filter((item) => JSON.stringify(item) !== JSON.stringify(nextValue))
        );
      }
      return { action, path: pathValue };
    }
    default:
      throw new Error(`Unsupported operation step action: ${action}`);
  }
}

async function runDocumentOperation(model, payload) {
  const filter = payload.filter ?? {};
  const sort = payload.sort;
  const steps = payload.steps ?? [];
  const options = payload.options ?? {};
  const maxDocs = Number(payload.maxDocs ?? options.maxDocs ?? 1);
  const shouldApplyToMany = Boolean(payload.multi ?? options.multi);

  if (!Array.isArray(steps) || !steps.length) {
    throw new Error("operation requires a non-empty steps array.");
  }
  if (!Number.isFinite(maxDocs) || maxDocs <= 0) {
    throw new Error("operation maxDocs must be a positive number.");
  }
  if (payload.projection !== undefined && payload.projection !== null) {
    throw new Error("operation does not support projection. Read-modify-write needs full documents.");
  }

  let query = model.find(filter);
  if (sort) query = query.sort(sort);
  query = query.limit(shouldApplyToMany ? Math.floor(maxDocs) : 1);
  const docs = await query.lean().exec();

  if (!docs.length) {
    return {
      matchedCount: 0,
      modifiedCount: 0,
      documents: [],
      message: "No documents matched filter for operation.",
    };
  }

  const documents = [];
  for (const originalDoc of docs) {
    const currentDoc = JSON.parse(JSON.stringify(originalDoc));
    const stepResults = [];
    for (const step of steps) {
      stepResults.push(applyOperationStep(currentDoc, step));
    }
    await model.collection.replaceOne({ _id: originalDoc._id }, currentDoc, { upsert: false });
    documents.push({ _id: originalDoc._id, steps: stepResults, before: originalDoc, after: currentDoc });
  }

  return {
    matchedCount: docs.length,
    modifiedCount: documents.length,
    documents,
  };
}

function getSourceDynamicModel(collectionName) {
  const modelName = `SourceCode_${collectionName.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  return (
    mongoose.models[modelName] ||
    mongoose.model(
      modelName,
      new mongoose.Schema({}, { strict: false, minimize: false }),
      collectionName
    )
  );
}

async function runSourceCodeOperation() {
  const payload = SOURCE_CODE_QUERY;
  const operation = payload.operation;

  const collectionName = (payload.collection || "").trim();
  if (!collectionName) {
    throw new Error("SOURCE_CODE_QUERY.collection is required.");
  }

  const model = getSourceDynamicModel(collectionName);

  const filter = payload.filter ?? {};
  const projection = payload.projection;
  const sort = payload.sort;
  const update = payload.update;
  const document = payload.document;
  const documents = payload.documents;
  const pipeline = payload.pipeline ?? [];
  const steps = payload.steps ?? [];
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
    case "operation":
      return runDocumentOperation(model, { ...payload, filter, sort, steps, options });
    default:
      throw new Error(`Unsupported operation in SOURCE_CODE_QUERY: ${operation}`);
  }
}

module.exports = { runSourceCodeOperation };
