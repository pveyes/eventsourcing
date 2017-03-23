const express = require('express');
const EventStore = require('../store');
const Banks = require('../projections/bank');

const router = express.Router();

router.get('/', (req, res) => {
  const banks = Banks.read();
  return res.json(banks);
});

router.post('/add', (req, res) => {
  const bank = Object.assign({}, req.body, {
    id: Math.floor(Math.random() * 10000),
  });

  const event = {
    type: 'bankAdded',
    timestamp: new Date().getTime(),
    bank: bank,
  };

  EventStore.append(event, err => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true, id: bank.id });
  });
});

router.post('/edit', (req, res) => {
  const id = req.body.id;
  const bank = req.body.bank;

  const event = {
    type: 'bankEdited',
    timestamp: new Date().getTime(),
    id: id,
    bank: bank,
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
    type: 'bankDeleted',
    timestamp: new Date().getTime(),
    id: id,
  };

  EventStore.append(event, err => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true });
  });
});

module.exports = router;
