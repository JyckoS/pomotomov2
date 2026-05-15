import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
const sql = new Pool({ connectionString: process.env.DATABASE_URL });
const globalForDb = global as unknown as { 
  db: ReturnType<typeof drizzle<typeof schema>> 
};

export const db = globalForDb.db || drizzle(sql, { schema });
if (process.env.NODE_ENV !== 'production') globalForDb.db = db;