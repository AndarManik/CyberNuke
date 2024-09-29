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
  getIntersectionSegmentCircle(startPoint, endPoint, center, radius) {
    const startToCenterX = startPoint[0] - center[0];
    const startToCenterY = startPoint[1] - center[1];
    const diffX = endPoint[0] - startPoint[0];
    const diffY = endPoint[1] - startPoint[1];
    const a = diffX * diffX + diffY * diffY;
    const b = 2 * (startToCenterX * diffX + startToCenterY * diffY);
    const c =
      startToCenterX * startToCenterX +
      startToCenterY * startToCenterY -
      radius * radius;
    const discrim = Math.sqrt(b * b - 4 * a * c);
    const t1 = (-b - discrim) / 2 / a;
    const t2 = (-b + discrim) / 2 / a;
    const intersect1 = [
      startPoint[0] + t1 * (endPoint[0] - startPoint[0]),
      startPoint[1] + t1 * (endPoint[1] - startPoint[1]),
    ];
    const intersect2 = [
      startPoint[0] + t2 * (endPoint[0] - startPoint[0]),
      startPoint[1] + t2 * (endPoint[1] - startPoint[1]),
    ];

    return [intersect1, intersect2, t1];
  }

  isPointInCircle(point, center, radius) {
    const xDiff = center[0] - point[0];
    const yDiff = center[1] - point[1];
    return xDiff * xDiff + yDiff * yDiff <= radius * radius;
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
    return totalPath;
  }

  checkHalfOpenIntersection(openStart, openEnd, closedStart, closedEnd) {
    return (
      !this.isPointOnSegment(closedStart, openStart, closedEnd) &&
      !this.isPointOnSegment(closedStart, openEnd, closedEnd) &&
      this.checkClosedIntersection(openStart, openEnd, closedStart, closedEnd)
    );
  }

  isSegmentinPolygon(segmentStart, segmentEnd, polygon, consoleFlag = false) {
    //check if the line intersects with any of the segments of the polygon, except for when the intersection point is segmentStart or segmentEnd

    for (let index = 0; index < polygon.length; index++) {
      if (
        this.checkHalfOpenIntersection(
          segmentStart,
          segmentEnd,
          polygon[index],
          polygon[(index + 1) % polygon.length]
        )
      ) {
        if (consoleFlag) {
          console.log("Intersected boundary");
        }
        return true;
      }
    }

    if (consoleFlag) {
      console.log("either all inside or all outside");
    }

    //if there are no intersections check the mid point with a horizontal line and count how line intersect on the left. Odd means inside and even means outside.

    const midPoint = [
      (segmentStart[0] + segmentEnd[0]) / 2,
      (segmentStart[1] + segmentEnd[1]) / 2,
    ];

    return this.isPointinOpenPolygon(midPoint, polygon, consoleFlag);
  }

  isPointinOpenPolygon(point, polygon, consoleFlag = false) {
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
        ) &&
        node[1] !== point[1]
      ) {
        if (consoleFlag) {
          console.log("intersect++");
        }
        intersectCount++;
      }

      if (
        this.isPointOnSegment(
          node,
          point,
          polygon[(index + 1) % polygon.length]
        )
      ) {
        if (consoleFlag) {
          console.log("is point on segment");
        }
        onSegment = true;
      }
    });

    if (onSegment) {
      return false;
    } else {
      if (consoleFlag) {
        console.log(intersectCount % 2 == 1);
      }
      return intersectCount % 2 == 1;
    }
  }

  getBidrectionalGraphfromPolygon(polygon, edgeCount) {
    const graph = [];
    for (let index = 0; index < polygon.length; index++) {
      const leftIndex = (index - 1 + polygon.length) % polygon.length;
      const rightIndex = (index + 1) % polygon.length;
      graph.push([
        [
          leftIndex + edgeCount,
          this.distance(polygon[index], polygon[leftIndex]),
        ],
        [
          rightIndex + edgeCount,
          this.distance(polygon[index], polygon[rightIndex]),
        ],
      ]);
    }
    return graph;
  }

  buildPathingGraphFromPolygons(polygons) {
    const pathEdges = [];
    const pathNodes = [];

    let edgeCount = 0;
    for (let index = 0; index < polygons.length; index++) {
      pathEdges.push(
        ...this.getBidrectionalGraphfromPolygon(polygons[index], edgeCount)
      );
      pathNodes.push(...polygons[index]);
      edgeCount += polygons[index].length;
    }

    for (let startIndex = 0; startIndex < pathNodes.length - 1; startIndex++) {
      for (
        let endIndex = startIndex + 1;
        endIndex < pathNodes.length;
        endIndex++
      ) {
        if (
          endIndex != pathEdges[startIndex][0][0] &&
          endIndex != pathEdges[startIndex][1][0] &&
          !this.segmentIntersectsPolygons(
            pathNodes[startIndex],
            pathNodes[endIndex],
            polygons
          )
        ) {
          const distance = this.distance(
            pathNodes[startIndex],
            pathNodes[endIndex]
          );
          pathEdges[startIndex].push([endIndex, distance]);
          pathEdges[endIndex].push([startIndex, distance]);
        }
      }
    }

    return [pathNodes, pathEdges];
  }

  segmentIntersectsPolygons(startPoint, endPoint, polygons) {
    const potentialStartPoint = [
      [startPoint[0] + 0.001, startPoint[1]],
      [startPoint[0] - 0.00087, startPoint[1] - 0.0005],
      [startPoint[0] - 0.00087, startPoint[1] + 0.0005],
    ];

    const potentialEndPoint = [
      [endPoint[0] + 0.001, endPoint[1]],
      [endPoint[0] - 0.00087, endPoint[1] - 0.0005],
      [endPoint[0] - 0.00087, endPoint[1] + 0.0005],
    ];

    for (let index = 0; index < polygons.length; index++) {
      const polygon = polygons[index];
      if (
        this.isSegmentinPolygon(
          potentialStartPoint[0],
          potentialEndPoint[0],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[0],
          potentialEndPoint[1],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[0],
          potentialEndPoint[2],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[1],
          potentialEndPoint[0],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[1],
          potentialEndPoint[1],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[1],
          potentialEndPoint[2],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[2],
          potentialEndPoint[0],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[2],
          potentialEndPoint[1],
          polygon
        ) &&
        this.isSegmentinPolygon(
          potentialStartPoint[2],
          potentialEndPoint[2],
          polygon
        )
      ) {
        return true;
      }
    }
    return false;
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

  kickPointOutofPolygon(point, polygon) {
    let nearestPoint = [0, 0];
    let smallestDistance = Number.MAX_SAFE_INTEGER;

    polygon.forEach((edge, index) => {
      const projection = this.projectPointOntoSegment(
        point,
        edge,
        polygon[(index + 1) % polygon.length]
      );
      const distance = this.distance(point, projection);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestPoint = projection;
      }
    });

    return nearestPoint;
  }

  getIndexandDistanceOfNearestVertexInPolygon(point, listOfPoints) {
    let nearestIndex = 0;
    let smallestDistance = Number.MAX_SAFE_INTEGER;

    listOfPoints.forEach((listPoint, index) => {
      const distance = this.distance(point, listPoint);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    });

    return [nearestIndex, smallestDistance];
  }

  getPointRotatedAroundPoint(point, center, angleDeg) {
    const angleRad = angleDeg * (Math.PI / 180); // Convert angle from degrees to radians
    const x = point[0],
      y = point[1];
    const xc = center[0],
      yc = center[1];

    const xPrime =
      (x - xc) * Math.cos(angleRad) - (y - yc) * Math.sin(angleRad) + xc;
    const yPrime =
      (x - xc) * Math.sin(angleRad) + (y - yc) * Math.cos(angleRad) + yc;

    return [xPrime, yPrime];
  }

  kickPointOutOfPolygons(point, polygons) {
    for (let polygon of polygons)
      if (this.isPointinOpenPolygon(point, polygon))
        return this.kickPointOutofPolygon(point, polygon);
    return [point[0], point[1]];
  }

  isSegmentInPolygons(start, end, polygons) {
    for (let polygon of polygons)
      if (this.isSegmentinPolygon(start, end, polygon))
        return true;
    return false;
  }

  getPath(startPoint, endPoint, pathNodes, pathEdges, terrainNodes) {
    startPoint = [startPoint[0], startPoint[1]];
    endPoint = this.kickPointOutOfPolygons(endPoint, terrainNodes);

    const startEdges = [];
    const potentialStartPoints = [
      [startPoint[0] + 0.001, startPoint[1]],
      [startPoint[0] - 0.00087, startPoint[1] - 0.0005],
      [startPoint[0] - 0.00087, startPoint[1] + 0.0005],
    ];

    pathNodes.forEach((node, index) => {
      if (
        !terrainNodes.some((terrain) =>
          this.isSegmentinPolygon(potentialStartPoints[0], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          this.isSegmentinPolygon(potentialStartPoints[1], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          this.isSegmentinPolygon(potentialStartPoints[2], node, terrain)
        )
      ) {
        startEdges.push([index, this.distance(startPoint, node)]);
      }
    });

    const endEdges = [];
    const potentialEndPoints = [
      [endPoint[0] + 0.001, endPoint[1]],
      [endPoint[0] - 0.00087, endPoint[1] - 0.0005],
      [endPoint[0] - 0.00087, endPoint[1] + 0.0005],
    ];
    pathNodes.forEach((node, index) => {
      if (
        !terrainNodes.some((terrain) =>
          this.isSegmentinPolygon(potentialEndPoints[0], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          this.isSegmentinPolygon(potentialEndPoints[1], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          this.isSegmentinPolygon(potentialEndPoints[2], node, terrain)
        )
      ) {
        endEdges.push([index, this.distance(endPoint, node)]);
      }
    });

    if (
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[0],
          potentialEndPoints[0],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[0],
          potentialEndPoints[1],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[0],
          potentialEndPoints[2],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[1],
          potentialEndPoints[0],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[1],
          potentialEndPoints[1],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[1],
          potentialEndPoints[2],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[2],
          potentialEndPoints[0],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[2],
          potentialEndPoints[1],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        this.isSegmentinPolygon(
          potentialStartPoints[2],
          potentialEndPoints[2],
          terrain
        )
      )
    ) {
      return { x: [endPoint[0]], y: [endPoint[1]] };
    }

    //Make temporary editions to the the pathing graph
    pathNodes.push(startPoint, endPoint); //You can get random stuff happening
    pathEdges.push(startEdges);

    endEdges.forEach((edge) => {
      pathEdges[edge[0]].push([pathNodes.length - 1, edge[1]]);
    });

    const path = this.aStar(
      pathNodes.length - 2,
      pathNodes.length - 1,
      pathNodes,
      pathEdges
    );

    if (path == "No path found") {
      //oops something is broken check the point utils
      console.log(
        "No path found. Details:",
        "\nStart Edges:",
        startEdges,
        "\nEnd Edges:",
        endEdges,
        "\nStart Coordinates:",
        startPoint,
        "\nEnd Coordinates:",
        endPoint,
        "\nStart inside terrain:",
        terrainNodes.some((terrain) =>
          this.isPointinOpenPolygon(startPoint, terrain)
        ),
        "\nEnd inside terrain:",
        terrainNodes.some((terrain) =>
          this.isPointinOpenPolygon(endPoint, terrain)
        )
      );
    }

    //Transform the raw path into a entity movement path
    path.shift();
    if (this.distance(startPoint, pathNodes[path[0]]) == 0) {
      path.shift();
    }

    const output = { x: [], y: [] };
    path.forEach((index) => {
      output.x.push(pathNodes[index][0]);
      output.y.push(pathNodes[index][1]);
    });

    //Cleanup the graph
    pathNodes.length -= 2;
    pathEdges.length -= 1;
    endEdges.forEach((edge) => {
      pathEdges[edge[0]].length -= 1;
    });
    return output;
  }

  projectPointOntoCircle(point, center, radius) {
    const relX = point[0] - center[0];
    const relY = point[1] - center[1];
    const scale = radius / Math.sqrt(relX * relX + relY * relY);
    return [relX * scale + center[0], relY * scale + center[1]];
  }
}

const pointUtils = new PointUtils();

module.exports =  pointUtils ;
