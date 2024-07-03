const { pointUtils } = require("../server/point-utils");

test("distance pythagorean", () => {
  expect(pointUtils.distance([0, 3], [4, 0])).toBe(5);
});

test("distance same point", () => {
  expect(pointUtils.distance([0, 3], [0, 3])).toBe(0);
});

test("distance both origin", () => {
  expect(pointUtils.distance([0, 0], [0, 0])).toBe(0);
});

test("isPointInRadius normal outside", () => {
  expect(pointUtils.isPointInRadius([0, 3], [0, 0], 1)).toBe(false);
});

test("isPointInRadius normal inside", () => {
  expect(pointUtils.isPointInRadius([0, 3], [0, 0], 5)).toBe(true);
});

test("isPointInRadius point is center", () => {
  expect(pointUtils.isPointInRadius([0, 0], [0, 0], 1)).toBe(true);
});

test("isPointInRadius point on radius", () => {
  expect(pointUtils.isPointInRadius([0, 3], [0, 0], 3)).toBe(true);
});

test("checkOpenIntersection normal intersect", () => {
  expect(pointUtils.checkOpenIntersection([0, 1], [1, 2], [1, 1], [0, 2])).toBe(
    true
  );
});

test("checkOpenIntersection normal not intersect", () => {
  expect(pointUtils.checkOpenIntersection([0, 1], [1, 1], [1, 2], [0, 2])).toBe(
    false
  );
});

test("checkOpenIntersection overlapping lines", () => {
  expect(pointUtils.checkOpenIntersection([0, 1], [2, 1], [1, 1], [3, 1])).toBe(
    false
  );
});

test("checkOpenIntersection T shape", () => {
  expect(pointUtils.checkOpenIntersection([0, 0], [0, 2], [0, 1], [1, 1])).toBe(
    false
  );
});

test("checkOpenIntersection > shape", () => {
  expect(pointUtils.checkOpenIntersection([0, 0], [0, 2], [0, 2], [1, 2])).toBe(
    false
  );
});

test("checkClosedIntersection normal intersect", () => {
  expect(
    pointUtils.checkClosedIntersection([0, 1], [1, 2], [1, 1], [0, 2])
  ).toBe(true);
});

test("checkClosedIntersection normal not intersect", () => {
  expect(
    pointUtils.checkClosedIntersection([0, 1], [1, 1], [1, 2], [0, 2])
  ).toBe(false);
});

test("checkClosedIntersection overlapping lines", () => {
  expect(
    pointUtils.checkClosedIntersection([0, 1], [2, 1], [1, 1], [3, 1])
  ).toBe(true);
});

test("checkClosedIntersection T shape", () => {
  expect(
    pointUtils.checkClosedIntersection([0, 0], [0, 2], [0, 1], [1, 1])
  ).toBe(true);
});

test("checkClosedIntersection > shape", () => {
  expect(
    pointUtils.checkClosedIntersection([0, 0], [0, 2], [0, 2], [1, 2])
  ).toBe(true);
});

test("isCollinearPointOnSegment normal intersect", () => {
  expect(pointUtils.isCollinearPointOnSegment([0, 0], [1, 1], [2, 2])).toBe(
    true
  );
});

test("isCollinearPointOnSegment normal not intersect", () => {
  expect(pointUtils.isCollinearPointOnSegment([0, 0], [2, 2], [1, 1])).toBe(
    false
  );
});

test("isCollinearPointOnSegment point on segment end", () => {
  expect(pointUtils.isCollinearPointOnSegment([0, 0], [2, 2], [2, 2])).toBe(
    true
  );
});

test("isPointOnSegment normal intersect", () => {
  expect(pointUtils.isPointOnSegment([0, 0], [1, 1], [2, 2])).toBe(true);
});

test("isPointOnSegment intersect on end point", () => {
  expect(pointUtils.isPointOnSegment([0, 0], [1, 1], [1, 1])).toBe(true);
});

test("isPointOnSegment not intersect", () => {
  expect(pointUtils.isPointOnSegment([0, 0], [1, 1], [1, 0])).toBe(false);
});

test("orentationOfPoints clockwise", () => {
  expect(pointUtils.orentationOfPoints([0, 0], [2, 2], [1, 0])).toBe(1);
});

test("orentationOfPoints counter-clockwise", () => {
  expect(pointUtils.orentationOfPoints([0, 0], [2, 2], [0, 1])).toBe(2);
});

test("orentationOfPoints colinear", () => {
  expect(pointUtils.orentationOfPoints([0, 0], [1, 1], [2, 2])).toBe(0);
});

test("isSegmentIntersectingCircle not intersect", () => {
  expect(
    pointUtils.isSegmentIntersectingCircle([3, 3], [4, 4], [0, 0], 1)
  ).toBe(false);
});

test("isSegmentIntersectingCircle tangent line", () => {
  expect(
    pointUtils.isSegmentIntersectingCircle([-1, 1], [1, 1], [0, 0], 1)
  ).toBe(true);
});
test("isSegmentIntersectingCircle intersecting", () => {
  expect(
    pointUtils.isSegmentIntersectingCircle([-2, 1], [2, 1], [0, 0], 2)
  ).toBe(true);
});
test("isSegmentIntersectingCircle fully inside", () => {
  expect(
    pointUtils.isSegmentIntersectingCircle([0, 0], [1, 1], [0, 0], 2)
  ).toBe(true);
});

test("isSegmentinPolygon fully inside", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [0, 0],
      [1, 1],
      [[0, 5], [5, 0], [0, -5], [-5, 0]]
    )
  ).toBe(true);
});

test("isSegmentinPolygon fully inside midpoint hits a vertex", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [0, 0],
      [1, 0],
      [[0, 5], [5, 0], [0, -5], [-5, 0]]
    )
  ).toBe(true);
});

test("isSegmentinPolygon inside segment is polygon points", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [5, 0],
      [-6, 0],
      [[0, 5], [5, 0], [0, -5], [-5, 0]]
    )
  ).toBe(true);
});

test("isSegmentinPolygon inside segment is polygon points", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [5, 0],
      [-4, 0],
      [[0, 5], [5, 0], [0, -5], [-5, 0]]
    )
  ).toBe(true);
});

test("isSegmentinPolygon outside", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [10, 0],
      [10, 5],
      [[0, 5], [5, 0], [0, -5], [-5, 0]]
    )
  ).toBe(false);
});

test("isSegmentinPolygon outside touching", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [5, 0],
      [10, 5],
      [[0, 5], [5, 0], [0, -5], [-5, 0]]
    )
  ).toBe(false);
});
