const Corner = require("./corner");
const Edge = require("./edge");

class Shape {
  constructor(points) {
    this.corners = [];
    this.edges = [];

    for (let index = 0; index < points.length; index++) {
      const prev = points[(index + points.length - 1) % points.length];
      const curr = points[index];
      const next = points[(index + 1) % points.length];

      this.corners.push(new Corner(prev, curr, next));
      this.edges.push(new Edge(curr, next));
    }
  }
}

module.exports = Shape;