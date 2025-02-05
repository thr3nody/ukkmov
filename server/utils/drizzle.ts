import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
export { sql, eq, and, or } from "drizzle-orm";
import pkg from "pg"
const { Pool } = pkg

import * as schema from "../database/schema";

export const tables = schema;
const connectionString = process.env.DATABASE_URL!
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the environment variable.")
}

const pool = new Pool({
  connectionString
})

export function useDrizzle() {
  return drizzle(pool, {schema})
}
export type User = typeof schema.users.$inferSelect;