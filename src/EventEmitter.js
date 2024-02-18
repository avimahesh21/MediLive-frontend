class EventEmitter {
    constructor() {
      this.events = {};
    }
  
    subscribe(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
  
      return () => this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }
  
    publish(eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(callback => callback(data));
      }
    }
  }
  
  export const eventEmitter = new EventEmitter();
  