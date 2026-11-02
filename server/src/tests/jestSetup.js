import pool from "../config/db.js";

// Clean table rows before each test suite runs so tests don't conflict
beforeEach(async () => {
    // Query all table names in the 'public' schema
    const { rows } = await pool.query(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename NOT LIKE '%_migrations%'; -- Exclude migration tracking tables
    `);

    if (rows.length === 0) return;

    const tableNames = rows.map((r) => `"${r.tablename}"`).join(", ");

    // Truncate all application tables together in a single operation
    await pool.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
});

afterAll(async () => {
    await pool.end()
})