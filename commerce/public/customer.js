/* global post get setInputReadOnly tambah$ modify$ deleteData$ cancelAction$ changeEditMode$ */
const $tabelCustomer = $('#tabel-customer tbody');

const customerData$ = Rx.Observable.fromPromise(get('/customer'));

const tambahCustomer$ = tambah$
  .filter(event => event.target.id === 'tambah-customer');

const cancelAddCustomer$ = cancelAction$
  .filter($row => $row.attr('id') === '$customer_id');

const cancelEditCustomer$ = cancelAction$
  .filter($row => $row.attr('id') !== '$customer_id');

const modifyCustomer$ = modify$
  .filter($row => $row.parent().parent().attr('id') === 'tabel-customer')
  .map($row => {
    const customer = {
      nama: $row.find('input.nama-customer').val(),
      alamat: $row.find('input.alamat-customer').val(),
      uang: $row.find('input.uang-customer').val(),
    };

    return {
      $row: $row,
      customer: customer,
    };
  });

const insertCustomer$ = modifyCustomer$
  .filter(event => event.$row.attr('id') === '$customer_id')
  .flatMap(event => {
    return Rx.Observable.fromPromise(
      post('/customer/add', event.customer)
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        id: serverResponse.id,
        customer: event.customer,
        $row: event.$row,
      };
    });
  })
  .filter(serverResponse => serverResponse.success);

const updateCustomer$ = modifyCustomer$
  .filter(event => event.$row.attr('id') !== '$customer_id')
  .flatMap(event => {
    const newCustomer = {
      id: parseInt(event.$row.attr('id'), 10),
      customer: event.customer,
    };

    return Rx.Observable.fromPromise(
      post('/customer/edit', newCustomer)
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        $row: event.$row,
      };
    });
  })
  .filter(serverResponse => serverResponse.success);

const deleteCustomer$ = deleteData$
  .flatMap(event => {
    const $row = $(event.target).parent().parent();
    const id = parseInt($row.attr('id'));

    return Rx.Observable.fromPromise(
      post('/customer/delete', { id: id })
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        $row: $row,
      };
    });
  })
  .filter(val => val.success);


customerData$.subscribe(val => {
  const template = $('#customer-row-template').text();
  val.forEach(customer => {
    const $row = $(template);
    $row.attr('id', customer.id);
    $row.find('input.nama-customer').val(customer.nama);
    $row.find('input.alamat-customer').val(customer.alamat);
    $row.find('input.uang-customer').val(customer.uang);
    setInputReadOnly($row);
    $tabelCustomer.append($row);
  });
});

tambahCustomer$.subscribe(event => {
  // insert new row, ambil template string
  const template = $('#customer-row-template').text();
  // tambah ke tabel
  $tabelCustomer.append(template);
});

cancelAddCustomer$.subscribe($row => $row.remove());
cancelEditCustomer$.subscribe($row => setInputReadOnly($row));

insertCustomer$.subscribe(val => {
  const $row = val.$row;
  $row.attr('id', val.id);
  setInputReadOnly($row);
});

updateCustomer$.subscribe(val => {
  const $row = val.$row;
  setInputReadOnly($row);
});

deleteCustomer$.subscribe(event => event.$row.remove());
