const store = require('./store');

function registerCustomer(name, initialBalance) {
  // validasi sebelum event creation
  if (!name) {
    throw new Error('Nama tidak boleh kosong');
  }

  const event = {
    type: 'register',
    data: {
      name: name,
      accountId: Math.floor(Math.random() * 1000000),
      balance: initialBalance,
    },
    timestamp: new Date(),
  };

  store.save(event);
  return event.data.accountId;
}

// function updateCustomerInfo(accountId, customerInformation) {
//   const event = {
//     type: 'updateCustomer',
//     data: {
//       address: customerInformation.address,
//     }
//   }
// }

function customerWithdraw(accountId, amount) {
  const event = {
    type: 'withdraw',
    data: {
      accountId: accountId,
      amount: amount,
    },
    timestamp: new Date(),
  };

  store.save(event);
}

function customerDeposit(accountId, amount) {
  const event = {
    type: 'deposit',
    data: {
      accountId: accountId,
      amount: amount,
    },
    timestamp: new Date(),
  };

  store.save(event);
}

module.exports = {
  registerCustomer,
  customerDeposit,
  customerWithdraw,
};
