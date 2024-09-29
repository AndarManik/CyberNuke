class Position {
  constructor(startX, startY) {
    this.startX = startX;
    this.startY = startY;
    this.x = startX;
    this.y = startY;
  }
  
  reset() {
    this.x = this.startX;
    this.y = this.startY;
  }

  isAtStart() {
    return this.x == this.startX && this.y == this.startY;
  }

  clone() {
    return new Position(this.x, this.y);
  }
}

module.exports = { Position };
