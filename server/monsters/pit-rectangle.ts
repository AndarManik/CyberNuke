import { ColorSuite } from "../engine/values";
import pointUtils from "../point-utils";
import { v4 as uuidv4 } from "uuid";
class PitRectangleEntity {
  entityX: number;
  entityY: number; 
  width: number;
  height: number;
  rotation: number;

  constructor(entityX: number, entityY: number, width: number, height: number, rotation: number = 0) {
    this.entityX = entityX;
    this.entityY = entityY;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
  }

  getState(translateX: number, translateY: number, color: string) {
    return {
      type: "rectangle",
      id: uuidv4(),
      entityX: this.entityX + translateX,
      entityY: this.entityY + translateY,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      color: color
    };
  }

  getGraph() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    const nodes:[number,number][] = [
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

    return nodes.map((point) =>
      pointUtils.getPointRotatedAroundPoint(
        point,
        [this.entityX, this.entityY],
        this.rotation
      )
    );
  }
}

export default PitRectangleEntity;
