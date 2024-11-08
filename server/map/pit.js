const TerrainPather = require("./terrain/terrain_pather");

class Pit {
    constructor(terrains, entitySizes) {
        this.terrains = terrains;
        this.terrainPathers = {};
        entitySizes.forEach(entitySize => {
            this.terrainPathers[entitySize] = new TerrainPather(terrains, entitySize / 2);
        });
    }

    getPath(startPoint, endPoint) {
        
    }
}

module.exports = Pit;