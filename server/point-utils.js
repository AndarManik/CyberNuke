class PointUtils {
  constructor() {}

  distance(point1, point2) {
    const deltaX = point1[0] - point2[0];
    const deltaY = point1[1] - point2[1];
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  isPointInRadius(point, center, radius) {
    return this.distance(point, center) <= radius;
  }

  // The main  that returns true if line segment 'p1q1'
  // and 'p2q2' intersect.
  checkClosedIntersection(p1, q1, p2, q2) {
    // Find the four orientations needed for general and
    // special cases
    let o1 = this.orentationOfPoints(p1, q1, p2);
    let o2 = this.orentationOfPoints(p1, q1, q2);
    let o3 = this.orentationOfPoints(p2, q2, p1);
    let o4 = this.orentationOfPoints(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4) return true;

    // Special Cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 == 0 && this.isCollinearPointOnSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 == 0 && this.isCollinearPointOnSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 == 0 && this.isCollinearPointOnSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 == 0 && this.isCollinearPointOnSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
  }

  checkOpenIntersection(p1, q1, p2, q2) {
    // Find the four orientations needed for general and
    // special cases
    let o1 = this.orentationOfPoints(p1, q1, p2);
    let o2 = this.orentationOfPoints(p1, q1, q2);
    let o3 = this.orentationOfPoints(p2, q2, p1);
    let o4 = this.orentationOfPoints(p2, q2, q1);

    //special case
    if (o1 == 0 || o2 == 0 || o3 == 0 || o4 == 0) {
      return false;
    }

    // General case
    return o1 != o2 && o3 != o4;
  }

  // Given three collinear points point, q, r, the  checks if
  // point q lies on line segment 'pr'
  isCollinearPointOnSegment(point, q, r) {
    if (
      q[0] <= Math.max(point[0], r[0]) &&
      q[0] >= Math.min(point[0], r[0]) &&
      q[1] <= Math.max(point[1], r[1]) &&
      q[1] >= Math.min(point[1], r[1])
    )
      return true;

    return false;
  }

  isPointOnSegment(segmentStart, point, segmentEnd) {
    if (this.orentationOfPoints(segmentStart, point, segmentEnd) !== 0)
      return false;
    return this.isCollinearPointOnSegment(segmentStart, point, segmentEnd);
  }

  // To find orientation of ordered triplet (point, q, r).
  // The  returns following values
  // 0 --> point, q and r are collinear
  // 1 --> Clockwise
  // 2 --> Counterclockwise
  orentationOfPoints(point, q, r) {
    let val =
      (q[1] - point[1]) * (r[0] - q[0]) - (q[0] - point[0]) * (r[1] - q[1]);

    if (val == 0) return 0; // collinear

    return val > 0 ? 1 : 2; // clock or counterclock wise
  }

  isSegmentIntersectingCircle(point1, point2, center, r) {
    let x_linear = point2[0] - point1[0];
    let x_constant = point1[0] - center[0];
    let y_linear = point2[1] - point1[1];
    let y_constant = point1[1] - center[1];
    let a = x_linear * x_linear + y_linear * y_linear;
    let half_b = x_linear * x_constant + y_linear * y_constant;
    let c = x_constant * x_constant + y_constant * y_constant - r * r;
    return (
      half_b * half_b >= a * c &&
      (-half_b <= a || c + half_b + half_b + a <= 0) &&
      (half_b <= 0 || c <= 0)
    );
  }

  aStar(startNode, endNode, nodes, edges) {
    const costFromStart = {};
    costFromStart[startNode] = 0;

    const openSet = new Set([startNode]);
    const cameFrom = new Map();

    const heuristicCost = new Map();
    nodes.forEach((_, index) => {
      heuristicCost.set(index, distance(nodes[index], nodes[endNode]));
    });

    const gScore = new Map();
    nodes.forEach((_, index) => {
      gScore.set(index, Infinity);
    });
    gScore.set(startNode, 0);

    const fScore = new Map();
    nodes.forEach((_, index) => {
      fScore.set(index, Infinity);
    });
    fScore.set(startNode, heuristicCost.get(startNode));

    function distance(pointA, pointB) {
      return Math.sqrt(
        Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)
      );
    }

    while (openSet.size > 0) {
      let lowest = null;
      openSet.forEach((node) => {
        if (lowest === null || fScore.get(node) < fScore.get(lowest)) {
          lowest = node;
        }
      });

      if (lowest === endNode) {
        return this.reconstructPath(cameFrom, endNode);
      }

      openSet.delete(lowest);
      const neighbors = edges[lowest];

      for (const [neighbor, weight] of neighbors) {
        let tentative_gScore = gScore.get(lowest) + weight;
        if (tentative_gScore < gScore.get(neighbor)) {
          cameFrom.set(neighbor, lowest);
          gScore.set(neighbor, tentative_gScore);
          fScore.set(neighbor, tentative_gScore + heuristicCost.get(neighbor));
          if (!openSet.has(neighbor)) {
            openSet.add(neighbor);
          }
        }
      }
    }

    return "No path found";
  }

  reconstructPath(cameFrom, currentNode) {
    let totalPath = [currentNode];
    while (cameFrom.has(currentNode)) {
      currentNode = cameFrom.get(currentNode);
      totalPath.unshift(currentNode);
    }
    console.log(totalPath);
    return totalPath;
  }

  isSegmentinPolygon(segmentStart, segmentEnd, polygon) {
    //check if the line intersects with any of the segments of the polygon, except for when the intersection point is segmentStart or segmentEnd

    for (let index = 0; index < polygon.length; index++) {
      if (
        !this.isPointOnSegment(
          polygon[index],
          segmentStart,
          polygon[(index + 1) % polygon.length]
        ) &&
        !this.isPointOnSegment(
          polygon[index],
          segmentEnd,
          polygon[(index + 1) % polygon.length]
        ) &&
        this.checkClosedIntersection(
          segmentStart,
          segmentEnd,
          polygon[index],
          polygon[(index + 1) % polygon.length]
        )
      ) {
        return true;
      }
    }

    //if there are no intersections check the mid point with a horizontal line and count how line intersect on the left. Odd means inside and even means outside.

    const midPoint = [
      (segmentStart[0] + segmentEnd[0]) / 2,
      (segmentStart[1] + segmentEnd[1]) / 2,
    ];

    return this.isPointinOpenPolygon(midPoint, polygon);
  }

  isPointinOpenPolygon(point, polygon) {
    const pointAtInfinityTotheLeft = [Number.MIN_SAFE_INTEGER, point[1]];
    let intersectCount = 0;
    let onSegment = false;
    polygon.forEach((node, index) => {
      if (
        this.checkClosedIntersection(
          pointAtInfinityTotheLeft,
          point,
          node,
          polygon[(index + 1) % polygon.length]
        )
      ) {
        intersectCount++;
        if (node[1] == point[1]) {
          intersectCount--;
        }
      }

      if (
        this.isPointOnSegment(
          node,
          point,
          polygon[(index + 1) % polygon.length]
        )
      ) {
        onSegment = true;
      }
    });

    if (onSegment) {
      return false;
    } else {
      return intersectCount % 2 == 1;
    }
  }

  getBidrectionalGraphfromPolygon(polygon) {
    console.log("getBidrection", polygon);
    return polygon.map((node, index) => {
      const leftIndex = (index - 1 + polygon.length) % polygon.length;
      const rightIndex = (index + 1) % polygon.length;

      return [
        [leftIndex, this.distance(node, polygon[leftIndex])],
        [rightIndex, this.distance(node, polygon[rightIndex])],
      ];
    });
  }

  buildPathingGraphFromPolygons(polygons) {
    const pathEdges = [];
    let edgeCount = 0;
    console.log(polygons);
    polygons.forEach((polygon) => {
      const graph = this.getBidrectionalGraphfromPolygon(polygon);
      graph.forEach((node) => {
        node.forEach((nodeEdge) => {
          nodeEdge[0] += edgeCount;
        });
      });
      edgeCount += polygon.length;
      pathEdges.push(...graph);
    });

    const pathNodes = [];
    polygons.forEach((polygon) => pathNodes.push(...polygon));

    console.log("building", pathEdges, pathNodes);

    pathNodes.forEach((startNode, startIndex) => {
      pathNodes.forEach((endNode, endIndex) => {
        if (
          endIndex > startIndex &&
          endIndex != pathEdges[startIndex][0][0] &&
          endIndex != pathEdges[startIndex][1][0] &&
          !polygons.some((polygon) =>
            this.isSegmentinPolygon(startNode, endNode, polygon)
          )
        ) {
          const distance = this.distance(startNode, endNode);
          pathEdges[startIndex].push([endIndex, distance]);
          pathEdges[endIndex].push([startIndex, distance]);
        }
      });
    });

    return [pathNodes, pathEdges];
  }

  sqr(x) {
    return x * x;
  }
  distanceSquared(point1, point2) {
    return this.sqr(point1[0] - point2[0]) + this.sqr(point1[1] - point2[1]);
  }
  distToSegmentSquared(point, segmentStart, segmentEnd) {
    var l2 = this.distanceSquared(segmentStart, segmentEnd);
    if (l2 == 0) return this.distanceSquared(point, segmentStart);
    var t =
      ((point[0] - segmentStart[0]) * (segmentEnd[0] - segmentStart[0]) +
        (point[1] - segmentStart[1]) * (segmentEnd[1] - segmentStart[1])) /
      l2;
    t = Math.max(0, Math.min(1, t));
    return this.distanceSquared(point, {
      x: segmentStart[0] + t * (segmentEnd[0] - segmentStart[0]),
      y: segmentStart[1] + t * (segmentEnd[1] - segmentStart[1]),
    });
  }
  distToSegment(point, segmentStart, segmentEnd) {
    return Math.sqrt(
      this.distToSegmentSquared(point, segmentStart, segmentEnd)
    );
  }
  projectPointOntoSegment(point, segmentStart, segmentEnd) {
    const apx = point[0] - segmentStart[0];
    const apy = point[1] - segmentStart[1];
    const abx = segmentEnd[0] - segmentStart[0];
    const aby = segmentEnd[1] - segmentStart[1];
    const abMag = abx * abx + aby * aby;
    const dotProduct = apx * abx + apy * aby;
    const ratio = abMag === 0 ? 0 : dotProduct / abMag;

    if (ratio < 0) return [segmentStart[0], segmentStart[1]];
    else if (ratio > 1) return [segmentEnd[0], segmentEnd[1]];
    else return [segmentStart[0] + ratio * abx, segmentStart[1] + ratio * aby];
  }
}

const pointUtils = new PointUtils();

module.exports = { pointUtils };
