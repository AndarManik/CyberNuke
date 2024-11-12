const pointUtils = require("../point-utils.js");
import buildMap from "./map-builder.js";
import Engine from "../engine/engine";

// HECTIC: resolve all the any's in this
class World {
  pits: any[];
  constructor(engine: Engine) {
    this.pits = [];
    buildMap(engine, this);
  }

  getPath(startPoint: [number, number], endPoint: [number, number]) {
    const intersectionPoints: any[] = [];
    let startPit: any = null;
    let endPit: any = null;

    for (let index = 0; index < this.pits.length; index++) {
      const currentPit = this.pits[index];
      if (currentPit.isSegmentInPit(startPoint, endPoint)) {
        let endpointInside = false;

        if (!startPit && currentPit.isPointInPit(startPoint)) {
          startPit = [
            currentPit.getIntersectionSegment(startPoint, endPoint),
            currentPit,
          ];
          endpointInside = true;
        }

        if (!endPit && currentPit.isPointInPit(endPoint)) {
          endPit = [
            currentPit.getIntersectionSegment(startPoint, endPoint),
            currentPit,
          ];
          endpointInside = true;
        }

        if (!endpointInside) {
          intersectionPoints.push([
            currentPit.getIntersectionSegment(startPoint, endPoint),
            currentPit,
          ]);
        }
      }
    }

    // doesn't go into any pits
    if (intersectionPoints.length == 0 && !startPit && !endPit) {
      return { x: [endPoint[0]], y: [endPoint[1]], pit: [1] };
    }
    // it starts and ends in the same pit
    if (startPit && endPit && startPit[1] === endPit[1]) {
      return startPit[1].getPath(startPoint, endPoint);
    }

    intersectionPoints.sort((a, b) => a[0][2] - b[0][2]);

    const pathX: number[] = [];
    const pathY: number[] = [];

    if (startPit) {
      const path = startPit[1].getPath(startPoint, startPit[0][1]);
      pathX.push(...path.x);
      pathY.push(...path.y);
    }

    for (let index = 0; index < intersectionPoints.length; index++) {
      const path = intersectionPoints[index][1].getPath(
        intersectionPoints[index][0][0],
        intersectionPoints[index][0][1]
      );
      // this gets add because the path returns without the start point by default.
      pathX.push(intersectionPoints[index][0][0][0]);
      pathY.push(intersectionPoints[index][0][0][1]);
      pathX.push(...path.x);
      pathY.push(...path.y);
    }

    if (endPit) {
      const path = endPit[1].getPath(endPit[0][0], endPoint);
      pathX.push(endPit[0][0][0]);
      pathY.push(endPit[0][0][1]);
      pathX.push(...path.x);
      pathY.push(...path.y);
    } else {
      pathX.push(endPoint[0]);
      pathY.push(endPoint[1]);
    }

    return { x: pathX, y: pathY };
  }

  checkPitOnPoint(point: [number, number], radius: number) {
    for (let index = 0; index < this.pits.length; index++)
      if (this.pits[index].isCircleInPit(point, radius))
        return this.pits[index];
    return null;
  }

  //HECTIC: this should be optimized with a quad-tree/grid index to get pits to render
  getRenderedPits(point: [number, number]) {
    const relevantPits: any = [];
    for (let index = 0; index < this.pits.length; index++) {
      const distance = pointUtils.distance(point, [
        this.pits[index].entityX,
        this.pits[index].entityY,
      ]);
      if (distance < 700 + this.pits[index].radius) {
        relevantPits.push(this.pits[index]);
      }
    }
    return relevantPits;
  }
}

export default World;
