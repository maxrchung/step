import pg from "pg";
import { Style, createEmptyStyle } from "./style";

const { Pool } = pg;

// Cache the pool on globalThis so `remix dev` hot reloads reuse it instead of
// leaking idle connections on every server module reload.
declare global {
  var __pgPool: pg.Pool | undefined;
}

function getPool(): pg.Pool {
  if (!globalThis.__pgPool) {
    globalThis.__pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return globalThis.__pgPool;
}

export interface Step {
  id: string;
  title: string;
  style: Style;
  steps: number[][];
  owner: string;
  created: string;
  updated: string;

  // Height of each step
  spacing?: number;
}

export interface OwnerStep {
  id: string;
  title: string;
  owner: string;
  created: string;
}

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

export const createStep = (
  id: string,
  owner: string,
  title: string,
  date: string
) => {
  const style = Style.DDR_SINGLE;
  const steps = createEmptyStyle(style);

  return getPool().query(
    "INSERT INTO steps (id, owner, title, style, steps, created, updated) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [id, owner, title, style, JSON.stringify(steps), date, date]
  );
};

interface DbStep {
  id: string;
  title: string;
  style: Style;
  steps: number[][];
  owner: string;
  created: Date | string;
  updated: Date | string;
  spacing: number | null;
}

export const getStep = async (id: string): Promise<Step | undefined> => {
  const result = await getPool().query<DbStep>(
    "SELECT id, title, style, steps, owner, created, updated, spacing FROM steps WHERE id = $1",
    [id]
  );

  const row = result.rows[0];
  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    title: row.title,
    style: row.style,
    steps: row.steps,
    owner: row.owner,
    created: toIsoString(row.created),
    updated: toIsoString(row.updated),
    spacing: row.spacing ?? undefined,
  };
};

interface DbOwnerStep {
  id: string;
  title: string;
  owner: string;
  created: Date | string;
}

export const getSteps = async (owner: string): Promise<OwnerStep[]> => {
  const result = await getPool().query<DbOwnerStep>(
    "SELECT id, title, owner, created FROM steps WHERE owner = $1 ORDER BY created DESC",
    [owner]
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    owner: row.owner,
    created: toIsoString(row.created),
  }));
};

export const getStepsCount = async (owner: string): Promise<number> => {
  const result = await getPool().query<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM steps WHERE owner = $1",
    [owner]
  );

  return result.rows[0]?.count ?? 0;
};

export const deleteStep = (id: string) =>
  getPool().query("DELETE FROM steps WHERE id = $1", [id]);

export const updateName = (id: string, title: string) => {
  const updated = new Date().toISOString();
  return getPool().query(
    "UPDATE steps SET title = $1, updated = $2 WHERE id = $3",
    [title, updated, id]
  );
};

export const updateSteps = (id: string, steps: number[][]) => {
  const updated = new Date().toISOString();
  return getPool().query(
    "UPDATE steps SET steps = $1, updated = $2 WHERE id = $3",
    [JSON.stringify(steps), updated, id]
  );
};

export const updateStyle = (id: string, style: Style) => {
  const updated = new Date().toISOString();
  return getPool().query(
    "UPDATE steps SET style = $1, steps = $2, updated = $3 WHERE id = $4",
    [style, JSON.stringify(createEmptyStyle(style)), updated, id]
  );
};

export const updateSpacing = (id: string, spacing: number) => {
  const updated = new Date().toISOString();
  return getPool().query(
    "UPDATE steps SET spacing = $1, updated = $2 WHERE id = $3",
    [spacing, updated, id]
  );
};
