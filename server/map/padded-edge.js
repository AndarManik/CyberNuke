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
        start[0] + padding * this.normal[0],
        start[1] + padding * this.normal[1],
      ],
      [
        start[0] - padding * this.normal[0],
        start[1] - padding * this.normal[1],
      ],
      [end[0] + padding * this.normal[0], end[1] + padding * this.normal[1]],
      [end[0] - padding * this.normal[0], end[1] - padding * this.normal[1]],
    ];

    const lineSegmentCollider = (start, end) => {
      //initial cheap check - checks the axis aligned boundingbox
      const bothAreRight = start[0] >= this.xMax && end[0] >= this.xMax;
      const bothAreLeft = start[0] <= this.xMin && end[0] <= this.xMin;
      const bothAreAbove = start[1] >= this.yMax && end[1] >= this.yMax;
      const bothAreBelow = start[1] >= this.xMin && end[1] >= this.xMin;
      const noPossbleCollision =
        bothAreRight || bothAreLeft || bothAreAbove || bothAreBelow;
      if (noPossbleCollision) return false;

      //slightly expensive check - checks rectangle intersection
      if (!rectangleSegmentIntersection(paddedVertices, start, end))
        return false;

      //At this point the line segment does intersect the rectangle but we need to see if it only intersects at the boundary, if so it is not a collision
    };

    return [paddedVertices, lineSegmentCollider];
  }
}

function rectangleSegmentIntersection(vertices, start, end) {
  const intersectsAnEdge =
    segmentIntersection(vertices[0][0], vertices[0][1], start, end) ||
    segmentIntersection(vertices[1][0], vertices[1][1], start, end) ||
    segmentIntersection(vertices[2][0], vertices[2][1], start, end) ||
    segmentIntersection(vertices[3][0], vertices[3][1], start, end);
  if (intersectsAnEdge || pointInsideRectangle(vertices, start)) return true;
  return false;
}

function segmentIntersection(p1, q1, p2, q2) {
  // General case

  // Find the four orientations needed for general and
  // special cases
  let o1 = orentationOfPoints(p1, q1, p2);
  let o2 = orentationOfPoints(p1, q1, q2);
  let o3 = orentationOfPoints(p2, q2, p1);
  let o4 = orentationOfPoints(p2, q2, q1);
  if (o1 != o2 && o3 != o4) return true;

  // Special Cases

  // p1, q1 and p2 are collinear and p2 lies on segment p1q1
  if (o1 == 0 && pointSegmentIntersection(p1, p2, q1)) return p2;
  // p1, q1 and q2 are collinear and q2 lies on segment p1q1
  if (o2 == 0 && pointSegmentIntersection(p1, q2, q1)) return q2;
  // p2, q2 and p1 are collinear and p1 lies on segment p2q2
  if (o3 == 0 && pointSegmentIntersection(p2, p1, q2)) return p1;
  // p2, q2 and q1 are collinear and q1 lies on segment p2q2
  if (o4 == 0 && pointSegmentIntersection(p2, q1, q2)) return q1;
  return false; // Doesn't fall in any of the above cases
}

function orentationOfPoints(point, start, end) {
  let val =
    (start[1] - point[1]) * (end[0] - start[0]) -
    (start[0] - point[0]) * (end[1] - start[1]);
  if (val == 0) return 0; // collinear
  return val > 0 ? 1 : 2; // clock or counterclock wise
}

function pointSegmentIntersection(point, start, end) {
  //This assumes the points are colinear
  return (
    start[0] <= Math.max(point[0], end[0]) &&
    start[0] >= Math.min(point[0], end[0]) &&
    start[1] <= Math.max(point[1], end[1]) &&
    start[1] >= Math.min(point[1], end[1])
  );
}

function pointInsideRectangle(vertices, point) {
  return (
    orentationOfPoints(point, vertices[0], vertices[1]) !== 2 &&
    orentationOfPoints(point, vertices[1], vertices[2]) !== 2 &&
    orentationOfPoints(point, vertices[2], vertices[3]) !== 2 &&
    orentationOfPoints(point, vertices[3], vertices[0]) !== 2
  );
}

module.exports = PaddedEdge;
