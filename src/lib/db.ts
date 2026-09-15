import { Pool } from "pg";

let pool: Pool | undefined;

export function database() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Database is not configured.");
  pool ??= new Pool({ connectionString, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined, max: 5 });
  return pool;
}
