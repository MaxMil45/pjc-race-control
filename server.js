const Fastify = require("fastify");
const sqlite3 = require("sqlite3").verbose();

const fastify = Fastify({ logger: true });
const PORT = 8080;

// Set up SQLite Database
const db = new sqlite3.Database("./race_results.db", (err) => {
    if (err) console.error("Database connection failed:", err.message);
    else console.log("Connected to SQLite database.");
});

// Sample route
fastify.get("/", async (request, reply) => {
    return { message: "Race Control API is running!" };
});

// Start server
const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: "0.0.0.0" });
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
