const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const DATA_PATH = path.resolve(__dirname, './data.json');

class EventStore extends EventEmitter {
  constructor() {
    // initialization
    super();

    this.events = [];
  }

  save(event) {
    // save in array (memory) for quick access
    this.events.push(event);

    // notify subscriber
    this.emit('transaction', event);
  }
}

// singleton
module.exports = new EventStore();
