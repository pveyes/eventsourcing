const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const file = path.resolve(__dirname, './db/EventStore.json');

class EventStore extends EventEmitter {
  constructor() {
    super();

    try {
      // inisialisasi event awal
      const eventString = fs.readFileSync(file, { encoding: 'utf-8' });
      this.events = JSON.parse(eventString);
    } catch (_) {
      this.events = [];
    }
  }

  append(event, callback) {
    const newEvents = this.events.concat([event]);
    fs.writeFile(file, JSON.stringify(newEvents, false, 2), err => {
      if (err) {
        return callback(err);
      }

      this.events = newEvents;
      this.emit(event.type, event);
      return callback();
    });
  }
}

// export singleton
module.exports = new EventStore();
