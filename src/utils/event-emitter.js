class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener, name = null) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push({ name, listener });
  }

  off(event, listenerToRemove, nameToRemove = null) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(
      ({ listener, name }) => listener !== listenerToRemove && name !== nameToRemove
    );
  }

  emit(event, data, name = null) {
    if (!this.events[event]) return;

    this.events[event].forEach(({ name: listenerName, listener }) => {
      if (listenerName === name) {
        listener(data);
      }
    });
  }
}

export default new EventEmitter();
