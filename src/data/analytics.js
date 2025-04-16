export default class Analytics {
    constructor() {
      this.events = [];
    }
    
    logEvent(eventName, data = {}) {
      const timestamp = new Date().toISOString();
      const eventLog = { eventName, data, timestamp };
      this.events.push(eventLog);
      console.log('Analytics Event:', eventLog);
    }
  }
  