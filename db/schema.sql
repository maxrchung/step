CREATE TABLE IF NOT EXISTS steps (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  title TEXT NOT NULL,
  style TEXT NOT NULL,
  steps JSONB NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  updated TIMESTAMPTZ NOT NULL,
  spacing DOUBLE PRECISION
);

CREATE INDEX IF NOT EXISTS steps_owner_created_idx
  ON steps (owner, created DESC);
