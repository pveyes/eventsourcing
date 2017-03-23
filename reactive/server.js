const path = require('path');
const express = require('express');
const SSE = require('express-sse');

const staticPath = path.resolve(__dirname, './public');
const htmlPath = path.resolve(__dirname, './index.html');

const app = express();
const sse = new SSE();

app.get('/', (req, res) => res.sendFile(htmlPath));
app.use('/static', express.static(staticPath));
app.get('/stream', sse.init);

app.get('/events', (req, res) => {
  const balance = req.query.balance;
  sse.send(balance, 'balance');
});

app.get('/api/:id', (req, res) => {
  // /api/something
  const id = req.params.id;
  // { value: something }
  res.json({ value: id });
});

app.listen(3000, () => console.log('App running 3000'));
