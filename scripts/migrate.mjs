import { readFile } from "node:fs/promises";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not configured; migration skipped.");
  process.exit(0);
}

const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  await client.query(schema);
  console.log("Database schema is ready.");
} finally {
  await client.end();
}
