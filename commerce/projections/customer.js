const fs = require('fs');
const path = require('path');
const EventStore = require('../store');

const file = path.resolve(__dirname, '../db/Customers.json');

function readCustomers() {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
  } catch (_) {
    return [];
  }
}

function writeCustomers(newCustomers) {
  fs.writeFileSync(file, JSON.stringify(newCustomers, false, 2));
}

EventStore.on('customerAdded', event => {
  const customers = readCustomers();
  const customer = event.customer;
  const newCustomers = customers.concat([customer]);
  writeCustomers(newCustomers);
});

EventStore.on('customerEdited', event => {
  const customers = readCustomers();
  const newCustomers = customers.map(customer => {
    if (customer.id === event.id) {
      return Object.assign(customer, event.customer);
    }

    return customer;
  });
  writeCustomers(newCustomers);
});

EventStore.on('customerDeleted', event => {
  const customers = readCustomers();
  const newCustomers = customers.filter(customer => customer.id !== event.id);
  writeCustomers(newCustomers);
});

exports.read = readCustomers;
