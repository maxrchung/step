import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";

function parseArgs(argv) {
  const args = {
    table: undefined,
    region: "us-west-1",
    out: "steps-backup.json",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--table") {
      args.table = argv[++i];
    } else if (arg === "--region") {
      args.region = argv[++i];
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function unmarshalValue(attr) {
  if ("S" in attr) return attr.S;
  if ("N" in attr) return Number(attr.N);
  if ("BOOL" in attr) return attr.BOOL;
  if ("NULL" in attr) return null;
  if ("L" in attr) return attr.L.map(unmarshalValue);
  if ("M" in attr) return unmarshalMap(attr.M);
  if ("SS" in attr) return attr.SS;
  if ("NS" in attr) return attr.NS.map(Number);
  throw new Error(`Unsupported DynamoDB attribute type: ${JSON.stringify(attr)}`);
}

function unmarshalMap(map) {
  const result = {};
  for (const [key, value] of Object.entries(map)) {
    result[key] = unmarshalValue(value);
  }
  return result;
}

const { table, region, out } = parseArgs(process.argv.slice(2));

if (!table) {
  console.error(
    "Usage: node scripts/export-dynamo.mjs --table <tableName> [--region us-west-1] [--out steps-backup.json]"
  );
  process.exit(1);
}

const stdout = execFileSync(
  "aws",
  ["dynamodb", "scan", "--table-name", table, "--region", region, "--output", "json"],
  { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
);

const parsed = JSON.parse(stdout);
const items = (parsed.Items ?? []).map(unmarshalMap);

await writeFile(out, `${JSON.stringify(items, null, 2)}\n`, "utf8");
console.log(`Exported ${items.length} item(s) from ${table} (${region}) to ${out}.`);
