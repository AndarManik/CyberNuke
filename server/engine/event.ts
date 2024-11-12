import TickManager from "./tick";

class Event {
  tickManager: TickManager;
  tick: number;
  
  constructor(tickManager: TickManager) {
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

export default Event;