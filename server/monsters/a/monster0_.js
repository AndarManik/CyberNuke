const {
  Direction,
  Position,
  Path,
  Radius,
  Target,
} = require("../../entity-components/components.js");
const AMonsterBullet = require("./monster0_bullet.js");

class AMonster0 {
  constructor(engine, pit, entityX, entityY, pathId) {
    this.engine = engine;
    this.entity = this.engine.newEntity(this, "dynamic", "targetable");

    this.range = 250;

    this.pit = pit;
    this.position = new Position(entityX, entityY);
    this.radius = new Radius(10);
    this.path = new Path(this.engine, this.position, 80, pit);
    this.direction = new Direction(this.engine, 8);
    this.target = new Target(
      this.position,
      this.radius,
      this.range,
      pit.playersInside
    );

    this.pathDevX = Math.cos(2.39 * pathId) * 3; //This is a random bias for the entity direction it makes them move in different place without much work. Can look silly.
    this.pathDevY = Math.sin(2.39 * pathId) * 3;

    this.color = pit.color;
    this.maxHealth = 300;
    this.health = 300;

    this.bullet = null;

    this.state = this.walkingBack;
    this.walkingBackStarted = false;
    this.shootingStarted = false;
    this.bulletShot = false;
    this.lastShot = this.engine.newEvent();
    this.firstShot = true;
  }

  update() {
    if (this.health == 0) this.entity.remove();
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
      this.firstShot = true;
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

    const canShoot = this.lastShot.timeSince() > 4 || this.firstShot;
    const inDistance = playerDistance <= 75;

    if (canShoot && inDistance) {
      this.firstShot = false;
      this.state = this.shooting;
      return;
    }

    const engageDistance = canShoot ? 75 : 150;

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

  shooting() {
    if (!this.shootingStarted) {
      this.lastShot.update();
      this.path.movespeed = 0;
      this.shootingStarted = true;
    }

    if (this.pit.playersInside.length == 0) {
      this.path.movespeed = 80;
      this.state = this.walkingBack;
      this.shootingStarted = false;
      return;
    }

    if (this.lastShot.timeSince() > 0.5) {
      this.path.movespeed = 80;
      this.state = this.active;
      this.shootingStarted = false;
      this.bulletShot = false;
      return;
    }

    const nearestPlayer = this.pit.getDistanceToPlayersInside([
      this.position.x,
      this.position.y,
    ])[0].player;

    if (this.lastShot.timeSince() > 0.1 && !this.bulletShot) {
      this.bulletShot = true;
      this.bullet = new AMonsterBullet(
        this.engine,
        nearestPlayer.id,
        this.position.x,
        this.position.y,
        this.pit.color,
        this
      );
    }

    this.direction.turnTo(
      this.position.x,
      this.position.y,
      nearestPlayer.position.x,
      nearestPlayer.position.y
    );
  }

  getState() {
    const state = [];
    state.push({
      type: "a0monster0",
      entityX: this.position.x,
      entityY: this.position.y,
      id: this.id,
      color: this.color,
      maxHealth: this.maxHealth,
      health: this.health,
      direction: this.direction.current,
    });
    if (this.bullet) state.push(this.bullet.getState());
    return state;
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
  }
}

module.exports = AMonster0;
