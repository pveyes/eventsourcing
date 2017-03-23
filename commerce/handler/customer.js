const express = require('express');
const EventStore = require('../store');
const Customers = require('../projections/customer');

const router = express.Router();

router.get('/', (req, res) => {
  const customers = Customers.read();
  return res.json(customers);
});

router.post('/add', (req, res) => {
  const customer = Object.assign({}, req.body, {
    id: Math.floor(Math.random() * 10000),
  });

  const event = {
    type: 'customerAdded',
    timestamp: new Date().getTime(),
    customer: customer,
  };

  EventStore.append(event, err => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true, id: customer.id });
  });
});

router.post('/edit', (req, res) => {
  const id = req.body.id;
  const customer = req.body.customer;

  const event = {
    type: 'customerEdited',
    timestamp: new Date().getTime(),
    id: id,
    customer: customer,
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
    type: 'customerDeleted',
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
