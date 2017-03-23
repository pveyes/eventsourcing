const express = require('express');
const EventStore = require('../store');
const Transaction = require('../projections/transaction');
const SSE = require('express-sse');

const sse = new SSE();
const router = express.Router();

router.get('/', (req, res) => {
  const transactions = Transaction.read();
  return res.json(transactions);
});

// /transaction/add
router.post('/add', (req, res) => {
  const data = Object.assign({}, req.body, {
    id: Math.floor(Math.random() * 10000),
  });

  const event = {
    type: 'transactionAdded',
    timestamp: new Date().getTime(),
    transaction: {
      id: data.id,
      namaCustomer: data.customer.nama,
      alamatCustomer: data.customer.alamat,
      namaItem: data.item.nama,
      hargaItem: data.item.harga,
      jumlahItem: data.jumlah,
      totalHarga: parseInt(data.item.harga) * parseInt(data.jumlah),
      status: 'ordered',
    },
  };

  EventStore.append(event, err => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    sse.send(event.transaction, 'added');
    return res.status(200).json({ success: true, id: data.id });
  });
});

// /transaction/stream
router.get('/stream', sse.init);

module.exports = router;
