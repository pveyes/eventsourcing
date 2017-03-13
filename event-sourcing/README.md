# Event Sourcing Example: Banking System

Account Table

| accountId | name         | balance | created_at | updated_at |
|-----------|--------------|---------|------------|------------|
| 123456    | Fatih Kalifa | 100000  | 123345145  | 124532412  |

## Events

- `registerCustomer`

```json
{
  "type": "register",
  "data": {
    "name": "Fatih Kalifa",
    "accountId": 123456,
    "balance": 100000,
  },
  "timestamp": 1489445943415
}
```

- `customerWithdraw`

```json
{
  "type": "withdraw",
  "data": {
    "accountId": 123456,
    "amount": 100000,
  },
  "timestamp": 1489445943415
}
```

- `customerDeposit`

```json
{
  "type": "withdraw",
  "data": {
    "accountId": 123456,
    "amount": 100000,
  },
  "timestamp": 1489445943415
}
```

## EventStore

Used to store list of events. In this example, we use in-memory store to simplify code.

`EventStore` needs to extends `EventEmitter` to be able to emit event so we can build a projection based on the events

`EventEmitter` has `.emit` method to broadcast an event, and `.on` method to listen to event

```js
const EventEmitter = require('events');

class EventStore extends EventEmitter {
  constructor() {
    super();
    this.events = [];
  }
}
```

## Projection

Build projection by listening to event and react accordingly

```js
const store = require('./store');

store.on('event', event => {
  switch (event.type) {
    case 'register':
      // insert to db
    case 'withdraw':
      // update db
    case 'deposit':
      // update db
  }
});
```

## Query

Construct data by collecting specific event

```js
const moneyInTheBankBeforeToday = events.reduce(accumulator, callback, initialValue);
```
