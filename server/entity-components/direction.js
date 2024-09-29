class Direction {
  constructor(engine, speed, direction) {
    this.engine = engine;

    this.speed = speed || 0;
    this.current = direction || 0;
    this.desire = direction || 0;
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

  turnTo(startX, startY, endX, endY) {
    this.desire = Math.atan2(endX - startX, -1 * (endY - startY));
  }

  setTo(startX, startY, endX, endY) {
    this.current = Math.atan2(endX - startX, -1 * (endY - startY));
  }

  translate(point, distance) {
    return [
      point[0] + Math.sin(this.current) * distance,
      point[1] - Math.cos(this.current) * distance,
    ];
  }
}

module.exports = { Direction };
