const Shape = require("./shape");

class Terrain { 
    constructor(points){
        this.points = points;
        this.shape = new Shape(points);
    }
}

module.exports = Terrain;