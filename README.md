![image](https://github.com/maxrchung/step/assets/3955187/c19bc7ce-1072-40bd-beee-e0f6009ddd35)

# Step

Check it out: https://step.max.rodeo

Note: Creating step charts requires a Google login.

This project is a small web tool to help create step patterns for dance games
(Dance Dance Revolution, Pump It Up, StepManiaX). I'm mostly using it to
personally make quick notes and practice certain parts of songs. Hope others may
find it useful. 🐸

## Tech

This project uses TypeScript, React, Remix, Chakra UI, Ionicons, PostgreSQL, and Railway.

## Local Dev

1. Copy `.env.example` to `.env` and fill in your `COOKIE_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` (with `http://localhost:3000/signin/callback` configured as an authorized redirect URI in Google Cloud Console).
2. Start PostgreSQL with Docker (`docker-compose.yml` automatically applies `db/schema.sql` when initializing a fresh data volume):

```sh
npm run db:up
```

3. Start the Remix dev server (and optionally rebuild SVG icons):

```sh
npm run icons
npm run dev:remix
```

To stop the local PostgreSQL container:

```sh
npm run db:down
```

## Deploy (Railway)

1. Provision a web service for this repo and a PostgreSQL database service in Railway.
2. Configure environment variables on the web service:
   - `DATABASE_URL` (linked from the Railway PostgreSQL service)
   - `COOKIE_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NODE_ENV=production`
3. Add `https://step.max.rodeo/signin/callback` as an authorized redirect URI in Google Cloud Console.
4. Initialize the schema in Railway PostgreSQL (either automatically via the one-time data import script below, or by running `db/schema.sql` in Railway's Postgres query tab).
5. Build and start commands:
   - Build: `npm run build`
   - Start: `npm start`

## One-time DynamoDB Data Migration

Before tearing down AWS/SST, export existing items from DynamoDB and import them into PostgreSQL (`import-postgres.mjs` also applies `db/schema.sql` before inserting):

```sh
node scripts/export-dynamo.mjs --table <dynamo-table-name> --region us-west-1 --out steps-backup.json
DATABASE_URL="<target-postgres-url>" node scripts/import-postgres.mjs --in steps-backup.json
```
