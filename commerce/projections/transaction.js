const fs = require('fs');
const path = require('path');
const EventStore = require('../store');

const file = path.resolve(__dirname, '../db/Transaction.json');

function readTransactions() {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
  } catch (_) {
    return [];
  }
}

function writeTransactions(newTransactions) {
  fs.writeFileSync(file, JSON.stringify(newTransactions, false, 2));
}

EventStore.on('transactionAdded', event => {
  const transactions = readTransactions();
  const transaction = event.transaction;
  const newTransactions = transactions.concat([transaction]);
  writeTransactions(newTransactions);
});

EventStore.on('transactionPaid', event => {
  const transactions = readTransactions();
  const newTransactions = transactions.map(transaction => {
    if (transaction.id === event.transaction.id) {
      transaction.status = 'paid';
      return transaction;
    }

    return transaction;
  });
  writeTransactions(newTransactions);
});

exports.read = readTransactions;
