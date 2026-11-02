import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "test") {
  pool.on("connect", () => {
    console.log("Connection pool established with the database");
  });
};

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
  process.exit(-1);
});

export default pool;