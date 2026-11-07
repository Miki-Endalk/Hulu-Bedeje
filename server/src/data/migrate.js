import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
  const client = await pool.connect();

  try {
    console.log("Reading schema.sql...");

    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = await fs.readFile(schemaPath, "utf-8");

    console.log("Running migration...");
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");

    console.log("Database migration completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end(); // Close the pool so the script exits cleanly
  }
}

runMigration();