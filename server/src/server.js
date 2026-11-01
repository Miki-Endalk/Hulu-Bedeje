import "dotenv/config"
import app from "./app.js"
import pool from "./config/db.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        const pgResponse = await pool.query("SELECT NOW()");

        console.log("PostgreSQL connected successfully!", pgResponse.rows[0]);
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error("Database connection failed on startup:", error.message);
        process.exit(1);
    }
}

startServer()