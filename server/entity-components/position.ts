class Position {
  startX: number;
  startY: number;
  x: number;
  y: number;
  constructor(startX: number, startY: number) {
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

export default Position;
