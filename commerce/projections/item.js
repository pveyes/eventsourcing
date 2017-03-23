const fs = require('fs');
const path = require('path');
const EventStore = require('../store');

const file = path.resolve(__dirname, '../db/Items.json');

function readItems() {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
  } catch (_) {
    return [];
  }
}

function writeItems(newItems) {
  fs.writeFileSync(file, JSON.stringify(newItems, false, 2));
}

EventStore.on('itemAdded', event => {
  const items = readItems();
  const item = event.item;
  const newItems = items.concat([item]);
  writeItems(newItems);
});

EventStore.on('itemEdited', event => {
  const items = readItems();
  const newItems = items.map(item => {
    if (item.id === event.id) {
      return Object.assign(item, event.item);
    }

    return item;
  });
  writeItems(newItems);
});

EventStore.on('itemDeleted', event => {
  const items = readItems();
  const newItems = items.filter(item => item.id !== event.id);
  writeItems(newItems);
});

EventStore.on('transactionPaid', event => {
  const items = readItems();
  const newItems = items.map(item => {
    if (item.nama === event.transaction.namaItem) {
      item.stok -= event.transaction.jumlahItem;
      return item;
    }

    return item;
  });
  writeItems(newItems);
});

exports.read = readItems;
