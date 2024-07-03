const { entities, pits } = require("../state.js");
const { v4: uuidv4 } = require("uuid");
const { pointUtils } = require("../point-utils.js");

class A0MonsterPitEntity {
  constructor(entityX, entityY) {
    this.id = uuidv4();
    entities[this.id] = this;
    pits[this.id] = this;

    this.entityX = entityX;
    this.entityY = entityY;
    this.pitRadius = 100;

    this.terrainNodes = [];
    this.terrainEdges = [];

    this.pathNodes = [];

    this.terrain = [];

    this.terrain.push(new PitRectangleEntity(this, -50, 12.5, 50, 50));
    this.terrain.push(new PitRectangleEntity(this, 50, -12.5, 50, 50));

    this.buildPathingGraphGeneral(this.terrain);
  }

  update() {}

  getState() {
    return {
      type: "pit",
      entityX: this.entityX,
      entityY: this.entityY,
      id: this.id,
      radius: this.pitRadius,
    };
  }

  buildPathingGraphGeneral(terrain) {
    this.terrainNodes = terrain.map((terr) => {
      return terr.getGraph()[0];
    });
    const graphData = pointUtils.buildPathingGraphFromPolygons(
      this.terrainNodes
    );
    this.pathNodes = graphData[0];
    this.pathEdges = graphData[1];
    console.log(this.pathNodes,this.pathEdges);
  }

  buildPathingGraph(terrain) {
    const [nodes1, edges1] = terrain[0].getGraph();
    const [nodes2, edges2] = terrain[1].getGraph();

    const edgesToAdd = new Array(16).fill().map(() => []);

    nodes1.forEach((node1, indexn1) => {
      nodes2.forEach((node2, indexn2) => {
        let obstructed = false;

        edges1.forEach((edge1, indexe1) => {
          if (indexe1 % 2 == 0 && indexe1 != indexn1 && !obstructed) {
            edge1.forEach((edgeNode) => {
              if (edgeNode[0] != indexn1 && !obstructed) {
                obstructed = pointUtils.checkIntersection(
                  node1,
                  node2,
                  nodes1[indexe1],
                  nodes1[edgeNode[0]]
                );
              }
            });
          }
        });

        edges2.forEach((edge2, indexe2) => {
          if (indexe2 % 2 == 0 && indexe2 != indexn2 && !obstructed) {
            edge2.forEach((edgeNode) => {
              if (edgeNode[0] != indexn2 && !obstructed) {
                obstructed = pointUtils.checkIntersection(
                  node1,
                  node2,
                  nodes2[indexe2],
                  nodes2[edgeNode[0]]
                );
              }
            });
          }
        });

        if (!obstructed) {
          const distance = pointUtils.distance(node1, node2);
          edgesToAdd[indexn1].push([indexn2 + 8, distance]);
          edgesToAdd[indexn2 + 8].push([indexn1, distance]);
        }
      });
    });

    edges2.forEach((edge) => {
      edge.forEach((node) => {
        node[0] += 8;
      });
    });

    this.pathNodes.push(...nodes1, ...nodes2);
    this.pathEdges.push(...edges1, ...edges2);

    this.pathEdges.forEach((edge, index) => {
      edge.push(...edgesToAdd[index]);
    });
  }

  isPointInPit(startX, startY, endX, endY) {
    return pointUtils.isSegmentIntersectingCircle(
      [startX, startY],
      [endX, endY],
      [this.entityX, this.entityY],
      this.pitRadius
    );
  }

  getPath(startX, startY, endX, endY) {
    if (
      !this.terrainNodes.some((terrain) =>
        pointUtils.isSegmentinPolygon([startX, startY], [endX, endY], terrain)
      )
    ) {
      console.log("no colision");
      return { x: [endX], y: [endY] };
    }

    const startEdges = [];

    this.pathNodes.forEach((node, index) => {
      if (
        !this.terrainNodes.some((terrain) =>
          pointUtils.isSegmentinPolygon([startX, startY], node, terrain)
        )
      ) {
        const distance = pointUtils.distance([startX, startY], node);
        startEdges.push([index, distance]);
      }
    });

    const endEdges = [];

    this.pathNodes.forEach((node, index) => {
      if (
        !this.terrainNodes.some((terrain) =>
          pointUtils.isSegmentinPolygon([endX, endY], node, terrain)
        )
      ) {
        const distance = pointUtils.distance([endX, endY], node);
        endEdges.push([index, distance]);
      }
    });

    this.pathNodes.push([startX, startY], [endX, endY]);
    this.pathEdges.push(startEdges);

    endEdges.forEach((edge) => {
      this.pathEdges[edge[0]].push([17, edge[1]]);
    });

    const path = pointUtils.aStar(16, 17, this.pathNodes, this.pathEdges);

    path.shift();
    if (
      this.pathNodes[path[0]][0] == startX &&
      this.pathNodes[path[0]][1] == startY
    )
      path.shift();
    const output = { x: [], y: [] };
    path.forEach((index) => {
      output.x.push(this.pathNodes[index][0]);
      output.y.push(this.pathNodes[index][1]);
    });

    this.pathNodes.length -= 2;
    this.pathEdges.length -= 1;
    endEdges.forEach((edge) => {
      this.pathEdges[edge[0]].length -= 1;
    });
    return output;
  }
}

class PitRectangleEntity {
  constructor(pit, relX, relY, width, height) {
    this.id = uuidv4();
    entities[this.id] = this;

    this.entityX = pit.entityX - relX;
    this.entityY = pit.entityY - relY;

    this.width = width;
    this.height = height;
  }

  update() {}

  getState() {
    return {
      type: "pit rectangle",
      entityX: this.entityX,
      entityY: this.entityY,
      id: this.id,
      width: this.width,
      height: this.height,
    };
  }

  getGraph() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    const truncLength = Math.SQRT2 * 10; //10 * 10
    const nodes = [
      //This represents a square with 10 padding but also truncated at the corners. This simulates a circles path around a rectangle

      [this.entityX - halfWidth - 10, this.entityY - halfHeight], //0
      [this.entityX - halfWidth, this.entityY - halfHeight - 10], //1

      [this.entityX + halfWidth, this.entityY - halfHeight - 10], //2
      [this.entityX + halfWidth + 10, this.entityY - halfHeight], //3

      [this.entityX + halfWidth + 10, this.entityY + halfHeight], //4
      [this.entityX + halfWidth, this.entityY + halfHeight + 10], //5

      [this.entityX - halfWidth, this.entityY + halfHeight + 10], //6
      [this.entityX - halfWidth - 10, this.entityY + halfHeight], //7
    ];
    const edges = [
      [
        [7, this.height],
        [1, truncLength],
      ],
      [
        [0, truncLength],
        [2, this.width],
      ],

      [
        [1, this.width],
        [3, truncLength],
      ],
      [
        [2, truncLength],
        [4, this.height],
      ],

      [
        [3, this.height],
        [5, truncLength],
      ],
      [
        [4, truncLength],
        [6, this.width],
      ],

      [
        [5, this.width],
        [7, truncLength],
      ],
      [
        [6, truncLength],
        [0, this.height],
      ],
    ];

    return [nodes, edges];
  }
}

class A0Monster {
  update() {}

  getState() {}
}

module.exports = { A0MonsterPitEntity };
