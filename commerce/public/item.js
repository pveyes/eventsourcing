/* global post get setInputReadOnly tambah$ modify$ deleteData$ cancelAction$ changeEditMode$ */
const $tabelItem = $('#tabel-item tbody');

const itemData$ = Rx.Observable.fromPromise(get('/item'));

const tambahItem$ = tambah$
  .filter(event => event.target.id === 'tambah-item');

const cancelAddItem$ = cancelAction$
  .filter($row => $row.attr('id') === '$item_id');

const cancelEditItem$ = cancelAction$
  .filter($row => $row.attr('id') !== '$item_id');

const modifyItem$ = modify$
  .filter($row => $row.parent().parent().attr('id') === 'tabel-item')
  .map($row => {
    const item = {
      nama: $row.find('input.nama-item').val(),
      deskripsi: $row.find('input.deskripsi-item').val(),
      harga: $row.find('input.harga-item').val(),
      stok: $row.find('input.stok-item').val(),
    };

    return {
      $row: $row,
      item: item,
    };
  });

const insertItem$ = modifyItem$
  .filter(event => event.$row.attr('id') === '$item_id')
  .flatMap(event => {
    return Rx.Observable.fromPromise(
      post('/item/add', event.item)
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        id: serverResponse.id,
        item: event.item,
        $row: event.$row,
      };
    });
  })
  .filter(serverResponse => serverResponse.success);

const updateItem$ = modifyItem$
  .filter(event => event.$row.attr('id') !== '$item_id')
  .flatMap(event => {
    const newItem = {
      id: parseInt(event.$row.attr('id'), 10),
      item: event.item,
    };

    return Rx.Observable.fromPromise(
      post('/item/edit', newItem)
    ).map(serverResponse => {
      return {
        success: serverResponse.success,
        $row: event.$row,
      };
    });
  })
  .filter(serverResponse => serverResponse.success);

const deleteItem$ = deleteData$
  .filter(event => {
    const $tabel = $(event.target).parent().parent().parent().parent();
    return $tabel.attr('id') === 'tabel-item';
  })
  .flatMap(event => {
    const $row = $(event.target).parent().parent();
    const id = parseInt($row.attr('id'));

    return Rx.Observable.fromPromise(
      post('/item/delete', { id: id })
    ).map(response => {
      return {
        response: response,
        $row: $row,
      };
    });
  });


itemData$.subscribe(val => {
  const template = $('#item-row-template').text();
  val.forEach(item => {
    const $row = $(template);
    $row.attr('id', item.id);
    $row.find('input.nama-item').val(item.nama);
    $row.find('input.deskripsi-item').val(item.deskripsi);
    $row.find('input.harga-item').val(item.harga);
    $row.find('input.stok-item').val(item.stok);
    setInputReadOnly($row);
    $tabelItem.append($row);
  });
});

tambahItem$.subscribe(event => {
  // insert new row, ambil template string
  const template = $('#item-row-template').text();
  // tambah ke tabel
  $tabelItem.append(template);
});

cancelAddItem$.subscribe($row => $row.remove());
cancelEditItem$.subscribe($row => setInputReadOnly($row));

insertItem$.subscribe(val => {
  const $row = val.$row;
  $row.attr('id', val.id);
  setInputReadOnly($row);
});

updateItem$.subscribe(val => {
  const $row = val.$row;
  setInputReadOnly($row);
});

deleteItem$.subscribe(event => {
  if (event.response.success) {
    return event.$row.remove();
  }

  alert(event.response.error);
});
