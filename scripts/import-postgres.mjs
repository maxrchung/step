import { readFile } from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;

function parseArgs(argv) {
  const args = {
    input: "steps-backup.json",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--in") {
      args.input = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is required.");
  process.exit(1);
}

const { input } = parseArgs(process.argv.slice(2));
const schemaUrl = new URL("../db/schema.sql", import.meta.url);
const schemaSql = await readFile(schemaUrl, "utf8");
const raw = await readFile(input, "utf8");
const items = JSON.parse(raw);

if (!Array.isArray(items)) {
  console.error(`Error: Expected JSON array in ${input}.`);
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const client = await pool.connect();
let inserted = 0;

try {
  await client.query("BEGIN");
  await client.query(schemaSql);

  for (const item of items) {
    const result = await client.query(
      `INSERT INTO steps (id, owner, title, style, steps, created, updated, spacing)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [
        item.id,
        item.owner,
        item.title,
        item.style,
        JSON.stringify(item.steps),
        item.created,
        item.updated ?? item.created,
        item.spacing ?? null,
      ]
    );
    inserted += result.rowCount ?? 0;
  }

  await client.query("COMMIT");
  const skipped = items.length - inserted;
  console.log(
    `Read ${items.length} item(s) from ${input}: inserted ${inserted}, skipped ${skipped}.`
  );
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
