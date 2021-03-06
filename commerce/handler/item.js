const express = require('express');
const EventStore = require('../store');
const Items = require('../projections/item');
const Transaction = require('../projections/transaction');

const router = express.Router();

// /item
router.get('/', (req, res) => {
  const items = Items.read();
  return res.json(items);
});

// /addItem -> /item/add
router.post('/add', (req, res) => {
  const item = Object.assign({}, req.body, {
    id: Math.floor(Math.random() * 10000),
  });

  const event = {
    type: 'itemAdded',
    timestamp: new Date().getTime(),
    item: item,
  };

  EventStore.append(event, err => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true, id: item.id });
  });
});

router.post('/edit', (req, res) => {
  const id = req.body.id;
  const item = req.body.item;

  const event = {
    type: 'itemEdited',
    timestamp: new Date().getTime(),
    id: id,
    item: item,
  };

  EventStore.append(event, err => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true });
  });
});

router.post('/delete', (req, res) => {
  const id = req.body.id;

  const event = {
    type: 'itemDeleted',
    timestamp: new Date().getTime(),
    id: id,
  };

  const transactions = Transaction.read();
  const adaItemDiTransaction = transactions.find(transaction => transaction.idItem === id);
  if (adaItemDiTransaction) {
    return res.status(500).json({ error: 'Sudah ada di transaksi' });
  }

  EventStore.append(event, err => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true });
  });
});

module.exports = router;
