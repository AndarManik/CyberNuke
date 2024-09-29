class Path {
  constructor(engine, position, movespeed, pathRegion) {
    this.engine = engine;

    this.position = position;
    this.movespeed = movespeed;
    this.pathRegion = pathRegion;
    this.pathX = [];
    this.pathY = [];
    this.isMoving = false;
  }

  setPath(desiredX, desiredY) {
    const path = this.pathRegion.getPath(
      [this.position.x, this.position.y],
      [desiredX, desiredY]
    );
    this.pathX = path.x;
    this.pathY = path.y;
  }

  update() {
    if (this.isMoving) {
      let availableDistance = this.movespeed * this.engine.getDelta();

      while (availableDistance > 0 && this.pathX.length > 0) {
        const deltaX = this.pathX[0] - this.position.x;
        const deltaY = this.pathY[0] - this.position.y;
        const mag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const moveDistanceX = (deltaX * availableDistance) / mag;
        const moveDistanceY = (deltaY * availableDistance) / mag;

        //if the desired position can be reached in one move
        if (mag <= availableDistance) {
          this.position.x = this.pathX.shift();
          this.position.y = this.pathY.shift();
          availableDistance -= mag;
        } else {
          this.position.x += moveDistanceX;
          this.position.y += moveDistanceY;
          availableDistance = 0;
        }
      }

      if (this.pathX.length == 0) this.isMoving = false;
    }
  }

  reset() {
    this.pathX = [];
    this.pathY = [];
    this.isMoving = false;
  }
}

module.exports = { Path };
