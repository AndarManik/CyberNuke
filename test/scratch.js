class PaddedEdge {
  constructor(start, end) {
    this.start = start;
    this.end = end;

    const xDelta = end[0] - start[0];
    const yDelta = end[1] - start[1];
    const magnitude = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

    //values used to compute padded region
    this.normal = [-yDelta / magnitude, xDelta, magnitude];
    this.xMax = Math.max(start[0], end[0]);
    this.xMin = Math.min(start[0], end[0]);
    this.yMax = Math.max(start[0], end[0]);
    this.yMin = Math.min(start[0], end[0]);
  }

  getPaddedComponents(padding) {
    const paddedVertices = [
      [
        this.start[0] - padding * this.normal[0],
        this.start[1] - padding * this.normal[1],
      ],
      [
        this.start[0] + padding * this.normal[0],
        this.start[1] + padding * this.normal[1],
      ],
      [
        this.end[0] + padding * this.normal[0],
        this.end[1] + padding * this.normal[1],
      ],
      [
        this.end[0] - padding * this.normal[0],
        this.end[1] - padding * this.normal[1],
      ],
    ];
    return paddedVertices;
  }
}

function orentationOfPoints(point, start, end) {
  let val =
    (start[1] - point[1]) * (end[0] - start[0]) -
    (start[0] - point[0]) * (end[1] - start[1]);
  if (val == 0) return 0; // collinear
  return val > 0 ? 1 : 2; // clock or counterclock wise
}

function pointInsideRectangle(vertices, point) {
  return (
    orentationOfPoints(point, vertices[0], vertices[1]) !== 2 &&
    orentationOfPoints(point, vertices[1], vertices[2]) !== 2 &&
    orentationOfPoints(point, vertices[2], vertices[3]) !== 2 &&
    orentationOfPoints(point, vertices[3], vertices[0]) !== 2
  );
}

const edge = new PaddedEdge([2, 0], [1, 0]);
const paddedComponents = edge.getPaddedComponents(1);



console.log(paddedComponents);

console.log(pointInsideRectangle(paddedComponents, [1, 1]));
