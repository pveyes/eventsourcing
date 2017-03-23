const fs = require('fs');
const path = require('path');
const EventStore = require('../store');

const file = path.resolve(__dirname, '../db/Banks.json');

function readBanks() {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
  } catch (_) {
    return [];
  }
}

function writeBanks(newBanks) {
  fs.writeFileSync(file, JSON.stringify(newBanks, false, 2));
}

EventStore.on('bankAdded', event => {
  const banks = readBanks();
  const bank = event.bank;
  const newBanks = banks.concat([bank]);
  writeBanks(newBanks);
});

EventStore.on('bankEdited', event => {
  const banks = readBanks();
  const newBanks = banks.map(bank => {
    if (bank.id === event.id) {
      return Object.assign(bank, event.bank);
    }

    return bank;
  });
  writeBanks(newBanks);
});

EventStore.on('bankDeleted', event => {
  const banks = readBanks();
  const newBanks = banks.filter(bank => bank.id !== event.id);
  writeBanks(newBanks);
});

exports.read = readBanks;
