interface PathFinder {
  getPath(startPoint: [number, number], endPoint: [number, number]): PathInfo;
}

class PathInfo {
  x: number[];
  y: number[];
  constructor(pathX: number[], pathY: number[]) {
    this.x = pathX;
    this.y = pathY;
  }
}

export {PathFinder, PathInfo};