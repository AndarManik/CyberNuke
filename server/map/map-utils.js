//  @@@  @@@ @@@@@@@@ @@@@@@@ @@@@@@@ @@@@@@  @@@@@@@
//  @@!  @@@ @@!     !@@        @!!  @@!  @@@ @@!  @@@
//  @!@  !@! @!!!:!  !@!        @!!  @!@  !@! @!@!!@!
//   !: .:!  !!:     :!!        !!:  !!:  !!! !!: :!!
//     ::    : :: ::  :: :: :    :    : :. :   :   : :

function addVectors(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function scaleVector(v, scalar) {
  return [v[0] * scalar, v[1] * scalar];
}
function vectorSubtraction(v1, v2) {
  return [v2[0] - v1[0], v2[1] - v1[1]];
}

function dotProduct(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

function magnitude(v) {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2);
}

function equalVectors(v1, v2) {
  return v1[0] === v2[0] && v1[1] === v2[1];
}

function normalize(v) {
  const magnitude = magnitude(v);
  return [magnitude * v[0], magnitude * v[1]];
}

function distance(v1, v2) {
  return magnitude(vectorSubtraction(v1, v2));
}

function calculateAngle(a, b, c) {
  const dp = dotProduct(AB, BC);
  const distAB = distance(a, b);
  const distBC = distance(b, c);
  const cosTheta = dp / (distAB * distBC);
  const theta = Math.acos(cosTheta);
  return theta;
}

function rotatePointAround(basePoint, pointToRotate, theta) {
  const translated = vectorSubtraction(basePoint, pointToRotate);
  const rotated = [
    translated[0] * Math.cos(theta) - translated[1] * Math.sin(theta),
    translated[0] * Math.sin(theta) + translated[1] * Math.cos(theta),
  ];
  return addVectors(rotated, basePoint);
}

function scalePointFrom(basePoint, pointToMove, scale) {
  const projectToOrigin = vectorSubtraction(pointToMove, basePoint);
  const scaled = scaleVector(projectToOrigin, scale);
  const reProject = addVectors(basePoint, scaled);
  return reProject;
}

function setDistanceTo(basePoint, pointToMove, distance) {
  const direction = vectorSubtraction(pointToMove, basePoint);
  const normalizedDirection = scaleVector(direction, 1 / magnitude(direction));
  const moveToDistance = scaleVector(normalizedDirection, distance);
  return addVectors(basePoint, moveToDistance);
}

function interpVectors(v1, v2, alpha) {
  const scaledV1 = scaleVector(v1, 1 - alpha);
  const scaledV2 = scaleVector(v2, alpha);
  return addVectors(scaledV1, scaledV2);
}

//
//  @@@@@@@   @@@@@@  @@@@@@@  @@@@@@@  @@@ @@@  @@@  @@@@@@@
//  @@!  @@@ @@!  @@@ @@!  @@@ @@!  @@@ @@! @@!@!@@@ !@@
//  @!@@!@!  @!@!@!@! @!@  !@! @!@  !@! !!@ @!@@!!@! !@! @!@!@
//  !!:      !!:  !!! !!:  !!! !!:  !!! !!: !!:  !!! :!!   !!:
//   :        :   : : :: :  :  :: :  :  :   ::    :   :: :: :
//

// This assumes that the vertices are ordered clock wise
// Returns the path a circle would make tracing around a polygon
// This is trivial for the edges but the behavior around corners is special
const MAXSEGMENTLENGTH = 5;
function buildPaddedGraph(vertices, padding, edgeIndexOffset = 0) {
  const paddedEdges = [];
  const paddedCorners = [];

  // Build edges
  for (let index = 0; index < vertices.length; index++) {
    const start = vertices[index];
    const end = vertices[(index + 1) % vertices.length];
    const paddedEdge = padEdgeLeft(start, end, padding);
    paddedEdges.push(paddedEdge);
  }

  // Build corners
  for (let index = 0; index < vertices.length; index++) {
    const startPoint =
      paddedEdges[(vertices.length + index - 1) % vertices.length][1];
    const center = vertices[index];
    const endPoint =
      paddedEdges[(vertices.length + index + 1) % vertices.length][0];
    const paddedCorner = padCornerLeft(startPoint, center, endPoint);
    paddedCorners.push(paddedCorner);
  }

  const pathVertices = [];
  const pathEdges = [];

  for (let index = 0; index < vertices.length; index++) {
    pathVertices.push(...paddedCorners[index]);
    pathVertices.push(...paddedEdges[index]);
  }

  // MAYHEM: there can be many different types of intersections within this path which needs to be resolved. This can be done by making the graph, inserting intersection points and following the exterior.

  //remove overlapping edges
  pathVertices.filter(
    (item, index) =>
      !equalVectors(item, pathVertices[(index + 1) % pathVertices.length])
  );

  for (let index = 0; index < pathVertices.length; index++) {
    const indexForward = (index + 1) % pathVertices.length;
    const distanceForward = distance(
      pathVertices[index],
      pathVertices[indexForward]
    );
    const forward = [indexForward + edgeIndexOffset, distanceForward];

    const indexBackward =
      (pathVertices.length + index - 1) % pathVertices.length;
    const distanceBackward = distance(
      pathVertices[index],
      pathVertices[indexBackward]
    );
    const backward = [indexBackward + edgeIndexOffset, distanceBackward];

    const currentEdges = [backward, forward];
    pathEdges.push(currentEdges);
  }

  return { pathVertices, pathEdges };
}

// The path a circle would take tracing across and edge
function padEdgeLeft(start, end, padding) {
  const delta = vectorSubtraction(start, end);
  const mag = magnitude(delta);
  const normal = [-delta[1] / mag, delta[0] / mag];
  const paddedStart = addVectors(start, scaleVector(normal, padding));
  const paddedEnd = addVectors(end, scaleVector(normal, padding));
  return [paddedStart, paddedEnd];
}

// Approximates the path a circle would take tracing around a corner
function padCornerLeft(startPoint, center, endPoint) {
  if (equalVectors(startPoint, endPoint)) return [];
  const externalAngle = calculateAngle(startPoint, center, endPoint);
  const arcLength = externalAngle * padding;
  const numberOfSegments = Math.ceil(arcLength / MAXSEGMENTLENGTH);
  const segmentAngle = externalAngle / numberOfSegments;
  const paddedStart = rotatePointAround(
    center,
    scalePointFrom(center, startPoint, 1 / Math.cos(segmentAngle / 2)),
    segmentAngle / 2
  );
  const paddedCorner = [];
  for (let segmentIndex = 0; segmentIndex < numberOfSegments; segmentIndex++) {
    paddedCorner.push(
      rotatePointAround(center, paddedStart, segmentAngle * segmentIndex)
    );
  }
  return paddedCorner;
}

//
//   @@@@@@@ @@@@@@  @@@      @@@      @@@ @@@@@@@  @@@@@@@@ @@@@@@@
//  !@@     @@!  @@@ @@!      @@!      @@! @@!  @@@ @@!      @@!  @@@
//  !@!     @!@  !@! @!!      @!!      !!@ @!@  !@! @!!!:!   @!@!!@!
//  :!!     !!:  !!! !!:      !!:      !!: !!:  !!! !!:      !!: :!!
//   :: :: : : :. :  : ::.: : : ::.: : :   :: :  :  : :: ::   :   : :
//

// Return a function which computes the collision of the padded shape and a linesegment
function buildCollider(vertices) {
  // Precompute step for building the function
  const boundingBox = boundingBoxFromVertices(vertices);

  const lineSegmentCollider = (start, end) => {
    //cheap
    const inBoundingBox = boundingBoxCollision(
      boundingBox[0],
      boundingBox[1],
      start,
      end
    );
    if (!inBoundingBox) return false;

    //expensive
    return doesSegmentIntersectPolygon(vertices, start, end);
  };

  return lineSegmentCollider;
}

function pointOrientation(p, q, r) {
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  if (val === 0) return 0; // colinear
  return val > 0 ? 1 : 2; // clock or counterclock wise
}

function doIntersect(p1, q1, p2, q2) {
  const o1 = pointOrientation(p1, q1, p2);
  const o2 = pointOrientation(p1, q1, q2);
  const o3 = pointOrientation(p2, q2, p1);
  const o4 = pointOrientation(p2, q2, q1);

  // General case
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  // Special Cases
  // p1, q1 and p2 are colinear and p2 lies on segment p1q1
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;

  // p1, q1 and q2 are colinear and q2 lies on segment p1q1
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are colinear and p1 lies on segment p2q2
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are colinear and q1 lies on segment p2q2
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
}

function findIntersection(p1, q1, p2, q2) {
  const A1 = q1[1] - p1[1]; // Delta y of the first line
  const B1 = p1[0] - q1[0]; // Delta x of the first line (negated)
  const C1 = A1 * p1[0] + B1 * p1[1]; // Constant of the first line
  const A2 = q2[1] - p2[1]; // Delta y of the second line
  const B2 = p2[0] - q2[0]; // Delta x of the second line (negated)
  const C2 = A2 * p2[0] + B2 * p2[1]; // Constant of the second line

  const determinant = A1 * B2 - A2 * B1;

  if (determinant === 0) {
    // parallel case
    let equalPoint;
    let otherPoint1;
    let otherPoint2;

    if (equalVectors(p1, p2)) {
      equalPoint = p1;
      otherPoint1 = q1;
      otherPoint2 = q2;
    }

    if (equalVectors(p1, q2)) {
      equalPoint = p1;
      otherPoint1 = q1;
      otherPoint2 = p2;
    }

    if (equalVectors(q1, p2)) {
      equalPoint = q1;
      otherPoint1 = p1;
      otherPoint2 = q2;
    }

    if (equalVectors(q1, q2)) {
      equalPoint = q1;
      otherPoint1 = p1;
      otherPoint2 = p2;
    }

    const normalized1 = normalize(vectorSubtraction(equalPoint, otherPoint1));
    const normalized2 = normalize(vectorSubtraction(equalPoint, otherPoint2));

    if (normalized1[0] === normalized2[0] && normalized1[1] === normalized2[1])
      return equalPoint;
    return null;
  } else {
    // The lines intersect at a single point.
    const x = (B2 * C1 - B1 * C2) / determinant;
    const y = (A1 * C2 - A2 * C1) / determinant;
    return [x, y];
  }
}

function onSegment(p, q, r) {
  if (
    q[0] <= Math.max(p[0], r[0]) &&
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) &&
    q[1] >= Math.min(p[1], r[1])
  ) {
    return true;
  }
  return false;
}

function isPointOnBoundary(point, polygon) {
  const pointX = point[0];
  const pointY = point[1];
  const verticesCount = polygon.length;

  for (let i = 0, j = verticesCount - 1; i < verticesCount; j = i++) {
    const currentVertexX = polygon[i][0],
      currentVertexY = polygon[i][1];
    const previousVertexX = polygon[j][0],
      previousVertexY = polygon[j][1];

    // Calculate differences
    const deltaX = previousVertexX - currentVertexX;
    const deltaY = previousVertexY - currentVertexY;

    // Check if the point is on the line segment
    const isOnLine =
      deltaX * (pointY - currentVertexY) === deltaY * (pointX - currentVertexX);

    if (
      isOnLine &&
      pointX >= Math.min(currentVertexX, previousVertexX) &&
      pointX <= Math.max(currentVertexX, previousVertexX) &&
      pointY >= Math.min(currentVertexY, previousVertexY) &&
      pointY <= Math.max(currentVertexY, previousVertexY)
    ) {
      return true; // Point is on the boundary
    }
  }
  return false; // Point is not on the boundary
}

function isPointInsidePolygon(point, polygon) {
  if (isPointOnBoundary(point, polygon)) {
    return false; // Point on boundary is considered outside
  }

  let intersectionCount = 0;
  const pointX = point[0];
  const pointY = point[1];
  const verticesCount = polygon.length;

  for (let i = 0, j = verticesCount - 1; i < verticesCount; j = i++) {
    const currentVertexX = polygon[i][0],
      currentVertexY = polygon[i][1];
    const previousVertexX = polygon[j][0],
      previousVertexY = polygon[j][1];

    if (
      currentVertexY !== previousVertexY &&
      pointY >= Math.min(currentVertexY, previousVertexY) &&
      pointY < Math.max(currentVertexY, previousVertexY)
    ) {
      const intersecX =
        ((pointY - currentVertexY) * (previousVertexX - currentVertexX)) /
          (previousVertexY - currentVertexY) +
        currentVertexX;
      if (currentVertexX === previousVertexX || pointX <= intersecX) {
        intersectionCount++;
      }
    }
  }

  // Odd count means point is inside
  return intersectionCount % 2 !== 0;
}

function doesSegmentIntersectPolygon(points, start, end) {
  const n = points.length;
  const intersections = [];

  // Iterate over all edges of the polygon
  for (let i = 0; i < n; i++) {
    const p2 = points[i];
    const q2 = points[(i + 1) % n];

    // Check if the current edge of the polygon intersects with the line segment
    if (doIntersect(start, end, p2, q2)) {
      const intersectionPoint = findIntersection(start, end, p2, q2);
      if (intersectionPoint) intersections.push(intersectionPoint);
    }
  }

  const doesSegmentIntersect = intersections.length !== 0;
  const endPointInside =
    isPointInsidePolygon(start, points) || isPointInsidePolygon(end, points);
  if (!doesSegmentIntersect) {
    return endPointInside;
  }

  const kissesEdge =
    intersections.length == 1 &&
    (equalVectors(intersections[0], start) ||
      equalVectors(intersections[0], end));
  const kissesVertex =
    intersections.length === 2 &&
    equalVectors(intersections[0], intersections[1]) &&
    (equalVectors(start, intersections[0]) ||
      equalVectors(end, intersections[0]));
  const kisses = kissesEdge || kissesVertex;
  if (kisses && !endPointInside) return false;

  return doesSegmentIntersect;
}

function boundingBoxFromVertices(vertices) {
  const max = [...vertices[0]];
  const min = [...vertices[0]];
  vertices.forEach((vertex) => {
    if (vertex[0] > max[0]) max[0] = vertex[0];
    if (vertex[1] > max[1]) max[1] = vertex[1];
    if (vertex[0] < min[0]) min[0] = vertex[0];
    if (vertex[1] < min[1]) min[1] = vertex[1];
  });
  return [max, min];
}

function boundingBoxCollision(max, min, start, end) {
  const rectLeft = min[0];
  const rectRight = max[0];
  const rectTop = max[1];
  const rectBottom = min[1];
  const startX = start[0];
  const startY = start[1];
  const endX = end[0];
  const endY = end[1];
  if (
    (startX >= rectLeft &&
      startX <= rectRight &&
      startY >= rectBottom &&
      startY <= rectTop) ||
    (endX >= rectLeft &&
      endX <= rectRight &&
      endY >= rectBottom &&
      endY <= rectTop)
  ) {
    return true;
  }
  const dx = endX - startX;
  const dy = endY - startY;
  const sides = [
    { a: [rectLeft, rectBottom], b: [rectLeft, rectTop] }, // Left side
    { a: [rectRight, rectBottom], b: [rectRight, rectTop] }, // Right side
    { a: [rectLeft, rectBottom], b: [rectRight, rectBottom] }, // Bottom side
    { a: [rectLeft, rectTop], b: [rectRight, rectTop] }, // Top side
  ];
  for (const side of sides) {
    const sx = side.b[0] - side.a[0];
    const sy = side.b[1] - side.a[1];
    const s =
      (-dy * (startX - side.a[0]) + dx * (startY - side.a[1])) /
      (-sx * dy + dx * sy);
    const t =
      (sx * (startY - side.a[1]) - sy * (startX - side.a[0])) /
      (-sx * dy + dx * sy);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return true;
    }
  }
  return false;
}

//
//  @@@@@@@   @@@@@@ @@@@@@@ @@@  @@@ @@@ @@@  @@@  @@@@@@@
//  @@!  @@@ @@!  @@@  @!!   @@!  @@@ @@! @@!@!@@@ !@@
//  @!@@!@!  @!@!@!@!  @!!   @!@!@!@! !!@ @!@@!!@! !@! @!@!@
//  !!:      !!:  !!!  !!:   !!:  !!! !!: !!:  !!! :!!   !!:
//   :        :   : :   :     :   : : :   ::    :   :: :: :
//

function buildVisibilityGraph(verticesList, padding) {
  const pathVertices = [];
  const pathEdges = [];
  const lineSegmentColliders = [];
  const visibilityCones = [];

  let vertexCount = 0;
  for (let index = 0; index < verticesList.length; index++) {
    const paddedGraph = buildPaddedGraph(
      verticesList[index],
      padding,
      vertexCount
    );
    pathVertices.push(...paddedGraph.pathVertices);
    pathEdges.push(...paddedGraph.pathEdges);
    lineSegmentColliders.push(buildCollider(paddedGraph.pathVertices));
    vertexCount += paddedGraph.pathEdges.length;
  }

  for (let startIndex = 0; startIndex < pathVertices.length - 1; startIndex++) {
    for (
      let endIndex = startIndex + 1;
      endIndex < pathVertices.length;
      endIndex++
    ) {
      const collidesWithTerrain = segmentIntersectsColliders(
        start,
        end,
        lineSegmentColliders
      );

      if (collidesWithTerrain) break;

      const pathDistance = distance(pathEdges[startIndex], pathEdges[endIndex]);

      const startEdge = [endIndex, pathDistance];
      pathEdges[startIndex].push(startEdge);

      const endEdge = [startIndex, pathDistance];
      pathEdges[endIndex].push(endEdge);
    }
  }

  // sort the edges
  for (let index = 0; index < pathEdges.length; index++) {
    const basePoint = pathVertices[index];
    const startPoint = pathVertices[pathEdges[index][0]];
    pathEdges[index].sort((a, b) => {
      const aPoint = pathVertices[a[0]];
      const aAngle = calculateAngle(startPoint, basePoint, aPoint);
      const bPoint = pathVertices[b[0]];
      const bAngle = calculateAngle(startPoint, basePoint, bPoint);
      return aAngle - bAngle;
    });
  }

  for (let index = 0; index < pathEdges.length; index++) {
    const edgeData = pathEdges[index];

    const visibilityCone = [];
    for (let edgeIndex = 0; edgeIndex < edgeData.length - 1; edgeIndex++) {
      const leftEdgeIndex = edgeData[edgeIndex][0];
      const rightEdgeIndex = edgeData[edgeIndex + 1][0];

      //simple case
      const leftEdgeData = pathEdges[leftEdgeIndex];
      const leftNeighborIndex = [
        leftEdgeData[0][0],
        leftEdgeData[leftEdgeData.length - 1][0],
      ];
      const connectByTerrain = leftNeighborIndex.includes(rightEdgeIndex);
      const centerVertex = pathVertices[index];
      const leftVertex = pathVertices[leftEdgeIndex];
      const rightVertex = pathVertices[rightEdgeIndex];
      if (connectByTerrain) {
        const cone = [centerVertex, leftVertex, rightVertex];
        visibilityCone.push(cone);
        continue;
      }

      //medium check - test triangle enclosure with a test segment
      const testPoint1 = interpVectors(leftVertex, rightVertex, 0.25);
      const scaledtestPoint1 = setDistanceTo(centerVertex, testPoint1, 100000);
      const isTrangleEnclosed = segmentIntersectsColliders(
        scaledtestPoint1[0],
        scaledtestPoint1[1],
        lineSegmentColliders
      );
      if (!isTrangleEnclosed) {
        const scaledLeftVertex = setDistanceTo(
          centerVertex,
          leftVertex,
          100000
        );
        const scaledRightVertex = setDistanceTo(
          centerVertex,
          rightVertex,
          100000
        );
        const cone = [centerVertex, scaledLeftVertex, scaledRightVertex];
        visibilityCone.push(cone);
        continue;
      }

      //expensive - for two test points get the nearest intersection with a edge, there has to be one at least. These two nearest points form the back wall of the triangle. Intersect these with the projected edges.

      // CALM: finish the visibilitytriangles
      //    _\/_
      // At this point the back wall of the triangle is either a terrain wall but not at the verticies so like at the middle, or it extends for ever.

      // What's gonna happen is that we will interpolate 2 points between the left and right edge. The first will be casted and if there is not an intersection we know it extaends for ever, if there is an intersection the second point will determine the line fully which can be intersected with the left and right edge to get the full triangle.
    }
  }

  const visibilityGraph = { pathVertices, pathEdges, lineSegmentColliders };
  return visibilityGraph;
}

function segmentIntersectsColliders(start, end, colliders) {
  for (let index = 0; index < colliders.length; index++) {
    const collider = colliders[index];
    if (collider(start, end)) return true;
  }
  return false;
}
