import Engine from "../engine/engine";

class Direction {
  engine: Engine;
  speed: number;
  current: number;
  desire: number;
  start: number;
  
  constructor(engine: Engine, speed: number = 0, direction: number = 0) {
    this.engine = engine;

    this.speed = speed;
    this.current = direction;
    this.desire = direction;
    this.start = this.current;
  }

  update() {
    let difference = this.desire - this.current;

    while(difference < -Math.PI)
        difference += 2 * Math.PI;
    while(difference > Math.PI)
        difference -= 2 * Math.PI;
    
    const rotation = this.speed * this.engine.getDelta();

    if(rotation > Math.abs(difference)) {
      this.current = this.desire;
      return;
    }

    this.current += (difference > 0) ? rotation : -rotation; 
  }

  turnToStart() {
    this.desire = this.start;
  }

  turnTo(startX: number, startY: number, endX: number, endY: number) {
    this.desire = Math.atan2(endX - startX, -1 * (endY - startY));
  }

  setTo(startX: number, startY: number, endX: number, endY: number) {
    this.current = Math.atan2(endX - startX, -1 * (endY - startY));
  }

  translate(point: [number, number], distance: number): [number, number] {
    return [
      point[0] + Math.sin(this.current) * distance,
      point[1] - Math.cos(this.current) * distance,
    ];
  }
}

export default Direction;
