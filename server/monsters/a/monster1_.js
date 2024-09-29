const DamageIndicatorEntity = require("../../damage-indicator.js");
const {
  Direction,
  Position,
  Path,
  Radius,
  Target,
} = require("../../entity-components/components.js");
const pointUtils = require("../../point-utils.js");

class AMonster1 {
  constructor(engine, pit, entityX, entityY, pathId) {
    this.engine = engine;

    this.entity = this.engine.newEntity(this, "dynamic", "targetable");

    this.range = 250;

    this.pit = pit;
    this.position = new Position(entityX, entityY);
    this.radius = new Radius(15);
    this.path = new Path(this.engine, this.position, 80, pit);
    this.direction = new Direction(this.engine, 8);
    this.target = new Target(
      this.position,
      this.radius,
      this.range,
      pit.playersInside
    );
    this.pathId = pathId;
    this.pathDevX = Math.cos(2.39 * pathId) * 3;
    this.pathDevY = Math.sin(2.39 * pathId) * 3;

    this.color = pit.color;
    this.maxHealth = 500;
    this.health = 500;

    this.damage = 50;
    this.dashSpeed = 400;

    this.state = this.walkingBack;
    this.walkingBackStarted = false;
    this.lastDash = this.engine.newEvent();
    this.firstDash = true;
  }

  update() {
    if (this.health == 0) {
      this.entity.remove();
    }
    this.state();

    this.path.isMoving = true;
    this.path.update();

    this.direction.update();
  }

  walkingBack() {
    if (this.pit.playersInside.length > 0) {
      this.walkingBackStarted = false;
      this.state = this.active;
      return;
    }

    if (this.position.isAtStart() && this.health == this.maxHealth) {
      this.firstDash = true;
      this.direction.turnTo(
        this.position.x,
        this.position.y,
        this.position.x,
        this.position.y
      );
      return;
    }

    if (!this.walkingBackStarted) {
      this.path.setPath(this.position.startX, this.position.startY);
      this.walkingBackStarted = true;
    }

    this.direction.turnTo(
      this.position.x,
      this.position.y,
      this.path.pathX[0],
      this.path.pathY[0]
    );
    this.health = Math.min(this.maxHealth, this.health + 100 / 60);
  }

  active() {
    if (this.pit.playersInside.length == 0) {
      this.state = this.walkingBack;
      return;
    }

    const nearestPlayerData = this.target.nearest();
    const nearestPlayer = nearestPlayerData.entity;
    const playerDistance = nearestPlayerData.distance;

    const canShoot = this.lastDash.timeSince() > 4 || this.firstDash;
    const inDistance = playerDistance <= 30;

    if (
      canShoot &&
      inDistance &&
      !this.pit.isLineInTerrain(
        [this.position.x, this.position.y],
        [nearestPlayer.position.x, nearestPlayer.position.y]
      )
    ) {
      this.firstDash = false;
      this.state = this.dashing;
      return;
    }

    const engageDistance = canShoot ? 0 : 75;

    const xDif = this.position.x - nearestPlayer.position.x;
    const yDif = this.position.y - nearestPlayer.position.y;
    const distance = Math.sqrt(xDif * xDif + yDif * yDif);
    const preDestination = [
      (engageDistance * xDif) / distance +
        nearestPlayer.position.x +
        this.pathDevX,
      (engageDistance * yDif) / distance +
        nearestPlayer.position.y +
        this.pathDevY,
    ];

    const destination = this.pit.projectPointInto(preDestination);

    this.path.setPath(destination[0], destination[1]);
    this.direction.turnTo(
      this.position.x,
      this.position.y,
      this.path.pathX[0],
      this.path.pathY[0]
    );
  }

  dashing() {
    if (!this.dashingStarted) {
      this.lastDash.update();
      this.path.reset();
      this.playersHit = {};
      this.distanceDashed = 0;
      this.dashingStarted = true;
    }

    if (this.pit.playersInside.length == 0) {
      this.state = this.walkingBack;
      this.dashingStarted = false;
      return;
    }

    if (this.lastDash.timeSince() < 0.5) {
      const nearestPlayer = this.pit.getDistanceToPlayersInside([
        this.position.x,
        this.position.y,
      ])[0].player;

      this.direction.turnTo(
        this.position.x,
        this.position.y,
        nearestPlayer.position.x,
        nearestPlayer.position.y
      );
      return;
    }

    const distance = this.engine.getDelta() * this.dashSpeed;
    const targetPosition = this.direction.translate(
      [this.position.x, this.position.y],
      distance
    );
    const actualPosition = this.pit.projectPointInto(
      this.pit.kickOutTerrain(targetPosition)
    );
    this.position.x = actualPosition[0];
    this.position.y = actualPosition[1];

    this.distanceDashed += distance;

    if (this.pit.playersInside.length == 0) {
      this.state = this.walkingBack;
      this.dashingStarted = false;
    }

    this.pit.playersInside.forEach((player) => {
      if (
        !this.playersHit[player.id] &&
        pointUtils.distance(
          [this.position.x, this.position.y],
          [player.position.x, player.position.y]
        ) <=
          this.radius.current + player.radius.current
      ) {
        this.playersHit[player.id] = {};
        player.takeDamage(this.damage);
        new DamageIndicatorEntity(this.engine, this.damage, this.id, player.id);
      }
    });

    if (this.distanceDashed >= 120) {
      this.state = this.active;
      this.dashingStarted = false;
    }
  }

  getState() {
    return [
      {
        type: "a0monster1",
        entityX: this.position.x,
        entityY: this.position.y,
        id: this.id,
        color: this.color,
        maxHealth: this.maxHealth,
        health: this.health,
        direction: this.direction.current,
      },
    ];
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
  }
}

module.exports = AMonster1;
