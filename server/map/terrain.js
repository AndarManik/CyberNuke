const PaddedCorner = require("./padded-corner");
const PaddedEdge = require("./padded-edge");

class Terrain {
  constructor(vertices) {
    this.vertexCount = vertices.length;

    this.paddedVertices = new Map();
    this.paddedCollider = new Map();

    this.paddedCorners = [];
    this.paddedEdges = [];

    for (let index = 0; index < vertexCount; index++) {
      const currentVertex = vertices[index];
      const nextVertex = vertices[(index + 1) % vertexCount];

      this.paddedCorners.push(new PaddedCorner(currentVertex));
      this.paddedEdges.push(new PaddedEdge(currentVertex, nextVertex));
    }
  }

  buildPadded(padding) {
    const paddedVertices = [];

    for (let index = 0; index < this.vertexCount; index++) {
        paddedVertices.push()
    }
  }
}

module.exports = Terrain;
