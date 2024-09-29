class TerrainPather {
  constructor(terrains, padding) {
    this.terrains = terrains;
    this.padding = padding;

    this.pathVerticies = [];
    this.terrains.forEach((terrain) =>
      this.pathVerticies.push(...terrain.pathVerticies(padding))
    );
  }
}

module.exports = TerrainPather;
