const { pointUtils } = require("./point-utils.js");

class PathCalculator {
  constructor() {
    this.gridSize = 1000;
    this.numberOfGrids = 7;
    this.terrainGrid = Array.from({ length: this.numberOfGrids }, () =>
      Array.from({ length: this.numberOfGrids }, () => [])
    );
    this.pathNodeGrid = Array.from({ length: this.numberOfGrids }, () =>
      Array.from({ length: this.numberOfGrids }, () => [])
    );
    this.pathEdgeGrid = Array.from({ length: this.numberOfGrids }, () =>
      Array.from({ length: this.numberOfGrids }, () => [])
    );
    this.terrainString = "";
    this.terrainForString = [];
  }

  positionToGridIndex(position) {
    const indexX = Math.floor(
      (position[0] + (this.gridSize * this.numberOfGrids) / 2) / this.gridSize
    );
    const indexY = Math.floor(
      (position[1] + (this.gridSize * this.numberOfGrids) / 2) / this.gridSize
    );
    return [indexX, indexY];
  }

  addTerrain(...terrains) {
    terrains.forEach((terrain) => {
      const gridIndex = this.positionToGridIndex([
        terrain.entityX,
        terrain.entityY,
      ]);
      this.terrainGrid[gridIndex[0]][gridIndex[1]].push(terrain.getGraph());
    });
    this.terrainForString.push(...terrains.map(terrain => terrain.getState()));
  }

  build() {
    this.terrainGrid.forEach((terrainList, indexX) => {
      terrainList.forEach((terrain, indexY) => {
        if(terrain.length == 0) return;
        
        const pathData = pointUtils.buildPathingGraphFromPolygons(terrain);
        this.pathNodeGrid[indexX][indexY] = pathData[0];
        this.pathEdgeGrid[indexX][indexY] = pathData[1];
      });
    });
    this.terrainString = JSON.stringify({terrain: this.terrainForString});
    this.terrainForString = [];
  }

  getPath(startPoint, endPoint) {
    const macroPathData = this.getMacroPath(startPoint, endPoint);
    const macroIndex = macroPathData[0];
    const macroPath = macroPathData[1];

    const pathX = [];
    const pathY = [];

    macroIndex.forEach((gridIndex, index) => {
      if (index == macroIndex.length - 1) return;

      const microPath = this.getMicroPath(
        macroPath[index],
        macroPath[index + 1],
        this.pathNodeGrid[gridIndex[0]][gridIndex[1]],
        this.pathEdgeGrid[gridIndex[0]][gridIndex[1]],
        this.terrainGrid[gridIndex[0]][gridIndex[1]]
      );

      microPath.length--;

      pathX.push(...microPath.x);
      pathY.push(...microPath.y);
    });

    return { x: pathX, y: pathY };
  }

  getMacroPath(startPoint, endPoint) {
    const xDir = endPoint[0] - startPoint[0];
    const yDir = endPoint[1] - startPoint[1];
    const boundaryIndex = this.getPathBoundaryIndex(startPoint, endPoint);
    let currentGrid = boundaryIndex[0];
    const endGrid = boundaryIndex[1];

    const macroIndex = [];
    const macroPath = [];
    macroIndex.push(currentGrid);
    macroPath.push(startPoint);

    while (true) {
      if (currentGrid[0] == endGrid[0] && currentGrid[1] == endGrid[1]) {
        macroIndex.push(endGrid);
        macroPath.push(endPoint);
        return [macroIndex, macroPath];
      }

      const posX =
        currentGrid[0] * this.gridSize -
        (this.gridSize * this.numberOfGrids) / 2;
      const posY =
        currentGrid[1] * this.gridSize -
        (this.gridSize * this.numberOfGrids) / 2;

      const xCheck =
        xDir > 0
          ? [
              [posX + this.gridSize, posY],
              [posX + this.gridSize, posY + this.gridSize],
            ]
          : [
              [posX, posY],
              [posX, posY + this.gridSize],
            ];

      const yCheck =
        yDir > 0
          ? [
              [posX, posY + this.gridSize],
              [posX + this.gridSize, posY + this.gridSize],
            ]
          : [
              [posX, posY],
              [posX + this.gridSize, posY],
            ];
      //console.log("xCheck: ", xCheck);
      //console.log("yCheck: ", yCheck);
      if (
        pointUtils.checkOpenIntersection(
          startPoint,
          endPoint,
          xCheck[0],
          xCheck[1]
        )
      ) {
        if (xDir > 0) {
          currentGrid = [currentGrid[0] + 1, currentGrid[1]];
        } else {
          currentGrid = [currentGrid[0] - 1, currentGrid[1]];
        }
        const yPos =
          ((xCheck[0][0] - startPoint[0]) * (endPoint[1] - startPoint[1])) /
            (endPoint[0] - startPoint[0]) +
          startPoint[1];
        macroIndex.push(currentGrid);
        macroPath.push([xCheck[0][0], yPos]);
      } else {
        if (
          pointUtils.checkOpenIntersection(
            startPoint,
            endPoint,
            yCheck[0],
            yCheck[1]
          )
        ) {
          if (yDir > 0) {
            currentGrid = [currentGrid[0], currentGrid[1] + 1];
          } else {
            currentGrid = [currentGrid[0], currentGrid[1] - 1];
          }
          const xPos =
            ((yCheck[0][1] - startPoint[1]) * (endPoint[0] - startPoint[0])) /
              (endPoint[1] - startPoint[1]) +
            startPoint[0];
          macroIndex.push(currentGrid);
          macroPath.push([xPos, yCheck[0][1]]);
        } else {
          currentGrid = [
            currentGrid[0] + (xDir > 0 ? 1 : -1),
            currentGrid[1] + (yDir > 0 ? 1 : -1),
          ];
          macroIndex.push(currentGrid);
          macroPath.push([xCheck[0][0], yCheck[0][1]]);
        }
      }
    }
  }

  getPathBoundaryIndex(startPoint, endPoint) {
    const startIndex = this.positionToGridIndex(startPoint);
    const endIndex = this.positionToGridIndex(endPoint);
    if (startPoint[0] % this.gridSize == 0 && endPoint[0] < startPoint[0]) {
      startIndex[0] -= 1;
    }
    if (startPoint[1] % this.gridSize == 0 && endPoint[1] < startPoint[1]) {
      startIndex[1] -= 1;
    }
    if (endPoint[0] % this.gridSize == 0 && endPoint[0] > startPoint[0]) {
      endIndex[0] -= 1;
    }
    if (endPoint[1] % this.gridSize == 0 && endPoint[1] > startPoint[1]) {
      endIndex[1] -= 1;
    }
    return [startIndex, endIndex];
  }

  getMicroPath(startPoint, endPoint, pathNodes, pathEdges, terrainNodes) {
    startPoint = [startPoint[0], startPoint[1]];
    endPoint = [endPoint[0], endPoint[1]];
    terrainNodes.forEach((terrain) => {
      if (pointUtils.isPointinOpenPolygon(endPoint, terrain)) {
        const projection = pointUtils.kickPointOutofPolygon(endPoint, terrain);
        endPoint[0] = projection[0];
        endPoint[1] = projection[1];
      }
    });

    const startEdges = [];
    const potentialStartPoints = [
      [startPoint[0] + 0.001, startPoint[1]],
      [startPoint[0] - 0.00087, startPoint[1] - 0.0005],
      [startPoint[0] - 0.00087, startPoint[1] + 0.0005],
    ];

    pathNodes.forEach((node, index) => {
      if (
        !terrainNodes.some((terrain) =>
          pointUtils.isSegmentinPolygon(potentialStartPoints[0], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          pointUtils.isSegmentinPolygon(potentialStartPoints[1], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          pointUtils.isSegmentinPolygon(potentialStartPoints[2], node, terrain)
        )
      ) {
        startEdges.push([index, pointUtils.distance(startPoint, node)]);
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
          pointUtils.isSegmentinPolygon(potentialEndPoints[0], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          pointUtils.isSegmentinPolygon(potentialEndPoints[1], node, terrain)
        ) ||
        !terrainNodes.some((terrain) =>
          pointUtils.isSegmentinPolygon(potentialEndPoints[2], node, terrain)
        )
      ) {
        endEdges.push([index, pointUtils.distance(endPoint, node)]);
      }
    });

    if (
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[0],
          potentialEndPoints[0],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[0],
          potentialEndPoints[1],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[0],
          potentialEndPoints[2],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[1],
          potentialEndPoints[0],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[1],
          potentialEndPoints[1],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[1],
          potentialEndPoints[2],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[2],
          potentialEndPoints[0],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
          potentialStartPoints[2],
          potentialEndPoints[1],
          terrain
        )
      ) ||
      !terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon(
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

    const path = pointUtils.aStar(
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
          pointUtils.isPointinOpenPolygon(startPoint, terrain)
        ),
        "\nEnd inside terrain:",
        terrainNodes.some((terrain) =>
          pointUtils.isPointinOpenPolygon(endPoint, terrain)
        )
      );
    }

    //Transform the raw path into a entity movement path
    path.shift();
    if (pointUtils.distance(startPoint, pathNodes[path[0]]) == 0) {
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
}

const pathCalculator = new PathCalculator();
module.exports = { pathCalculator };
