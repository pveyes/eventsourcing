'use strict';
const assert = require('assert');
const bank = require('./bank');
const store = require('./store');

// Projection
let AccountTable = [];
// define subscriber before event creation
store.on('transaction', event => {
  switch (event.type) {
    case 'register':
      // validasi sebelum di project
      // SELECT COUNT(*) where name != 'name'
      if (AccountTable.find(row => row.name === event.data.name)) {
        return;
      }

      // handle event register
      // insert into `account` values (account_id, name, balance, created_at)
      AccountTable.push({
        accountId: event.data.accountId,
        name: event.data.name,
        balance: event.data.balance,
        created_at: event.timestamp,
        updated_at: event.timestamp,
      });
      break;
    case 'withdraw':
      // handle event withdraw
      // reassign variable AccountTable
      AccountTable = AccountTable.map(row => {
        // update `account` where account_id='accountid' ...
        if (row.accountId === event.data.accountId) {
          // validate withdrawal
          if (row.balance < event.data.amount) {
            return row;
          }

          row.balance = row.balance - event.data.amount;
          return row;
        }
        return row;
      });
      break;
    case 'deposit':
      AccountTable = AccountTable.map(row => {
        // update `account` where account_id='accountid' ...
        if (row.accountId === event.data.accountId) {
          row.balance = row.balance + event.data.amount;
          return row;
        }
        return row;
      });
      break;
  }
});


try {
  const accountId = bank.registerCustomer('Fafa', 100000);
  bank.customerDeposit(accountId, 10000);
  bank.customerWithdraw(accountId, 10000);

  const accountId2 = bank.registerCustomer('Fifi', 100000);
  bank.customerDeposit(accountId2, 50000);
  bank.customerDeposit(accountId2, 25000);

  const accountId3 = bank.registerCustomer('Fufu', 20000);
  bank.customerWithdraw(accountId3, 20000);

  const accountId4 = bank.registerCustomer('Fefe', 100000);
  bank.customerWithdraw(accountId4, 45000);
  bank.customerWithdraw(accountId4, 5000);

  const accountId5 = bank.registerCustomer('Fofo', 100000);
  bank.customerWithdraw(accountId5, 1000);
  bank.customerWithdraw(accountId5, 9000);
  bank.customerDeposit(accountId5, 10000);
} catch (err) {
  // console.error(err.message);
}

const sum = [1, 2, 3, 4, 5].reduce((acc, current) => acc + current);
console.log(sum);

// sample event sourcing query
const moneyInTheBank = store.events.reduce((sumTemp, currentEvent) => {
  switch (currentEvent.type) {
    case 'register':
      return sumTemp + currentEvent.data.balance;
    case 'deposit':
      return sumTemp + currentEvent.data.amount;
    case 'withdraw':
      return sumTemp - currentEvent.data.amount;
    default:
      // do nothing
      return sumTemp;
  }
  // initial value for sumTemp
}, 0);

console.log(AccountTable);
console.log('money', moneyInTheBank);
