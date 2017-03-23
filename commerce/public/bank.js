/* global post get setInputReadOnly tambah$ modify$ deleteData$ cancelAction$ changeEditMode$ */
const $tabelBank = $('#tabel-bank tbody');

const bankData$ = Rx.Observable.fromPromise(get('/bank'));

const tambahBank$ = tambah$
  .filter(event => event.target.id === 'tambah-bank');

const cancelAddBank$ = cancelAction$
  .filter($row => $row.attr('id') === '$bank_id');

const cancelEditBank$ = cancelAction$
  .filter($row => $row.attr('id') !== '$bank_id');

const modifyBank$ = modify$
  .filter($row => $row.parent().parent().attr('id') === 'tabel-bank')
  .map($row => {
    const bank = {
      nama: $row.find('input.nama-bank').val(),
      rekening: $row.find('input.rekening-bank').val(),
      kode: $row.find('input.kode-bank').val(),
      saldo: $row.find('input.saldo-bank').val(),
    };

    return {
      $row: $row,
      bank: bank,
    };
  });

const insertBank$ = modifyBank$
  .filter(event => event.$row.attr('id') === '$bank_id')
  .flatMap(event => {
    return Rx.Observable.fromPromise(
      post('/bank/add', event.bank)
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        id: serverResponse.id,
        bank: event.bank,
        $row: event.$row,
      };
    });
  })
  .filter(serverResponse => serverResponse.success);

const updateBank$ = modifyBank$
  .filter(event => event.$row.attr('id') !== '$bank_id')
  .flatMap(event => {
    const newBank = {
      id: parseInt(event.$row.attr('id'), 10),
      bank: event.bank,
    };

    return Rx.Observable.fromPromise(
      post('/bank/edit', newBank)
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        $row: event.$row,
      };
    });
  })
  .filter(serverResponse => serverResponse.success);

const deleteBank$ = deleteData$
  .filter(event => {
    const $tabel = $(event.target).parent().parent().parent().parent();
    return $tabel.attr('id') === 'tabel-bank';
  })
  .flatMap(event => {
    const $row = $(event.target).parent().parent();
    const id = parseInt($row.attr('id'));

    return Rx.Observable.fromPromise(
      post('/bank/delete', { id: id })
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        $row: $row,
      };
    });
  })
  .filter(val => val.success);


bankData$.subscribe(val => {
  const template = $('#bank-row-template').text();
  val.forEach(bank => {
    const $row = $(template);
    $row.attr('id', bank.id);
    $row.find('input.nama-bank').val(bank.nama);
    $row.find('input.rekening-bank').val(bank.rekening);
    $row.find('input.kode-bank').val(bank.kode);
    $row.find('input.saldo-bank').val(bank.saldo);
    setInputReadOnly($row);
    $tabelBank.append($row);
  });
});

tambahBank$.subscribe(event => {
  // insert new row, ambil template string
  const template = $('#bank-row-template').text();
  // tambah ke tabel
  $tabelBank.append(template);
});

cancelAddBank$.subscribe($row => $row.remove());
cancelEditBank$.subscribe($row => setInputReadOnly($row));

insertBank$.subscribe(val => {
  const $row = val.$row;
  $row.attr('id', val.id);
  setInputReadOnly($row);
});

updateBank$.subscribe(val => {
  const $row = val.$row;
  setInputReadOnly($row);
});

deleteBank$.subscribe(event => event.$row.remove());
