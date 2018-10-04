require('dotenv').config();

const createServer = require('./createServer');
const server = createServer();

server.start(({ port }) => {
  console.log(`Server is running on http://localhost:${port}`);
});
