class TickManager {
  tick: number;
  delta: number;
  start: [number, number];
  lastTick: [number, number];
  
  constructor() {
    this.tick = 0;
    this.delta = 0;
    this.start = process.hrtime();
    this.lastTick = process.hrtime();
  }

  incrementTick() {
    const duration = process.hrtime(this.start);
    const tickDelta = process.hrtime(this.lastTick);
    this.lastTick = process.hrtime();
    
    this.delta = tickDelta[0] + tickDelta[1] / 1000000000;
    this.tick = duration[0] + duration[1] / 1000000000;
  }  
}

export default TickManager;
