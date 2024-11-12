import { Targeted } from "../engine/entity";
import Position from "./position";
import Radius from "./radius";

const pointUtils = require("../point-utils");

class Target {
  position: Position;
  radius: Radius;
  range: number;
  targetableList: Targeted[];
  constructor(
    position: Position,
    radius: Radius,
    range: number,
    targetableList: Targeted[]
  ) {
    this.position = position;
    this.radius = radius;
    this.range = range;
    this.targetableList = targetableList;
  }

  nearest() {
    const sortedTargetable = this.targetableList
      .map((targetable) => {
        return {
          entity: targetable,
          distance:
            pointUtils.distance(
              [this.position.x, this.position.y],
              [targetable.position.x, targetable.position.y]
            ) -
            this.radius.current -
            targetable.radius.current,
        };
      })
      .filter(
        (targetable) =>
          targetable.distance < this.range &&
          targetable.entity.position != this.position
      )
      .sort((a, b) => a.distance - b.distance);

    if (sortedTargetable.length == 0) {
      return null;
    }

    return sortedTargetable[0];
  }

  point(selectionPoint: [number, number]) {
    const sortedTargetable = this.targetableList
      .map((targetable) => {
        return {
          entity: targetable,
          distance:
            pointUtils.distance(
              [this.position.x, this.position.y],
              [targetable.position.x, targetable.position.y]
            ) -
            this.radius.current -
            targetable.radius.current,
        };
      })
      .filter(
        (targetable) =>
          targetable.distance < this.range &&
          targetable.entity.position != this.position
      )
      .map((targetable) => {
        targetable.distance =
          pointUtils.distance(
            [selectionPoint[0], selectionPoint[1]],
            [targetable.entity.position.x, targetable.entity.position.y]
          ) - targetable.entity.radius.current;
        return targetable;
      })
      .sort((a, b) => a.distance - b.distance);

    if (sortedTargetable.length == 0) {
      return null;
    }

    return sortedTargetable[0].entity;
  }
}

export default Target;
