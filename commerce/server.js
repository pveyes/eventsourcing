const path = require('path');
const express = require('express');
const SSE = require('express-sse');
const bodyParser = require('body-parser');

const itemHandler = require('./handler/item');
const customerHandler = require('./handler/customer');
const bankHandler = require('./handler/bank');
const transactionHandler = require('./handler/transaction');

const indexHtmlPath = path.resolve('./index.html');
const transactionHtmlPath = path.resolve('./transaction.html');
const publicPath = path.resolve('./public');

const app = express();
const sse = new SSE();

app.use('/static', express.static(publicPath));

app.use(bodyParser.json());
app.get('/stream', sse.init);
app.use('/item', itemHandler);
app.use('/customer', customerHandler);
app.use('/bank', bankHandler);
app.use('/transaction', transactionHandler);

app.get('/', (req, res) => {
  res.sendFile(indexHtmlPath);
});

app.get('/transaction-page', (req, res) => {
  res.sendFile(transactionHtmlPath);
});

app.listen(3000, () => console.log('App started'));
