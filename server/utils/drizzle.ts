import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
export { sql, eq, and, or } from "drizzle-orm";
import { Pool } from "pg";

import * as schema from "../database/schema";

export const tables = schema;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
})

export function useDrizzle() {
  return drizzle(pool, {schema})
}

export type User = typeof schema.users.$inferSelect;
