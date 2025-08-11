/**
 * @file postgres.connection.ts
 * @description Establishes and manages a PostgreSQL connection using pg Pool.
 */

import { Pool } from "pg";

/**
 * PostgreSQL connection pool instance.
 * Uses environment variables for connection details.
 */
export const postgresPool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "dam_db",
  user: process.env.DB_USER || "dam_user",
  password: process.env.DB_PASSWORD || "dam_password",
  max: 10,
  idleTimeoutMillis: 30000 
});

/**
 * Initializes PostgreSQL connection.
 * Logs success or error messages.
 */
export const connectPostgres = async (): Promise<void> => {
  try {
    const client = await postgresPool.connect();
    console.log("PostgreSQL connected successfully.");
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1); 
  }
};
