class Event {
  constructor(tickManager) {
    this.tickManager = tickManager;
    this.update();
  }

  update() {
    this.tick = this.tickManager.tick;
  }

  timeSince() {
    return this.tickManager.tick - this.tick;
  }
}

module.exports = Event;