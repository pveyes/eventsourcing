const path = require('path');
const express = require('express');
const SSE = require('express-sse');

// init server
const sse = new SSE();
const server = express();

// route declaration
server.get('/events', sse.init);
server.use(express.static(path.resolve('./public')));

setInterval(() => {
  sse.send({ a: 'b' }, 'eventName');
}, 5000);

server.listen(3000, () => console.log('Server started http://localhost:3000'));
