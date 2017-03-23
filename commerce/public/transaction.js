/* global post get setInputReadOnly tambah$ modify$ deleteData$ cancelAction$ changeEditMode$ */
const itemData$ = Rx.Observable.fromPromise(get('/item'));
const customerData$ = Rx.Observable.fromPromise(get('/customer'));
const bankData$ = Rx.Observable.fromPromise(get('/bank'));
const allData$ = itemData$.merge(customerData$).merge(bankData$);

const $itemOptions = $('#item-list');
const $customerOptions = $('#customer-list');
const $bankOptions = $('#bank-list');
const $transactionTable = $('#transaction tbody');

const optionTemplate = $('#option-template').text();

itemData$.subscribe(items => {
  const options = items.map(item => {
    return optionTemplate
      .replace('$value', item.id)
      .replace('$text', item.nama);
  });

  $itemOptions.append(options);
});

customerData$.subscribe(customers => {
  const options = customers.map(customer => {
    return optionTemplate
      .replace('$value', customer.id)
      .replace('$text', customer.nama);
  });

  $customerOptions.append(options);
});

bankData$.subscribe(banks => {
  const options = banks.map(bank => {
    return optionTemplate
      .replace('$value', bank.id)
      .replace('$text', bank.nama);
  });

  $bankOptions.append(options);
});
