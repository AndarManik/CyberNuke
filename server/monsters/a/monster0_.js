const AMonsterBullet = require("./monster0_bullet.js");

import Direction from "../../entity-components/direction";
import Health from "../../entity-components/health";
import Path from "../../entity-components/path";
import Position from "../../entity-components/position";
import Radius from "../../entity-components/radius";
import Target from "../../entity-components/target";

class AMonster0 {
  constructor(engine, pit, entityX, entityY, pathId) {
    this.engine = engine;
    this.pit = pit;

    this.entity = this.engine.newEntity(this, "targetable");

    this.health = new Health(engine, 300, 100);
    this.position = new Position(entityX, entityY);
    this.radius = new Radius(10);
    this.path = new Path(this.engine, this.position, 80, pit);
    this.direction = new Direction(this.engine, 8);
    this.target = new Target(
      this.position,
      this.radius,
      250,
      pit.playersInside
    );

    this.color = pit.color;

    this.pathDevX = Math.cos(2.39 * pathId) * 3; //This is a random bias for the entity direction it makes them move in different place without much work. Can look silly.
    this.pathDevY = Math.sin(2.39 * pathId) * 3;
    this.bullet = null;
    this.lastShot = this.engine.newEvent();
    this.bulletShot = false;
    this.firstShot = true;
    this.alive = true;

    this.behavior = this.walkingBack;
  }

  update() {
    this.removeIfDead();
    this.behavior();
    this.path.isMoving = true;
    this.path.update();
    this.direction.update();
  }

  removeIfDead() {
    if (this.health.isZero()) {
      this.entity.remove();
      this.alive = false;
    }
  }

  walkingBack() {
    const thereArePlayers = this.pit.playersInside.length > 0;
    if (thereArePlayers) {
      this.walkingBackStarted = false;
      this.behavior = this.active;
      return;
    }

    const monsterIsReset = this.position.isAtStart() && this.health.isFull();
    if (monsterIsReset) {
      this.firstShot = true;
      this.direction.turnToStart();
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

    if (this.position.isAtStart()) this.direction.turnToStart();
    this.health.update();
  }

  active() {
    const thereAreNoPlayers = this.pit.playersInside.length == 0;
    if (thereAreNoPlayers) {
      this.behavior = this.walkingBack;
      return;
    }

    const nearestPlayerData = this.target.nearest();
    const nearestPlayer = nearestPlayerData.entity;
    const playerDistance = nearestPlayerData.distance;

    const canShoot = this.lastShot.timeSince() > 4 || this.firstShot;
    const inDistance = playerDistance <= 75;

    if (canShoot && inDistance) {
      this.firstShot = false;
      this.behavior = this.shooting;
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

    const thereAreNoPlayers = this.pit.playersInside.length == 0;
    if (thereAreNoPlayers) {
      this.path.movespeed = 80;
      this.behavior = this.walkingBack;
      this.shootingStarted = false;
      return;
    }

    if (this.lastShot.timeSince() > 0.5) {
      this.path.movespeed = 80;
      this.behavior = this.active;
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
        this.color,
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
      bulletColor: this.color.weak.dark,
      bodyColor: this.color.weak.light,
      healthColor: this.color.health,
      maxHealth: this.health.max,
      health: this.health.current,
      direction: this.direction.current,
    });
    if (this.bullet) state.push(this.bullet.getState());
    return state;
  }

  takeDamage(amount) {
    this.health.takeDamage(amount);
  }
}

module.exports = AMonster0;
