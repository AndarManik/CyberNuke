const { PathCalculator } = require("../server/path-calculator.js");
const { pointUtils } = require("../server/point-utils.js");

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
      [
        [0, 5],
        [5, 0],
        [0, -5],
        [-5, 0],
      ]
    )
  ).toBe(true);
});

test("isSegmentinPolygon fully inside midpoint hits a vertex", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [0, 0],
      [1, 0],
      [
        [0, 5],
        [5, 0],
        [0, -5],
        [-5, 0],
      ]
    )
  ).toBe(true);
});

test("isSegmentinPolygon inside segment is polygon points", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [5, 0],
      [-20, 0],
      [
        [0, 5],
        [5, 0],
        [0, -5],
        [-5, 0],
      ]
    )
  ).toBe(true);
});

test("isSegmentinPolygon inside segment is polygon points", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [5, 0],
      [-20, 0],
      [
        [0, 5],
        [5, 0],
        [0, -5],
        [-5, 0],
      ]
    )
  ).toBe(true);
});

test("isSegmentinPolygon inside segment is polygon edge new!!!!!!", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [2, 0],
      [2, 10],
      [
        [0, 0],
        [5, 0],
        [5, 5],
        [0, 5],
      ]
    )
  ).toBe(true);
});

test("isSegmentinPolygon outside", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [10, 0],
      [10, 5],
      [
        [0, 5],
        [5, 0],
        [0, -5],
        [-5, 0],
      ]
    )
  ).toBe(false);
});

test("isSegmentinPolygon outside touching", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [5, 0],
      [10, 5],
      [
        [0, 5],
        [5, 0],
        [0, -5],
        [-5, 0],
      ]
    )
  ).toBe(false);
});

test("isSegmentinPolygon real data", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [215, 162.5],
      [115, 187.5],
      [
        [215, 162.5],
        [225, 152.5],
        [275, 152.5],
        [285, 162.5],
        [285, 212.5],
        [275, 222.5],
        [225, 222.5],
        [215, 212.5],
      ]
    )
  ).toBe(false);
});

test("isSegmentinPolygon real data", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [215, 162.5],
      [115, 187.5],
      [
        [115, 187.5],
        [125, 177.5],
        [175, 177.5],
        [185, 187.5],
        [185, 237.5],
        [175, 247.5],
        [125, 247.5],
        [115, 237.5],
      ]
    )
  ).toBe(true);
});

test("checkOpenIntersection real data", () => {
  expect(
    pointUtils.checkOpenIntersection(
      [215, 162.5],
      [115, 187.5],
      [125, 177.5],
      [175, 177.5]
    )
  ).toBe(true);
});

test("isSegmentinPolygon real data", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [150, 177.5],
      [175, 177.5],
      [
        [115, 187.5],
        [125, 177.5],
        [175, 177.5],
        [185, 187.5],
        [185, 237.5],
        [175, 247.5],
        [125, 247.5],
        [115, 237.5],
      ]
    )
  ).toBe(false);
});

test("checkOpenIntersection real data ontop", () => {
  expect(
    pointUtils.checkOpenIntersection(
      [150, 177.5],
      [175, 177.5],
      [125, 177.5],
      [175, 177.5]
    )
  ).toBe(false);
});

test("checkOpenIntersection real data < shape", () => {
  expect(
    pointUtils.checkOpenIntersection(
      [150, 177.5],
      [175, 177.5],
      [175, 177.5],
      [185, 187.5]
    )
  ).toBe(false);
});

test("projectPointOntoSegment", () => {
  expect(
    pointUtils.projectPointOntoSegment([150, 0], [100, 177.5], [175, 177.5])
  ).toStrictEqual([150, 177.5]);
});

test("isSegmentinPolygon real data new", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [191.25, 250],
      [191.25, 193.5],
      [
        [133.75, 225],
        [143.75, 215],
        [181.25, 215],
        [191.25, 225],
        [191.25, 250],
        [181.25, 260],
        [143.75, 260],
        [133.75, 250],
      ],
      true
    )
  ).toBe(true);
});

test("isSegmentinPolygon real data new", () => {
  expect(
    pointUtils.isSegmentinPolygon(
      [236.2085784158557, 260],
      [218.75, 260],
      [
        [208.75, 225],
        [218.75, 215],
        [256.25, 215],
        [266.25, 225],
        [266.25, 250],
        [256.25, 260],
        [218.75, 260],
        [208.75, 250],
      ],
      true
    )
  ).toBe(false);
});

test("isPointinOpenPolygon real data new", () => {
  expect(
    pointUtils.isPointinOpenPolygon(
      [(236.2085784158557 + 218.75) / 2, (260 + 260) / 2],
      [
        [208.75, 225],
        [218.75, 215],
        [256.25, 215],
        [266.25, 225],
        [266.25, 250],
        [256.25, 260],
        [218.75, 260],
        [208.75, 250],
      ],
      true
    )
  ).toBe(false);
});


test("intersection segment circle", () => {
  expect(
    pointUtils.getIntersectionSegmentCircle([0, -10], [0, 10], [0, 0], 5)
  ).toStrictEqual([[0,-5],[0,5]]);
});
