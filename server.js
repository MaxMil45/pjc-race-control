const fastify = require('fastify')();
const path = require('path');
const fastifyStatic = require('@fastify/static');  // Use the updated @fastify/static plugin

// Serve static files from the "public" folder
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', // Serve files at the root of the URL
});

// Example route to test if server is running
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html'); // This will serve the index.html file
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({
      port: 8080,
      host: '0.0.0.0',
    });
    console.log("Server running at http://localhost:8080");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
