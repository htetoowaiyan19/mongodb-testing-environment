const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");
const { runSourceCodeOperation } = require("./config");

/*
  ============================================================
  App Overview
  ============================================================
  This server exposes a MongoDB playground with three ways to run queries:
  1) Builder mode in the UI (individual form fields)
  2) Manual mode in the UI (raw JSON payload)
  3) Source-code mode (edit config.js, then click one button)
  4) Built-in local dataset mode (load JSON files from local-data/)

  Mongoose is used as the database layer so users can explore MongoDB
  behavior while still seeing clean Node.js source code structure.
*/

const app = express();

/*
  Server and DB configuration:
  - PORT controls where Express listens.
  - MONGODB_URI is your Mongo connection string.
  - MONGODB_DB is the logical database name inside the Mongo server.
*/
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://jerrydb:1972005@clustername.u5wwvtg.mongodb.net/dbname?retryWrites=true&w=majority";
const MONGODB_DB = process.env.MONGODB_DB || "mongo_playground";
const LOCAL_DATA_DIR = path.join(__dirname, "local-data");

/*
  We keep a simple in-memory flag to avoid reconnecting on every request.
  In a production app, you might add stronger connection state handling
  (retry strategy, shutdown hooks, metrics), but this is enough for a
  classroom playground.
*/
let isConnected = false;

/*
  getDb()
  Establishes a single Mongoose connection and returns the raw DB object.

  Why return mongoose.connection.db?
  - We use this object for commands like ping and listCollections.
  - Query execution itself is handled via dynamic Mongoose models.
*/
async function getDb() {
  if (!isConnected) {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
  }

  return mongoose.connection.db;
}

/*
  parseJson(value, fallback)
  The UI sends many fields as strings. This helper converts them into objects.

  Rules:
  - empty/null/undefined -> fallback
  - object already supplied -> return as-is
  - otherwise parse string as JSON
*/
function parseJson(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  return JSON.parse(value);
}

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

  if (segments.length === 0) {
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
  if (!action) {
    throw new Error("Each operation step requires action.");
  }

  switch (action) {
    case "set": {
      const pathValue = step.path || step.to;
      if (!pathValue) throw new Error("set action requires path.");
      const nextValue = resolveTemplateValue(step.value, currentDoc);
      setValueAtPath(currentDoc, pathValue, nextValue);
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
      const value = getValueAtPath(currentDoc, from);
      setValueAtPath(currentDoc, to, value);
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
      const currentValue = getValueAtPath(currentDoc, pathValue);
      const base = typeof currentValue === "number" ? currentValue : 0;
      setValueAtPath(currentDoc, pathValue, base + amount);
      return { action, path: pathValue, by: amount };
    }
    case "push": {
      const pathValue = step.path;
      if (!pathValue) throw new Error("push action requires path.");
      const nextValue = resolveTemplateValue(step.value, currentDoc);
      const currentValue = getValueAtPath(currentDoc, pathValue);
      const asArray = Array.isArray(currentValue) ? currentValue.slice() : [];
      asArray.push(nextValue);
      setValueAtPath(currentDoc, pathValue, asArray);
      return { action, path: pathValue };
    }
    case "pull": {
      const pathValue = step.path;
      if (!pathValue) throw new Error("pull action requires path.");
      const nextValue = resolveTemplateValue(step.value, currentDoc);
      const currentValue = getValueAtPath(currentDoc, pathValue);
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
  const filter = parseJson(payload.filter, {});
  const projection = parseJson(payload.projection, undefined);
  const sort = parseJson(payload.sort, undefined);
  const options = parseJson(payload.options, {});
  const steps = parseJson(payload.steps, []);
  const maxDocs = Number(payload.maxDocs ?? options.maxDocs ?? 1);
  const shouldApplyToMany = Boolean(payload.multi ?? options.multi);

  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error("operation requires a non-empty steps array.");
  }

  if (!Number.isFinite(maxDocs) || maxDocs <= 0) {
    throw new Error("operation maxDocs must be a positive number.");
  }
  if (projection !== undefined && projection !== null) {
    throw new Error("operation does not support projection. Read-modify-write needs full documents.");
  }

  const queryLimit = shouldApplyToMany ? Math.floor(maxDocs) : 1;
  let query = model.find(filter, undefined, options);
  if (sort) query = query.sort(sort);
  query = query.limit(queryLimit);
  const docs = await query.lean().exec();

  if (!docs.length) {
    return {
      matchedCount: 0,
      modifiedCount: 0,
      documents: [],
      message: "No documents matched filter for operation.",
    };
  }

  const resultDocuments = [];
  let modifiedCount = 0;

  for (const originalDoc of docs) {
    const currentDoc = JSON.parse(JSON.stringify(originalDoc));
    const stepResults = [];

    for (const step of steps) {
      stepResults.push(applyOperationStep(currentDoc, step));
    }

    await model.collection.replaceOne({ _id: originalDoc._id }, currentDoc, {
      upsert: false,
    });

    modifiedCount += 1;
    resultDocuments.push({
      _id: originalDoc._id,
      steps: stepResults,
      before: originalDoc,
      after: currentDoc,
    });
  }

  return {
    matchedCount: docs.length,
    modifiedCount,
    documents: resultDocuments,
  };
}

/*
  readLocalDataset(fileName)
  Reads one JSON file from local-data and validates the expected array shape.
*/
async function readLocalDataset(fileName) {
  const filePath = path.join(LOCAL_DATA_DIR, fileName);
  const fileContent = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(fileContent);
  if (!Array.isArray(parsed)) {
    throw new Error(`${fileName} must contain a JSON array.`);
  }
  return parsed;
}

function collectionNameFromFile(fileName) {
  return path
    .parse(fileName)
    .name.replace(/[^a-zA-Z0-9_]/g, "_")
    .toLowerCase();
}

async function listLocalDatasets() {
  const dirEntries = await fs.readdir(LOCAL_DATA_DIR, { withFileTypes: true });
  const jsonFiles = dirEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const summary = [];
  for (const file of jsonFiles) {
    const records = await readLocalDataset(file);
    summary.push({
      file,
      collection: collectionNameFromFile(file),
      count: records.length,
    });
  }

  return summary;
}

async function resolveSelectedDatasets(selectedCollections) {
  const available = await listLocalDatasets();

  if (!Array.isArray(selectedCollections) || selectedCollections.length === 0) {
    return available;
  }

  const selectedSet = new Set(selectedCollections.map((item) => String(item)));
  const matched = available.filter((dataset) => selectedSet.has(dataset.collection));

  if (matched.length !== selectedSet.size) {
    const availableNames = available.map((item) => item.collection).join(", ");
    throw new Error(
      `Some selected datasets were not found. Available datasets: ${availableNames}`
    );
  }

  return matched;
}

async function loadSelectedDatasets(dbInstance, selectedDatasets, reset) {
  const result = [];

  for (const dataset of selectedDatasets) {
    const records = await readLocalDataset(dataset.file);
    const collection = dbInstance.collection(dataset.collection);

    let deletedCount = 0;
    if (reset) {
      const deleteResult = await collection.deleteMany({});
      deletedCount = deleteResult.deletedCount || 0;
    }

    let insertedCount = 0;
    if (records.length > 0) {
      const insertResult = await collection.insertMany(records);
      insertedCount = insertResult.insertedCount || records.length;
    }

    result.push({
      collection: dataset.collection,
      insertedCount,
      deletedCount,
    });
  }

  return result;
}

async function deleteSelectedDatasets(dbInstance, selectedDatasets) {
  const result = [];

  for (const dataset of selectedDatasets) {
    const collection = dbInstance.collection(dataset.collection);
    const deleteResult = await collection.deleteMany({});
    result.push({
      collection: dataset.collection,
      deletedCount: deleteResult.deletedCount || 0,
    });
  }

  return result;
}

/*
  getDynamicModel(collectionName)
  Creates a schema-less Mongoose model for any collection name.

  Why schema-less?
  - This playground should support any shape of document.
  - Users can test queries without defining a schema first.

  Why cache by model name?
  - Mongoose keeps model definitions globally.
  - Reusing existing models avoids "OverwriteModelError".
*/
function getDynamicModel(collectionName) {
  const modelName = `Dynamic_${collectionName.replace(/[^a-zA-Z0-9_]/g, "_")}`;

  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  const schema = new mongoose.Schema({}, { strict: false, minimize: false });
  return mongoose.model(modelName, schema, collectionName);
}

/*
  runOperation(payload)
  Core dispatcher for the builder/manual UI modes.

  Payload shape:
  {
    collection: "users",
    operation: "find" | "createOne"/"insertOne" | ...,
    filter, projection, sort, update, document, documents, pipeline, options, limit
  }

  This function supports common CRUD + aggregation and returns the raw result.
*/
async function runOperation(payload) {
  const collectionName = (payload.collection || "").trim();
  if (!collectionName) {
    throw new Error("Collection is required.");
  }
  const operation = payload.operation;
  const model = getDynamicModel(collectionName);

  // Inputs are normalized from strings into usable JS objects.
  const filter = parseJson(payload.filter, {});
  const projection = parseJson(payload.projection, undefined);
  const sort = parseJson(payload.sort, undefined);
  const update = parseJson(payload.update, undefined);
  const document = parseJson(payload.document, undefined);
  const documents = parseJson(payload.documents, undefined);
  const pipeline = parseJson(payload.pipeline, []);
  const steps = parseJson(payload.steps, []);
  const options = parseJson(payload.options, {});
  const limit = Number(payload.limit || 10);

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
      return runDocumentOperation(model, { ...payload, steps, options, filter, projection, sort });
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

/*
  Express setup:
  - EJS rendering
  - static assets from /public
  - JSON body parsing for API requests
*/
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main page
app.get("/", (req, res) => {
  res.render("index", { defaultDbName: MONGODB_DB });
});

/*
  Health endpoint:
  - confirms MongoDB connection
  - returns selected db name so users know where they are connected
*/
app.get("/api/health", async (req, res) => {
  try {
    const dbInstance = await getDb();
    await dbInstance.command({ ping: 1 });
    res.json({
      ok: true,
      message: "MongoDB connection is healthy.",
      dbName: dbInstance.databaseName,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
      hint: `Start MongoDB and verify MONGODB_URI (${MONGODB_URI}) and MONGODB_DB (${MONGODB_DB}).`,
    });
  }
});

/*
  Collections endpoint:
  - lists all collections in current db
  - useful for quick discovery before testing queries
*/
app.get("/api/collections", async (req, res) => {
  try {
    const dbInstance = await getDb();
    const collections = await dbInstance.listCollections().toArray();
    res.json({
      ok: true,
      data: collections.map((item) => item.name),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

/*
  Built-in local dataset endpoint:
  - reads JSON files in local-data/
  - returns dataset metadata so users know what exists before loading
*/
app.get("/api/local-datasets", async (req, res) => {
  try {
    const summary = await listLocalDatasets();
    res.json({
      ok: true,
      data: summary,
      totalRecords: summary.reduce((total, item) => total + item.count, 0),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

/*
  Built-in data loader endpoint:
  - loads JSON arrays from local-data/*.json into MongoDB
  - default behavior is reset=true, so classroom data stays consistent
  - set { "reset": false } to append instead
*/
app.post("/api/load-local-datasets", async (req, res) => {
  try {
    const dbInstance = await getDb();
    const selectedDatasets = await resolveSelectedDatasets(req.body.datasets);
    const reset = false;
    const result = await loadSelectedDatasets(dbInstance, selectedDatasets, reset);

    res.json({
      ok: true,
      message: "Selected local datasets appended to MongoDB (no reset).",
      reset,
      selectedCollections: selectedDatasets.map((item) => item.collection),
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
});

app.post("/api/reset-local-datasets", async (req, res) => {
  try {
    const dbInstance = await getDb();
    const selectedDatasets = await resolveSelectedDatasets(req.body.datasets);
    const result = await loadSelectedDatasets(dbInstance, selectedDatasets, true);
    res.json({
      ok: true,
      message: "Selected local datasets reset and reloaded successfully.",
      reset: true,
      selectedCollections: selectedDatasets.map((item) => item.collection),
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
});

app.post("/api/delete-local-datasets", async (req, res) => {
  try {
    const dbInstance = await getDb();
    const selectedDatasets = await resolveSelectedDatasets(req.body.datasets);
    const result = await deleteSelectedDatasets(dbInstance, selectedDatasets);
    res.json({
      ok: true,
      message: "Selected local datasets deleted from MongoDB.",
      selectedCollections: selectedDatasets.map((item) => item.collection),
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
});

/*
  Query endpoint for builder/manual UI modes.
  - Builder mode sends individual fields.
  - Manual mode sends one JSON object in manualQuery.
  - For create operations, use createOne/createMany (aliases of insertOne/insertMany).
*/
app.post("/api/query", async (req, res) => {
  try {
    await getDb();
    const payload =
      req.body.mode === "manual" ? parseJson(req.body.manualQuery, {}) : req.body;

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Manual query must be a JSON object.");
    }

    const result = await runOperation(payload);
    res.json({
      ok: true,
      data: result,
      source: "ui",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
});

/*
  Source-code endpoint:
  - Executes a single function from config.js
  - Users edit SOURCE_CODE_QUERY in that file, save, then click button in UI.
  - This gives a "coding inside source file" workflow.
*/
app.post("/api/run-source-operation", async (req, res) => {
  try {
    await getDb();
    const data = await runSourceCodeOperation();
    res.json({
      ok: true,
      data,
      source: "config.js",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
      source: "config.js",
    });
  }
});

/*
  Startup:
  - Start HTTP server first
  - Attempt database connection immediately so startup logs are explicit
*/
app.listen(PORT, async () => {
  try {
    const dbInstance = await getDb();
    console.log(
      `Mongo Playground running at http://localhost:${PORT} (db: ${dbInstance.databaseName}, via Mongoose)`
    );
  } catch (error) {
    console.error(`Server started, but MongoDB failed: ${error.message}`);
    console.log(`Open http://localhost:${PORT} after fixing MongoDB settings.`);
  }
});
