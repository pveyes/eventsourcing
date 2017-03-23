/* global post get setInputReadOnly tambah$ modify$ deleteData$ cancelAction$ changeEditMode$ */
const ts = new EventSource('/transaction/stream');

const itemData$ = Rx.Observable.fromPromise(get('/item'));
const customerData$ = Rx.Observable.fromPromise(get('/customer'));
const bankData$ = Rx.Observable.fromPromise(get('/bank'));
const allData$ = itemData$.merge(customerData$).merge(bankData$);
const transactionData$ = Rx.Observable.fromPromise(get('/transaction'));

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

const transactionRowTemplate = $('#transaction-row-template').text();
transactionData$.subscribe(transactions => {
  const rows = transactions.map(transaction => {
    return transactionRowTemplate
      .replace(/\$transaction_id/g, transaction.id)
      .replace('$nama_customer', transaction.namaCustomer)
      .replace('$alamat_customer', transaction.alamatCustomer)
      .replace('$nama_item', transaction.namaItem)
      .replace('$jumlah_item', transaction.jumlahItem)
      .replace('$harga_item', transaction.hargaItem)
      .replace('$harga_total', transaction.totalHarga)
      .replace('$status_transaksi', transaction.status);
  });

  $transactionTable.append(rows);
});






const $selectItem = $('#item-list');
const selectedItemChange$ = Rx.Observable
  .fromEvent($selectItem, 'change')
  .map(event => parseInt(event.target.value))
  .flatMap(id => {
    // return stream of item (yang id sama seperti yang user pilih)
    return itemData$
      .flatMap(items => {
        return Rx.Observable.from(items);
      })
      .filter(item => {
        return item.id === id;
      });
  });

$jumlahOptions = $('#jumlah-item');
selectedItemChange$.subscribe(item => {
  const stok = parseInt(item.stok);

  let options = '';
  for (let i = 0; i < stok; i++) {
    const option = optionTemplate
      .replace('$value', i + 1)
      .replace('$text', i + 1 + ' buah');
    options += option;
  }

  $jumlahOptions.html(options);
});

const $beli = $('#buy-item');

const beliItem$ = Rx.Observable
  .fromEvent($beli, 'click')
  .flatMap(event => {
    event.preventDefault();
    const customerId = parseInt($customerOptions.val());
    const itemId = parseInt($itemOptions.val());
    const jumlah = parseInt($jumlahOptions.val());
    const bankId = parseInt($bankOptions.val());

    const customer$ = customerData$
      .flatMap(customers => Rx.Observable.from(customers))
      .filter(customer => customer.id === customerId);

    const item$ = itemData$
      .flatMap(items => Rx.Observable.from(items))
      .filter(item => item.id === itemId);

    const bank$ = bankData$
      .flatMap(banks => Rx.Observable.from(banks))
      .filter(bank => bank.id === bankId);

    return customer$
      .merge(item$)
      .merge(bank$)
      .reduce((pembelian, val) => {
        if (val.alamat) {
          //   customer: {
          //     id:
          //     nama:
          //     alamat:
          //   },
          pembelian.customer = {
            id: val.id,
            nama: val.nama,
            alamat: val.alamat,
          };
          return pembelian;
        }

        if (val.harga) {
          //   item: {
          //     id:
          //     nama:
          //     harga:
          //   },
          pembelian.item = {
            id: val.id,
            nama: val.nama,
            harga: val.harga,
          };
          return pembelian;
        }

        if (val.kode) {
          //   bank: {
          //     id:
          //     nama:
          //     rekening:
          //     kode:
          //   }
          pembelian.bank = {
            id: val.id,
            nama: val.nama,
            rekening: val.rekening,
            kode: val.kode,
          };
          return pembelian;
        }

        return pembelian;
      }, {})
      .map(pembelian => {
        pembelian.jumlah = jumlah;
        return pembelian;
      });
  })
  .flatMap(pembelian => {
    return Rx.Observable.fromPromise(
      post('/transaction/add', pembelian)
    )
  })
  .filter(serverResponse => {
    return serverResponse.success === true;
  });

beliItem$.subscribe(val => {
  console.log(val);
});



const transactionFromSSE$ = Rx.Observable
  .fromEvent(ts, 'added')
  .map(event => {
    const transaction = JSON.parse(event.data);
    return transaction;
  })


transactionFromSSE$.subscribe(transaction => {
  const newTransaction = transactionRowTemplate
    .replace(/\$transaction_id/g, transaction.id)
    .replace('$nama_customer', transaction.namaCustomer)
    .replace('$alamat_customer', transaction.alamatCustomer)
    .replace('$nama_item', transaction.namaItem)
    .replace('$jumlah_item', transaction.jumlahItem)
    .replace('$harga_item', transaction.hargaItem)
    .replace('$harga_total', transaction.totalHarga)
    .replace('$status_transaksi', transaction.status);

  $transactionTable.append(newTransaction);
});
