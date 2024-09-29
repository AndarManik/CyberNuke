const pointUtils = require("../point-utils");

class Target {
  constructor(position, radius, range, targetableList) {
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

  point(selectionPoint) {
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

module.exports = { Target };
