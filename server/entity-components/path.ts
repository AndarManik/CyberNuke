import Engine from "../engine/engine";
import { PathFinder } from "../map/pathfinder";
import Position from "./position";

class Path {
  engine: Engine;
  position: Position;
  movespeed: number;
  pathRegion: PathFinder;
  pathX: number[];
  pathY: number[];
  isMoving: boolean;
  perpetual: boolean = false;

  constructor(
    engine: Engine,
    position: Position,
    movespeed: number,
    pathRegion: PathFinder
  ) {
    this.engine = engine;

    this.position = position;
    this.movespeed = movespeed;
    this.pathRegion = pathRegion;
    this.pathX = [];
    this.pathY = [];
    this.isMoving = false;
  }

  setPath(desiredX: number, desiredY: number) {
    const path = this.pathRegion.getPath(
      [this.position.x, this.position.y],
      [desiredX, desiredY]
    );
    this.pathX = path.x;
    this.pathY = path.y;
  }

  update() {
    if (this.isMoving || this.perpetual) {
      let availableDistance = this.movespeed * this.engine.getDelta();

      while (availableDistance > 0 && this.pathX.length > 0) {
        const deltaX = this.pathX[0] - this.position.x;
        const deltaY = this.pathY[0] - this.position.y;
        const mag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const moveDistanceX = (deltaX * availableDistance) / mag;
        const moveDistanceY = (deltaY * availableDistance) / mag;

        //if the desired position can be reached in one move
        if (mag <= availableDistance) {
          this.position.x = this.pathX.shift() || 0; // the zero case shouldn't happen
          this.position.y = this.pathY.shift() || 0;
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

export default Path;
