# MongoDB Testing Playground (Mongoose)

This project is a basic classroom-friendly MongoDB playground built with:

- Express (web server)
- EJS (page rendering)
- Mongoose (MongoDB access)

The goal is to let students test MongoDB queries from one UI and also from actual source code.
It also includes local JSON dataset support so users can start querying immediately without creating DB data first.

## What is MongoDB?
Learn MongoDB directly at our page:
- [In Burmese](./lessons/LESSONS_MY.md)
- [In English]()

## Core idea

You can execute queries in 4 different styles:

1. Builder mode (form fields)
2. Manual mode (raw JSON)
3. Source-code mode (edit one JS file, then click a button)
4. Built-in local dataset mode (load pre-made JSON collections via API)

Source-code mode gives the "coding directly in project files" experience while still having immediate UI feedback.

## Features

- MongoDB connection health check
- Collection discovery
- Dynamic local dataset loading from all `local-data/*.json` files
- CRUD + aggregate operations:
  - `find`, `findOne`
  - `createOne`, `createMany` (also supports `insertOne`, `insertMany` aliases)
  - `updateOne`, `updateMany`
  - `deleteOne`, `deleteMany`
  - `aggregate`
  - `operation` (step-by-step read/modify/write with field-level actions)
- Schema-less dynamic models so any collection/document shape can be tested

## Project structure

- `app.js`
  - Main Express server
  - Mongoose connection setup
  - API routes
  - Generic query dispatcher for builder/manual mode
- `config.js`
  - Contains one function: `runSourceCodeOperation()`
  - Contains one editable object: `SOURCE_CODE_QUERY`
  - Button in page executes this function
- `views/index.ejs`
  - UI with query workflows + local dataset loader buttons
- `public/css/style.css`
  - Basic styling
- `local-data/`
  - Local JSON files used as classroom seed data
  - Every `.json` file here is auto-detected as a selectable dataset
- `scripts/generateSampleData.js`
  - Regenerates local seed JSON files

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set environment variables (PowerShell):

```powershell
$env:MONGODB_URI="mongodb://127.0.0.1:27017"
$env:MONGODB_DB="mongo_playground"
```

3. Start server:

```bash
npm run dev
```

Optional: regenerate built-in local JSON files:

```bash
npm run generate-sample-data
```

4. Open browser:

`http://localhost:3000`

## API endpoints

- `GET /api/health`
  - Checks DB connection by running Mongo `ping`
- `GET /api/collections`
  - Lists all collections in selected database
- `POST /api/query`
  - Executes builder/manual payload
- `POST /api/run-source-operation`
  - Executes `runSourceCodeOperation()` from `config.js`
- `GET /api/local-datasets`
  - Shows detected local JSON datasets and record counts
- `POST /api/load-local-datasets`
  - Loads selected local JSON files into MongoDB collections
  - Appends data (does not delete existing modified docs)
- `POST /api/reset-local-datasets`
  - Deletes docs in selected collections, then reloads selected JSON files
- `POST /api/delete-local-datasets`
  - Deletes docs in selected collections without reloading

## Built-in local dataset mode (for classroom use)

1. Click `Show Local Datasets` in UI to inspect available local JSON files.
2. Select one or multiple datasets from the dataset selector.
3. Click `Load Local Datasets` in UI (append mode).
4. Optional: Click `Reset Local Datasets` if you want clean seed state for selected datasets.
5. Optional: Click `Delete Local Datasets` to clear selected datasets.
3. Query collections immediately:
   - `demo_users`
   - `demo_products`
   - `demo_orders`

This creates 450 records ready for practicing:

- filters (`$gt`, `$in`, `$and`, `$or`)
- projection
- sorting + pagination (`limit`)
- update operators (`$set`, `$inc`)
- aggregation pipeline stages (`$match`, `$group`, `$sort`)

## Step-by-step: using local datasets

Follow these exact steps from a fresh project run.

1. Start MongoDB locally.
2. Open terminal in project root.
3. Install dependencies (if not already done):

```bash
npm install
```

4. Set local DB variables (PowerShell):

```powershell
$env:MONGODB_URI="mongodb://127.0.0.1:27017"
$env:MONGODB_DB="mongo_playground"
```

5. Start app:

```bash
npm run dev
```

6. Open `http://localhost:3000`.
7. Click `Check Connection` and confirm `ok: true`.
8. Click `Show Local Datasets`.
   - You should see:
   - `demo_users` (150)
   - `demo_products` (150)
   - `demo_orders` (150)
9. In the dataset selector, choose one or more datasets.
10. Click `Load Local Datasets`.
   - This appends JSON files from `local-data/` into MongoDB.
11. If you want a clean state, click `Reset Local Datasets`.
   - This deletes current selected docs (including modified data), then reloads fresh seed data.
12. If you want to remove data, click `Delete Local Datasets`.
   - You will be asked:
   - `This will delete all local data sets including all modified data. Are you sure?`
13. Click `List Collections` to confirm selected collections exist.

### First practice query (Builder mode)

1. Keep mode as `Builder Fields`.
2. Set:
   - Collection: `demo_products`
   - Operation: `find`
   - Filter JSON: `{"price":{"$gt":50}}`
   - Sort JSON: `{"price":-1}`
   - Limit: `5`
3. Click `Run Query`.
4. Response panel should return top 5 products with price > 50.

### First practice query (Manual mode)

1. Change mode to `Manual JSON Query`.
2. Paste:

```json
{
  "collection": "demo_users",
  "operation": "find",
  "filter": { "active": true, "age": { "$gte": 30 } },
  "projection": { "name": 1, "email": 1, "age": 1, "_id": 0 },
  "sort": { "age": -1 },
  "limit": 10
}
```

3. Click `Run Query`.
4. Response panel shows matching active users age 30+.

### First practice query (Source-code mode)

1. Open `config.js`.
2. Set `SOURCE_CODE_QUERY` to:

```js
const SOURCE_CODE_QUERY = {
  collection: "demo_orders",
  operation: "aggregate",
  pipeline: [
    { $match: { status: "paid" } },
    { $group: { _id: "$userId", totalSpent: { $sum: "$total" } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 }
  ]
};
```

3. Save file.
4. In browser, click `Run Source Code Query`.
5. Response panel shows top users by paid order total.

### If something fails

1. `MongoDB connection is healthy` is false:
   - Ensure MongoDB server is running.
   - Recheck `MONGODB_URI` and `MONGODB_DB`.
2. `Load Local Datasets` fails:
   - Ensure `local-data/*.json` files exist and are valid JSON arrays.
3. Query returns empty list:
   - Run `Load Local Datasets` again with the correct dataset selection.
   - Confirm correct collection name from `Show Local Datasets`.

## Query success indicator

The page includes a status banner above the response panel:

- `Status: SUCCESS - ...` when operation succeeds
- `Status: FAILED - ...` when operation fails

This applies to:
- normal query runs
- health checks
- dataset load/reset/delete actions
- source-code query runs

## Builder mode

Use page fields:

- Collection
- Operation
- Filter / Projection / Sort
- Document / Documents
- Update
- Pipeline
- Options
- Limit

Useful when you want guided input without editing source files.

## Manual mode

Switch input mode to `Manual JSON Query`, then write one payload object.

Example:

```json
{
  "collection": "users",
  "operation": "find",
  "filter": { "active": true },
  "projection": { "name": 1, "_id": 0 },
  "sort": { "name": 1 },
  "limit": 5
}
```

Useful when you want fast copy/paste experimentation.

## Source-code mode (important)

This is the coding-style workflow requested for this project.

1. Open `config.js`
2. Edit `SOURCE_CODE_QUERY`
3. Save file
4. Go to page and click `Run Source Code Query`
5. See result in response panel

Default example in file:

```js
const SOURCE_CODE_QUERY = {
  collection: "users",
  operation: "find",
  filter: { active: true },
  projection: { name: 1, email: 1, _id: 0 },
  sort: { name: 1 },
  limit: 10
};
```

To test update:

```js
const SOURCE_CODE_QUERY = {
  collection: "users",
  operation: "updateMany",
  filter: { active: { $ne: true } },
  update: { $set: { active: true } },
  options: {}
};
```

To test aggregate:

```js
const SOURCE_CODE_QUERY = {
  collection: "orders",
  operation: "aggregate",
  pipeline: [
    { $match: { status: "paid" } },
    { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } }
  ]
};
```

## Supported operation payload keys

Use these keys depending on operation:

- `collection` (required)
- `operation` (required)
- `filter`
- `projection`
- `sort`
- `update`
- `document`
- `documents`
- `pipeline`
- `steps`
- `options`
- `limit`

Create note:
- You can use either `createOne`/`createMany` or `insertOne`/`insertMany`.
- They execute the same create logic in this playground.
- `operation` runs ordered `steps` on matched document(s) and writes the full modified doc back.

Operation step actions:
- `set` (`path`, `value`)
- `copy` (`from`, `to`)
- `rename` (`from`, `to`)
- `delete` / `unset` (`path`)
- `inc` (`path`, `value` or `by`)
- `push` (`path`, `value`)
- `pull` (`path`, `value`)

Field-reference template:
- Use `{"$field":"some.path"}` inside `value` to copy from current document values.

Example (same idea as Mongo shell `joe` transformation):

```json
{
  "collection": "users",
  "operation": "operation",
  "filter": { "name": "joe" },
  "steps": [
    {
      "action": "set",
      "path": "relationships",
      "value": {
        "friends": { "$field": "friends" },
        "enemies": { "$field": "enemies" }
      }
    },
    { "action": "copy", "from": "name", "to": "username" },
    { "action": "delete", "path": "friends" },
    { "action": "delete", "path": "enemies" },
    { "action": "delete", "path": "name" }
  ]
}
```


## Important notes

- MongoDB server must be running.
- This playground is intentionally schema-less and flexible for learning.
- There is minimal validation by design; invalid query shapes may throw Mongo/Mongoose errors directly.
