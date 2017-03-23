function get(url) {
  return fetch(url).then(res => res.json());
}

function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

function setInputReadOnly($row) {
  $row.find('input').attr('readonly', 'readonly');
  $row.find('.edit').show();
  $row.find('.delete').show();
  $row.find('.save').hide();
  $row.find('.cancel').hide();
}

const tambah$ = Rx.Observable
  .fromEvent(document, 'click')
  .filter(event => event.target.className === 'tambah');

const cancelAction$ = Rx.Observable
  .fromEvent(document, 'click')
  .filter(event => event.target.className === 'cancel')
  .map(event => $(event.target).parent().parent());

const changeEditMode$ = Rx.Observable
  .fromEvent(document, 'click')
  .filter(event => event.target.className === 'edit');

const modify$ = Rx.Observable
  .fromEvent(document, 'click')
  .filter(event => event.target.className === 'save')
  .map(event => $(event.target).parent().parent());

const deleteData$ = Rx.Observable
  .fromEvent(document, 'click')
  .filter(event => event.target.className === 'delete');


changeEditMode$.subscribe(event => {
  const $row = $(event.target).parent().parent();
  $row.find('input').removeAttr('readonly');
  $row.find('.edit').hide();
  $row.find('.delete').hide();
  $row.find('.save').show();
  $row.find('.cancel').show();
});
